/**
 * toolController.js — Tool Routing & Orchestration Layer
 *
 * ROUTING LOGIC:
 *   AI Tools (generative)  → promptBuilder → aiService
 *     paraphrase, humanize, enhance, restructure, tone, style
 *
 *   NLP Tools (analytical) → nlpService directly (no AI)
 *     keywordDensity, similarity, sentiment
 *
 *   Hybrid Tools           → NLP first → fallback to AI
 *     summarize, grammar, readability
 */

const aiService       = require('../services/aiService');
const nlpService      = require('../services/nlpService');
const { buildPrompt } = require('../utils/promptBuilder');

// ─── Routing classification (exported for docs/testing) ───────────────────────
const AI_TOOLS     = ['paraphrase', 'humanize', 'enhance', 'restructure', 'tone', 'style'];
const NLP_TOOLS    = ['keywordDensity', 'similarity', 'sentiment'];
const HYBRID_TOOLS = ['summarize', 'grammar', 'readability'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const validateText = (text, res) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ success: false, message: 'text is required and must be a non-empty string.' });
    return false;
  }
  if (text.trim().length > 10000) {
    res.status(400).json({ success: false, message: 'Text exceeds the 10,000 character limit.' });
    return false;
  }
  return true;
};
const respond = (res, tool, result, extra = {}) =>
  res.json({ success: true, tool, result, ...extra });
// ═══════════════════════════════════════════════════════════════════════════════
// AI TOOLS — Generative: validate → buildPrompt → aiService.generate
// ═══════════════════════════════════════════════════════════════════════════════
const handleAITool = (toolType) => async (req, res, next) => {
  try {
    const { text, mode = 'formal' } = req.body;
    if (!validateText(text, res)) return;
    const prompt = buildPrompt(toolType, text.trim(), mode);
    const result = await aiService.generate(prompt);
    respond(res, toolType, result, { mode });
  } catch (err) {
    next(err);
  }
};
const paraphrase   = handleAITool('paraphrase');
const humanize     = handleAITool('humanize');
const restructure  = handleAITool('restructure');
const toneRewrite  = handleAITool('tone');
const styleRewrite = handleAITool('style');

// POST /api/tools/enhance — respects tone, style, length options
const enhance = async (req, res, next) => {
  try {
    const { text, mode = 'formal', tone = 'professional', style = 'formal', length = 'same' } = req.body;
    if (!validateText(text, res)) return;
    const prompt = buildPrompt('enhance', text.trim(), mode, { tone, style, length });
    const result = await aiService.generate(prompt);
    respond(res, 'enhance', result, { mode, tone, style, length });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// NLP TOOLS — Analytical: nlpService only, zero AI calls
// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/tools/keyword-density  { text }
const keywordDensity = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!validateText(text, res)) return;
    const result = nlpService.getKeywordDensity(text.trim());
    respond(res, 'keywordDensity', result);
  } catch (err) {
    next(err);
  }
};

// POST /api/tools/similarity  { text1, text2 }
const similarity = async (req, res, next) => {
  try {
    const { text1, text2 } = req.body;
    if (!text1 || !text2 || !text1.trim() || !text2.trim()) {
      return res.status(400).json({ success: false, message: 'Both text1 and text2 are required.' });
    }
    const result = nlpService.getSimilarity(text1.trim(), text2.trim());
    respond(res, 'similarity', result);
  } catch (err) {
    next(err);
  }
};

// POST /api/tools/sentiment  { text }
const sentiment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!validateText(text, res)) return;
    const clean = text.trim();
    respond(res, 'sentiment', {
      sentiment: nlpService.getSentiment(clean),
      tone:      nlpService.getToneLabel(clean),
      pos:       nlpService.getPOSTags(clean),
    });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HYBRID TOOLS — NLP first, AI fallback
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/tools/summarize  { text, mode?, useAI? }
// DEFAULT: NLP extractive. AI only when useAI=true is explicitly sent.
const summarize = async (req, res, next) => {
  try {
    const { text, mode = 'formal', useAI = false } = req.body;
    if (!validateText(text, res)) return;
    const clean = text.trim();

    // Always try NLP first unless caller explicitly opts into AI
    if (!useAI) {
      const density   = nlpService.getKeywordDensity(clean);
      const topWords  = new Set(density.keywords.slice(0, 10).map((k) => k.word));
      const sentences = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);

      const scored = sentences.map((s) => ({
        sentence: s,
        score: nlpService.tokenize(s).filter((t) => topWords.has(t)).length,
      }));

      const topSentences = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.max(2, Math.ceil(sentences.length * 0.35)))
        .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
        .map((s) => s.sentence)
        .join(' ');

      // Return NLP result as long as we got something meaningful (≥5 words)
      if (topSentences.split(/\s+/).length >= 5) {
        return respond(res, 'summarize', topSentences, { method: 'nlp-extractive', mode });
      }
    }

    // AI fallback — only reached when useAI=true or text was too short for NLP
    const result = await aiService.generate(buildPrompt('summarize', clean, mode));
    respond(res, 'summarize', result, { method: 'ai-abstractive', mode });
  } catch (err) {
    next(err);
  }
};

