/**
 * nlpService.js — Local NLP Analytical Layer
 *
 * ROUTING RULE: This service handles ONLY analytical/statistical tasks.
 * NO OpenAI calls here. All processing is deterministic and local.
 *
 * Libraries:
 *   natural    → tokenization, TF-IDF
 *   compromise → POS tagging, text parsing
 *   sentiment  → polarity scoring
 *
 * Exported functions:
 *   tokenize(text)
 *   getKeywordDensity(text)
 *   getSimilarity(text1, text2)
 *   getSentiment(text)
 *   getToneLabel(text)
 *   getPOSTags(text)
 *   getReadabilityScore(text)
 */

const natural   = require('natural');
const nlp       = require('compromise');
const Sentiment = require('sentiment');

const tokenizer     = new natural.WordTokenizer();
const TfIdf         = natural.TfIdf;
const sentimentAnalyzer = new Sentiment();

// ─── Tokenization ─────────────────────────────────────────────────────────────

/**
 * Tokenizes text into lowercase word tokens (punctuation stripped).
 * @param {string} text
 * @returns {string[]}
 */
const tokenize = (text) => tokenizer.tokenize(text.toLowerCase());

// ─── Keyword Density ──────────────────────────────────────────────────────────

// Common English stop words to filter from keyword results
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'this','that','these','those','it','its','i','you','he','she','we','they',
  'not','no','so','if','as','up','out','about','into','than','then','when',
]);

/**
 * Calculates keyword frequency and density for each meaningful word.
 * @param {string} text
 * @returns {{ totalWords: number, keywords: Array<{word, frequency, density}> }}
 */
