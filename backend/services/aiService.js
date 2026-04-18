
const Groq = require('groq-sdk');

let _client;

// ─── Client (lazy init)
const getClient = () => {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set in environment.');
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
};

// ─── System prompt 
const SYSTEM_PROMPT =
  'You are a professional human writer with expertise in linguistics and creative writing. ' +
  'Rewrite and generate text that is natural, fluent, and contextually accurate. ' +
  'Avoid robotic tone, repetitive phrasing, and AI-detection patterns. ' +
  'Maintain the original meaning while improving clarity, flow, and human authenticity. ' +
  'Never add disclaimers, meta-commentary, or explain what you are doing — just output the result.';

// ─── Core generation function 
/**
 * @param {string} prompt       - Full structured prompt from promptBuilder
 * @param {object} [options]    - Override default model params
 * @returns {Promise<string>}   - Clean generated text
 */
const generate = async (prompt, options = {}) => {
  const {
    maxTokens   = 1024,
    temperature = 0.85,
    top_p       = 0.9,
  } = options;

  const client = getClient();

  const response = await client.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: prompt },
    ],
    max_tokens:  maxTokens,
    temperature,
    top_p,
  });

  const output = response.choices?.[0]?.message?.content?.trim();
  if (!output) throw new Error('AI returned an empty response.');
  return output;
};

module.exports = { generate };
