
// ─── Mode descriptors injected into prompts ───────────────────────────────────
const MODE_DESCRIPTORS = {
  formal:       'formal, professional, and polished',
  casual:       'casual, conversational, and friendly',
  academic:     'academic, precise, and scholarly with discipline-appropriate vocabulary',
  creative:     'creative, expressive, and engaging with vivid language',
  // Tone options
  professional: 'professional, confident, and authoritative',
  friendly:     'warm, friendly, and approachable',
  persuasive:   'persuasive, compelling, and convincing',
  standard: 'clear, natural, and straightforward',
  fluent:   'smooth, fluent, and naturally flowing',
  shorten:  'concise and brief — significantly shorter than the original',
  expand:   'detailed and elaborated — significantly longer than the original',
  blog:         'conversational blog-style, engaging, and easy to read',
};

const getMode = (mode) =>
  MODE_DESCRIPTORS[(mode || '').toLowerCase()] || MODE_DESCRIPTORS.formal;

// ─── Length instructions 
const LENGTH_INSTRUCTIONS = {
  shorter: 'Make the output noticeably shorter — remove filler, condense sentences, keep only essential content.',
  same:    'Keep the output roughly the same length as the input.',
  longer:  'Expand the output — add more detail, examples, and elaboration while staying on topic.',
};

// ─── Shared output rules appended to every prompt ────────────────────────────
const OUTPUT_RULES = `
Rules:
- Output ONLY the result. No explanations, labels, or meta-commentary.
- Write naturally as a human would. Avoid robotic or formulaic phrasing.
- Do not start sentences with "Certainly", "Sure", "Of course", or similar filler.
- Preserve the original meaning and intent.
- Vary sentence structure to avoid repetition.`;

// ─── Individual prompt builders 
const prompts = {
  paraphrase: (text, mode) =>
    `Rewrite the following text in a ${getMode(mode)} style. ` +
    `Rephrase every sentence using different vocabulary and structure while keeping the exact meaning intact.\n` +
    OUTPUT_RULES +
    `\n\nOriginal Text:\n${text}\n\nRewritten Text:`,

  grammar: (text, mode) =>
    `Correct all grammar, spelling, punctuation, and syntax errors in the following text. ` +
    `Maintain a ${getMode(mode)} tone. Do not change the meaning or restructure ideas.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nCorrected Text:`,

  summarize: (text, mode) =>
    `Write a concise, high-quality summary of the following text in a ${getMode(mode)} style. ` +
    `Capture all key points, arguments, and conclusions. Reduce length by at least 60%.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nSummary:`,

  tone: (text, mode) =>
    `Rewrite the following text so its tone becomes ${getMode(mode)}. ` +
    `Adjust word choice, sentence rhythm, and formality level accordingly. Preserve all original information.\n` +
    OUTPUT_RULES +
    `\n\nOriginal Text:\n${text}\n\nTone-Adjusted Text:`,

  humanize: (text, mode) =>
    `Rewrite the following text to sound completely human-written in a ${getMode(mode)} style. ` +
    `Remove any robotic, repetitive, or AI-generated patterns. Add natural flow, varied sentence length, ` +
    `and authentic voice. The result must pass AI-detection tools.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nHumanized Text:`,

  enhance: (text, mode, opts = {}) => {
    const tone   = opts.tone   || mode || 'professional';
    const style  = opts.style  || 'formal';
    const length = opts.length || 'same';
    const lengthInstruction = LENGTH_INSTRUCTIONS[(length || '').toLowerCase()] || LENGTH_INSTRUCTIONS.same;
    return (
      `Enhance the following text with these exact requirements:\n` +
      `- Tone: ${getMode(tone)}\n` +
      `- Writing Style: ${getMode(style)}\n` +
      `- Length: ${lengthInstruction}\n\n` +
      `Improve word choice, sentence structure, clarity, and overall quality. ` +
      `Do not change the core message or add new facts.\n` +
      OUTPUT_RULES +
      `\n\nOriginal Text:\n${text}\n\nEnhanced Text:`
    );
  },

  restructure: (text, mode) =>
    `Restructure the sentences in the following text to improve logical flow, clarity, and readability ` +
    `in a ${getMode(mode)} style. Eliminate passive voice where possible. Keep all original information.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nRestructured Text:`,

  readability: (text, mode) =>
    `Rewrite the following text to significantly improve its readability in a ${getMode(mode)} style. ` +
    `Use shorter sentences, simpler vocabulary where appropriate, and clear paragraph structure. ` +
    `Target a broad audience without dumbing down the content.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nImproved Text:`,

  vocabulary: (text, mode) =>
    `Enhance the vocabulary in the following text by replacing weak, overused, or generic words ` +
    `with stronger, more precise alternatives appropriate for a ${getMode(mode)} style. ` +
    `Do not change sentence structure — only upgrade word choices.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nVocabulary-Enhanced Text:`,

  plagiarism: (text, _mode) =>
    `Analyze the following text for originality. Identify any phrases, sentences, or patterns that ` +
    `appear generic, formulaic, or likely copied from common sources. ` +
    `Provide: (1) an estimated originality score out of 100, (2) flagged phrases with reasons, ` +
    `(3) a brief recommendation to improve originality.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nOriginality Analysis:`,

  style: (text, mode) =>
    `Rewrite the following text to fully conform to a ${getMode(mode)} writing style. ` +
    `Adjust tone, formality, sentence construction, and vocabulary to match the style consistently throughout.\n` +
    OUTPUT_RULES +
    `\n\nText:\n${text}\n\nStyled Text:`,
};

// ─── Public API 
/**
 * Builds a structured prompt for the given tool type.
 * @param {string} type  - Tool type (e.g. "enhance", "paraphrase")
 * @param {string} text  - Input text from user
 * @param {string} mode  - Writing mode: formal | casual | academic | creative
 * @param {object} opts  - Extra options (tone, style, length) for enhance
 * @returns {string}     - Complete prompt string ready for AI
 */
const buildPrompt = (type, text, mode = 'formal', opts = {}) => {
  const builder = prompts[type];
  if (!builder) throw new Error(`Unknown prompt type: "${type}". Supported: ${Object.keys(prompts).join(', ')}`);
  return builder(text, mode, opts);
};

module.exports = { buildPrompt };