const getKeywordDensity = (text) => {
  const tokens = tokenize(text);
  const totalWords = tokens.length;

  if (totalWords === 0) return { totalWords: 0, keywords: [] };

  // Build frequency map (exclude stop words)
  const freq = {};
  for (const token of tokens) {
    if (!STOP_WORDS.has(token) && token.length > 2) {
      freq[token] = (freq[token] || 0) + 1;
    }
  }

  const keywords = Object.entries(freq)
    .map(([word, frequency]) => ({
      word,
      frequency,
      density: parseFloat(((frequency / totalWords) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20); // top 20 keywords

  return { totalWords, keywords };
};

// ─── TF-IDF + Cosine Similarity ───────────────────────────────────────────────

/**
 * Builds a TF-IDF term vector for a document relative to a corpus.
 * @param {string} doc      - Target document
 * @param {string[]} corpus - All documents (including target)
 * @returns {Map<string, number>}
 */
const buildTfIdfVector = (doc, corpus) => {
  const tfidf = new TfIdf();
  corpus.forEach((d) => tfidf.addDocument(d));

  const vector = new Map();
  const docIndex = corpus.indexOf(doc);
  tfidf.listTerms(docIndex).forEach(({ term, tfidf: score }) => {
    vector.set(term, score);
  });
  return vector;
};

/**
 * Computes cosine similarity between two TF-IDF vectors.
 * @param {Map<string, number>} vecA
 * @param {Map<string, number>} vecB
 * @returns {number} - Score between 0 (no similarity) and 1 (identical)
 */
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const [term, scoreA] of vecA) {
    dotProduct += scoreA * (vecB.get(term) || 0);
    magA += scoreA ** 2;
  }
  for (const scoreB of vecB.values()) {
    magB += scoreB ** 2;
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude === 0 ? 0 : parseFloat((dotProduct / magnitude).toFixed(4));
};

/**
 * Computes similarity between two texts using TF-IDF + cosine similarity.
 * @param {string} text1
 * @param {string} text2
 * @returns {{ score: number, label: string }}
 */
const getSimilarity = (text1, text2) => {
  const corpus = [text1, text2];
  const vecA = buildTfIdfVector(text1, corpus);
  const vecB = buildTfIdfVector(text2, corpus);
  const score = cosineSimilarity(vecA, vecB);

  let label;
  if (score >= 0.8)      label = 'Very High';
  else if (score >= 0.6) label = 'High';
  else if (score >= 0.4) label = 'Moderate';
  else if (score >= 0.2) label = 'Low';
  else                   label = 'Very Low';

  return { score, label };
};

// ─── Sentiment Analysis ───────────────────────────────────────────────────────

/**
 * Performs sentiment polarity analysis.
 * @param {string} text
 * @returns {{ score: number, comparative: number, label: string, positive: string[], negative: string[] }}
 */
const getSentiment = (text) => {
  const result = sentimentAnalyzer.analyze(text);

  let label;
  if (result.comparative > 0.05)       label = 'positive';
  else if (result.comparative < -0.05) label = 'negative';
  else                                 label = 'neutral';

  return {
    score:       result.score,
    comparative: parseFloat(result.comparative.toFixed(4)),
    label,
    positive:    result.positive,
    negative:    result.negative,
  };
};

// ─── Tone Detection (NLP-based) ───────────────────────────────────────────────

/**
 * Detects basic tone using sentiment + heuristic signals.
 * @param {string} text
 * @returns {{ tone: string, confidence: string, sentiment: object }}
 */
const getToneLabel = (text) => {
  const sentiment = getSentiment(text);
  const doc = nlp(text);

  const hasQuestions  = doc.questions().length > 0;
  const hasExclamations = /[!]{1,}/.test(text);
  const imperatives   = doc.verbs().toInfinitive().out('array').length;

  let tone;
  if (sentiment.label === 'positive' && hasExclamations) tone = 'enthusiastic';
  else if (sentiment.label === 'positive')               tone = 'optimistic';
  else if (sentiment.label === 'negative' && imperatives > 2) tone = 'assertive';
  else if (sentiment.label === 'negative')               tone = 'critical';
  else if (hasQuestions)                                 tone = 'inquisitive';
  else if (imperatives > 3)                              tone = 'directive';
  else                                                   tone = 'neutral';

  const confidence = Math.abs(sentiment.comparative) > 0.1 ? 'high' : 'moderate';

  return { tone, confidence, sentiment };
};

// ─── POS Tagging (compromise) ─────────────────────────────────────────────────

/**
 * Extracts parts-of-speech tags from text.
 * @param {string} text
 * @returns {{ nouns: string[], verbs: string[], adjectives: string[], adverbs: string[] }}
 */
const getPOSTags = (text) => {
  const doc = nlp(text);
  return {
    nouns:      doc.nouns().out('array'),
    verbs:      doc.verbs().out('array'),
    adjectives: doc.adjectives().out('array'),
    adverbs:    doc.adverbs().out('array'),
  };
};

// ─── Readability Score ────────────────────────────────────────────────────────

/**
 * Calculates a readability score using Flesch Reading Ease formula.
 * @param {string} text
 * @returns {{ score: number, grade: string, avgSentenceLength: number, avgSyllablesPerWord: number }}
 */
const getReadabilityScore = (text) => {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words     = tokenize(text);
  const totalSentences = sentences.length || 1;
  const totalWords     = words.length || 1;

  // Approximate syllable count (heuristic: count vowel groups)
  const countSyllables = (word) => {
    const matches = word.toLowerCase().match(/[aeiouy]+/g);
    return matches ? matches.length : 1;
  };

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength    = parseFloat((totalWords / totalSentences).toFixed(2));
  const avgSyllablesPerWord  = parseFloat((totalSyllables / totalWords).toFixed(2));

  // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const score = parseFloat(
    (206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord).toFixed(2)
  );

  let grade;
  if (score >= 90)      grade = 'Very Easy (5th grade)';
  else if (score >= 80) grade = 'Easy (6th grade)';
  else if (score >= 70) grade = 'Fairly Easy (7th grade)';
  else if (score >= 60) grade = 'Standard (8th-9th grade)';
  else if (score >= 50) grade = 'Fairly Difficult (10th-12th grade)';
  else if (score >= 30) grade = 'Difficult (College level)';
  else                  grade = 'Very Difficult (Professional)';

  return { score, grade, avgSentenceLength, avgSyllablesPerWord };
};

// ─── Grammar Correction (NLP rule-based) ─────────────────────────────────────

// Common irregular verb corrections: wrong → correct
const IRREGULAR_VERBS = {
  buyed: 'bought', bringed: 'brought', catched: 'caught', comed: 'came',
  digged: 'dug', drawed: 'drew', drived: 'drove', eated: 'ate',
  falled: 'fell', feeled: 'felt', fighted: 'fought', finded: 'found',
  flied: 'flew', gived: 'gave', goed: 'went', growed: 'grew',
  holded: 'held', keeped: 'kept', knowed: 'knew', leaved: 'left',
  lended: 'lent', maked: 'made', meeted: 'met', payed: 'paid',
  putted: 'put', readed: 'read', ringed: 'rang', runned: 'ran',
  sayed: 'said', seed: 'saw', selled: 'sold', sended: 'sent',
  shooted: 'shot', singed: 'sang', sitted: 'sat', sleeped: 'slept',
  speaked: 'spoke', spended: 'spent', standed: 'stood', swimmed: 'swam',
  taked: 'took', teached: 'taught', telled: 'told', thinked: 'thought',
  throwed: 'threw', understanded: 'understood', waked: 'woke',
  weared: 'wore', winned: 'won', writed: 'wrote',
};

// Subject-verb agreement fixes
const SUBJECT_VERB = [
  { pattern: /\bthey was\b/gi,   fix: 'they were' },
  { pattern: /\bwe was\b/gi,     fix: 'we were' },
  { pattern: /\byou was\b/gi,    fix: 'you were' },
  { pattern: /\bi is\b/gi,       fix: 'I am' },
  { pattern: /\bi are\b/gi,      fix: 'I am' },
  { pattern: /\bhe are\b/gi,     fix: 'he is' },
  { pattern: /\bshe are\b/gi,    fix: 'she is' },
  { pattern: /\bit are\b/gi,     fix: 'it is' },
  { pattern: /\bhe were\b/gi,    fix: 'he was' },
  { pattern: /\bshe were\b/gi,   fix: 'she was' },
  { pattern: /\bit were\b/gi,    fix: 'it was' },
  { pattern: /\bi were\b/gi,     fix: 'I was' },
];

// their/there/they're confusion
const HOMOPHONES = [
  { pattern: /\btheir going\b/gi,   fix: "they're going" },
  { pattern: /\btheir coming\b/gi,  fix: "they're coming" },
  { pattern: /\btheir doing\b/gi,   fix: "they're doing" },
  { pattern: /\btheir trying\b/gi,  fix: "they're trying" },
  { pattern: /\btheir working\b/gi, fix: "they're working" },
  { pattern: /\bthere going\b/gi,   fix: "they're going" },
  { pattern: /\byour welcome\b/gi,  fix: "you're welcome" },
  { pattern: /\bits a\b/gi,         fix: "it's a" },
  { pattern: /\bits the\b/gi,       fix: "it's the" },
  { pattern: /\bits not\b/gi,       fix: "it's not" },
];

// Apostrophe fixes for common plurals (apple's → apples)
const fixSpuriousApostrophes = (text) =>
  text.replace(/\b(\w+)'s\b(?!\s+(is|was|has|had|been|going|coming|doing))/g, (match, word) => {
    // Keep possessives like "John's" or contractions — only fix clear plural misuse
    // Heuristic: if preceded by a number or "some/many/few/several", it's a plural
    return match; // conservative — only fix known cases below
  });

// Capitalise first letter of each sentence
const capitaliseSentences = (text) =>
  text.replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, letter) => sep + letter.toUpperCase());

