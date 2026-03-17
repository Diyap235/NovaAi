/**
 * Nova AI — AI Service Layer
 *
 * Abstracts all NLP/AI provider calls behind a single interface.
 * Current mode: mock responses (no external API key required).
 *
 * To switch to OpenAI:
 *   1. Set OPENAI_API_KEY in .env
 *   2. Set AI_PROVIDER=openai in .env
 *   3. The generateText() function will route to the real API automatically.
 */

const OpenAI = require('openai');

// Lazy-initialise the OpenAI client only when the key is present
let openaiClient = null;
const getOpenAI = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

// ─── Core text generation ─────────────────────────────────────────────────────

/**
 * Sends a prompt to the configured AI provider and returns the response text.
 * Falls back to mock output when no provider is configured.
 *
 * @param {string} prompt   - The full prompt to send
 * @param {object} options  - { maxTokens, temperature }
 * @returns {Promise<string>}
 */
const generateText = async (prompt, options = {}) => {
  const { maxTokens = 800, temperature = 0.7 } = options;
  const provider = process.env.AI_PROVIDER || 'mock';

  if (provider === 'openai') {
    const client = getOpenAI();
    if (!client) throw new Error('OpenAI API key not configured.');

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Nova AI, an expert writing assistant.' },
        { role: 'user',   content: prompt },
      ],
      max_tokens:  maxTokens,
      temperature,
    });
    return response.choices[0].message.content.trim();
  }

  // ── Mock provider (default) ──────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 600)); // simulate latency
  return `[Mock AI Response]\n\nPrompt received:\n"${prompt.slice(0, 120)}..."\n\nThis is a placeholder response. Set AI_PROVIDER=openai and add your OPENAI_API_KEY to .env to enable real AI processing.`;
};

// ─── Tool-specific prompt builders ───────────────────────────────────────────

const improveWriting = (text, { tone = 'Professional', style = 'Formal', length = 'Same' } = {}) =>
  generateText(`Improve the following text. Tone: ${tone}. Style: ${style}. Length: ${length}.\n\nText:\n${text}`);

const checkGrammar = (text) =>
  generateText(`Check the following text for grammar, spelling, and punctuation errors. List corrections and provide the corrected version.\n\nText:\n${text}`);

const paraphraseText = (text, { mode = 'Standard' } = {}) =>
  generateText(`Paraphrase the following text in ${mode} mode. Preserve the original meaning.\n\nText:\n${text}`);

const summarizeText = (text, { format = 'paragraph', length = 'medium' } = {}) =>
  generateText(`Summarize the following text as a ${format} of ${length} length.\n\nText:\n${text}`);

const analyzeTone = (text) =>
  generateText(`Analyze the tone of the following text. Identify primary and secondary tones with percentages. Provide recommendations.\n\nText:\n${text}`);

const detectPlagiarism = (text) =>
  generateText(`Analyze the following text for potential plagiarism. Provide an originality score and list any suspicious patterns.\n\nText:\n${text}`);

const generateCitation = (fields, { style = 'APA' } = {}) => {
  const details = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
  return generateText(`Generate a ${style} citation for the following source:\n${details}`);
};

const enhanceWordChoice = (text) =>
  generateText(`Identify weak or overused words in the following text and suggest stronger alternatives. Show the enhanced version.\n\nText:\n${text}`);

const restructureSentences = (text) =>
  generateText(`Restructure the sentences in the following text to improve clarity, flow, and readability. Reduce passive voice.\n\nText:\n${text}`);

const scoreReadability = (text) =>
  generateText(`Analyze the readability of the following text. Provide Flesch reading score, grade level, reading difficulty, and improvement tips.\n\nText:\n${text}`);

const buildVocabulary = (text) =>
  generateText(`For the key words in the following text, provide synonyms, definitions, and example sentences.\n\nText:\n${text}`);

const applyStyleGuide = (text, { style = 'Professional' } = {}) =>
  generateText(`Apply ${style} writing style guidelines to the following text. List issues found and provide the corrected version.\n\nText:\n${text}`);

module.exports = {
  generateText,
  improveWriting,
  checkGrammar,
  paraphraseText,
  summarizeText,
  analyzeTone,
  detectPlagiarism,
  generateCitation,
  enhanceWordChoice,
  restructureSentences,
  scoreReadability,
  buildVocabulary,
  applyStyleGuide,
};
