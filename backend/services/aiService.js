/**
 * aiService.js — Generative AI Layer (OpenAI)
 *
 * ROUTING RULE: This service is ONLY called for generative tasks:
 *   paraphrase | humanize | enhance | restructure | tone | style | grammar (complex) | summarize (advanced)
 *
 * NLP analytical tasks (keyword density, similarity, sentiment) are handled by nlpService.js
 */

const OpenAI = require('openai');

// ─── Client (lazy init) ───────────────────────────────────────────────────────
let _client = null;
const getClient = () => {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set in environment.');
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
};

// ─── System prompt (human-like writing enforcer) ──────────────────────────────
const SYSTEM_PROMPT =
  'You are a professional human writer with expertise in linguistics and creative writing. ' +
  'Rewrite and generate text that is natural, fluent, and contextually accurate. ' +
  'Avoid robotic tone, repetitive phrasing, and AI-detection patterns. ' +
  'Maintain the original meaning while improving clarity, flow, and human authenticity. ' +
  'Never add disclaimers, meta-commentary, or explain what you are doing — just output the result.';

// ─── Core generation function ─────────────────────────────────────────────────

/**
 * @param {string} prompt       - Full structured prompt from promptBuilder
 * @param {object} [options]    - Override default model params
 * @returns {Promise<string>}   - Clean generated text
 */
const generate = async (prompt, options = {}) => {
  const {
    maxTokens        = 1024,
    temperature      = 0.85,
    top_p            = 0.9,
    presence_penalty = 0.6,
    frequency_penalty = 0.3,
  } = options;

  const client = getClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: prompt },
    ],
    max_tokens:        maxTokens,
    temperature,
    top_p,
    presence_penalty,
    frequency_penalty,
  });

  const output = response.choices?.[0]?.message?.content?.trim();
  if (!output) throw new Error('AI returned an empty response.');
  return output;
};

module.exports = { generate };
