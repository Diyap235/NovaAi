const aiService = require('../services/aiService');

/**
 * Shared response wrapper for all tool controllers.
 * Keeps each handler lean — just call processWithAI(req, res, next, fn, toolName).
 */
const processWithAI = async (req, res, next, serviceFn, toolName) => {
  try {
    const { text, ...options } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'text field is required and must be a non-empty string.' });
    }

    if (text.length > 10000) {
      return res.status(400).json({ success: false, message: 'Text exceeds the 10,000 character limit.' });
    }

    const result = await serviceFn(text.trim(), options);

    res.json({
      success: true,
      data: {
        tool:          toolName,
        originalText:  text.trim(),
        processedText: result,
        wordCount:     text.trim().split(/\s+/).length,
        charCount:     text.trim().length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Individual tool handlers ─────────────────────────────────────────────────

const aiWritingAssistant = (req, res, next) =>
  processWithAI(req, res, next, aiService.improveWriting, 'AI Writing Assistant');

const grammarChecker = (req, res, next) =>
  processWithAI(req, res, next, aiService.checkGrammar, 'Grammar Checker');

const paraphraseText = (req, res, next) =>
  processWithAI(req, res, next, aiService.paraphraseText, 'Paraphrasing Tool');

const summarizeText = (req, res, next) =>
  processWithAI(req, res, next, aiService.summarizeText, 'Text Summarizer');

const toneAnalyzer = (req, res, next) =>
  processWithAI(req, res, next, aiService.analyzeTone, 'Tone Analyzer');

const plagiarismCheck = (req, res, next) =>
  processWithAI(req, res, next, aiService.detectPlagiarism, 'Plagiarism Detector');

// Citation generator has a different input shape — override directly
const citationGenerator = async (req, res, next) => {
  try {
    const { style = 'APA', ...fields } = req.body;

    if (!fields.title) {
      return res.status(400).json({ success: false, message: 'title field is required for citation generation.' });
    }

    const result = await aiService.generateCitation(fields, { style });

    res.json({
      success: true,
      data: { tool: 'Citation Generator', style, processedText: result },
    });
  } catch (error) {
    next(error);
  }
};

const wordChoiceEnhancer = (req, res, next) =>
  processWithAI(req, res, next, aiService.enhanceWordChoice, 'Word Choice Enhancer');

const sentenceRestructure = (req, res, next) =>
  processWithAI(req, res, next, aiService.restructureSentences, 'Sentence Restructure');

const readabilityScore = (req, res, next) =>
  processWithAI(req, res, next, aiService.scoreReadability, 'Readability Score');

const vocabularyBuilder = (req, res, next) =>
  processWithAI(req, res, next, aiService.buildVocabulary, 'Vocabulary Builder');

const styleGuide = (req, res, next) =>
  processWithAI(req, res, next, aiService.applyStyleGuide, 'Style Guide');

module.exports = {
  aiWritingAssistant,
  grammarChecker,
  paraphraseText,
  summarizeText,
  toneAnalyzer,
  plagiarismCheck,
  citationGenerator,
  wordChoiceEnhancer,
  sentenceRestructure,
  readabilityScore,
  vocabularyBuilder,
  styleGuide,
};