/**
 * Corrects common grammar errors using rule-based NLP (no AI).
 * Fixes: irregular verbs, subject-verb agreement, homophones,
 *        capitalisation, and basic punctuation.
 *
 * @param {string} text
 * @returns {{
 *   corrected: string,
 *   original: string,
 *   corrections: Array<{ type, original, fixed }>
 * }}
 */
const correctGrammar = (text) => {
  let corrected = text;
  const corrections = [];

  // 1. Homophone / their-there-they're fixes
  for (const { pattern, fix } of HOMOPHONES) {
    corrected = corrected.replace(pattern, (match) => {
      corrections.push({ type: 'homophone', original: match, fixed: fix });
      return fix;
    });
  }

  // 2. Subject-verb agreement
  for (const { pattern, fix } of SUBJECT_VERB) {
    corrected = corrected.replace(pattern, (match) => {
      corrections.push({ type: 'subject-verb agreement', original: match, fixed: fix });
      return fix;
    });
  }

  // 3. Irregular verb corrections (word by word)
  corrected = corrected.replace(/\b\w+\b/g, (word) => {
    const lower = word.toLowerCase();
    if (IRREGULAR_VERBS[lower]) {
      corrections.push({ type: 'irregular verb', original: word, fixed: IRREGULAR_VERBS[lower] });
      return IRREGULAR_VERBS[lower];
    }
    return word;
  });

  // 4. Capitalise "i" as standalone pronoun
  corrected = corrected.replace(/\bi\b/g, (match, offset) => {
    corrections.push({ type: 'capitalisation', original: 'i', fixed: 'I' });
    return 'I';
  });

  // 5. Capitalise first word of each sentence
  const beforeCap = corrected;
  corrected = capitaliseSentences(corrected);
  if (corrected !== beforeCap) {
    corrections.push({ type: 'capitalisation', original: '(sentence start)', fixed: '(capitalised)' });
  }

  // 6. Remove duplicate spaces
  corrected = corrected.replace(/\s{2,}/g, ' ').trim();

  return {
    original:    text,
    corrected,
    totalFixes:  corrections.length,
    corrections,
  };
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  tokenize,
  getKeywordDensity,
  getSimilarity,
  getSentiment,
  getToneLabel,
  getPOSTags,
  getReadabilityScore,
  correctGrammar,
};