// POST /api/tools/grammar  { text, mode?, useAI? }
// DEFAULT: NLP rule-based correction. AI only when useAI=true.
const grammar = async (req, res, next) => {
  try {
    const { text, mode = 'formal', useAI = false } = req.body;
    if (!validateText(text, res)) return;
    const clean = text.trim();

    if (!useAI) {
      const { original, corrected, totalFixes, corrections } = nlpService.correctGrammar(clean);
      const readScore = nlpService.getReadabilityScore(clean);

      // Build a human-readable output string
      const lines = [
        `✅ Corrected Text:`,
        `${corrected}`,
        ``,
        `📋 Corrections Made (${totalFixes}):`,
      ];

      if (corrections.length === 0) {
        lines.push('  No issues found.');
      } else {
        corrections.forEach((c, i) => {
          lines.push(`  ${i + 1}. [${c.type}] "${c.original}" → "${c.fixed}"`);
        });
      }

      lines.push(``);
      lines.push(`📊 Readability: ${readScore.grade} (Flesch score: ${readScore.score})`);
      lines.push(`   Avg sentence length: ${readScore.avgSentenceLength} words`);

      return respond(res, 'grammar', lines.join('\n'), { method: 'nlp-correction', totalFixes });
    }

    // AI only when explicitly requested
    const result = await aiService.generate(buildPrompt('grammar', clean, mode));
    respond(res, 'grammar', result, { method: 'ai-correction', mode });
  } catch (err) {
    next(err);
  }
};

// POST /api/tools/readability  { text, mode?, rewrite? }
// DEFAULT: NLP Flesch score only. AI rewrite only when rewrite=true.
const readability = async (req, res, next) => {
  try {
    const { text, mode = 'formal', rewrite = false } = req.body;
    if (!validateText(text, res)) return;
    const clean    = text.trim();
    const nlpScore = nlpService.getReadabilityScore(clean);

    // Always return NLP score. AI rewrite is opt-in only.
    if (!rewrite) {
      const report = [
        `Grade: ${nlpScore.grade}`,
        `Flesch Score: ${nlpScore.score}`,
        `Avg Sentence Length: ${nlpScore.avgSentenceLength} words`,
        `Avg Syllables/Word: ${nlpScore.avgSyllablesPerWord}`,
      ].join('\n');
      return respond(res, 'readability', report, { method: 'nlp-score', ...nlpScore });
    }

    // AI rewrite only when rewrite=true
    const result = await aiService.generate(buildPrompt('readability', clean, mode));
    respond(res, 'readability', { score: nlpScore, rewritten: result }, { method: 'ai-rewrite', mode });
  } catch (err) {
    next(err);
  }
};

// ─── Extra AI tools ───────────────────────────────────────────────────────────

// POST /api/tools/vocabulary  { text, mode? }
const vocabulary = handleAITool('vocabulary');

// POST /api/tools/word-choice  { text } — NLP-powered, no AI needed
const wordChoice = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!validateText(text, res)) return;
    const result = await nlpService.enhanceWordChoice(text.trim());
    respond(res, 'wordChoice', result, { method: 'nlp-wordpos-compromise' });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLAGIARISM DETECTION — Full NLP pipeline (no AI)
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/tools/plagiarism  { text }
const plagiarism = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!validateText(text, res)) return;

    const analysis = nlpService.detectPlagiarism(text.trim());

    // Return the human-readable report as `result` so ToolOutput renders it,
    // and attach the full structured data as `analysis` for programmatic use.
    res.json({
      success: true,
      tool: 'plagiarism',
      result: analysis.report,
      analysis,
    });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CITATION GENERATOR — Strict field-based (no NLP, no AI, no text validation)
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/tools/citation  { style, title, author, year, publisher?, url?, type? }
//
// Mode 2 is completely independent from Mode 1.
// It NEVER calls validateText(). It NEVER checks for inputText.
// All validation is field-driven inside nlpService.generateCitation().
const citation = async (req, res, next) => {
  try {
    // Accept fields either flat on the body or nested under `data` (legacy shape)
    const body = req.body || {};
    const data = body.data && typeof body.data === 'object' ? body.data : body;

    const { style, format, title, author, year, publisher, url, type } = {
      style:     body.style || body.format || (body.data && (body.data.style || body.data.format)),
      title:     data.title,
      author:    data.author,
      year:      data.year || data.date,
      publisher: data.publisher,
      url:       data.url,
      type:      data.type,
    };

    const output = nlpService.generateCitation({ title, author, year, publisher, url, style, type });

    if (output.status === 'error') {
      return res.status(400).json({ success: false, message: output.message });
    }

    res.json({
      success: true,
      tool: 'citation',
      result: `Your citation:\n${output.data}`,
      citation: output.data,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  paraphrase, humanize, enhance, restructure, toneRewrite, styleRewrite,
  vocabulary, wordChoice, plagiarism, citation,
  keywordDensity, similarity, sentiment,
  summarize, grammar, readability,
  AI_TOOLS, NLP_TOOLS, HYBRID_TOOLS,
};
