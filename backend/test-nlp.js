/**
 * NLP Tools Test — Direct service layer (no HTTP, no auth, no API key)
 * Run: node test-nlp.js
 */

const nlp = require('./services/nlpService');

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const CYAN   = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const BOLD   = '\x1b[1m';

let passed = 0;
let failed = 0;

function section(title) {
  console.log(`\n${BOLD}${CYAN}${'═'.repeat(60)}${RESET}`);
  console.log(`${BOLD}${CYAN}  ${title}${RESET}`);
  console.log(`${CYAN}${'═'.repeat(60)}${RESET}`);
}

function test(label, fn) {
  try {
    const result = fn();
    console.log(`\n${GREEN}✔ ${label}${RESET}`);
    console.log(YELLOW + JSON.stringify(result, null, 2) + RESET);
    passed++;
  } catch (e) {
    console.log(`\n${RED}✘ ${label}${RESET}`);
    console.log(RED + e.message + RESET);
    failed++;
  }
}

// ─── Sample texts ─────────────────────────────────────────────────────────────

const TEXT_SIMPLE   = 'The quick brown fox jumps over the lazy dog near the river bank.';
const TEXT_ACADEMIC = 'Artificial intelligence is transforming modern industries by automating complex tasks, improving decision-making processes, and enabling new forms of human-computer interaction. Machine learning algorithms analyze vast datasets to identify patterns and generate predictions with remarkable accuracy.';
const TEXT_NEGATIVE = 'This product is absolutely terrible. The quality is poor, the service was rude, and I completely wasted my money. I am very disappointed and frustrated with this experience.';
const TEXT_POSITIVE = 'I absolutely love this product! The quality is outstanding, the team was incredibly helpful, and the results exceeded all my expectations. Highly recommended to everyone!';
const TEXT_NEUTRAL  = 'The report was submitted on Monday. The committee reviewed the findings and scheduled a follow-up meeting for the following week.';
const TEXT_LONG     = `Climate change is one of the most pressing challenges facing humanity today. Rising global temperatures are causing glaciers to melt, sea levels to rise, and extreme weather events to become more frequent. Scientists warn that without immediate action, the consequences could be catastrophic. Governments around the world are implementing policies to reduce carbon emissions and transition to renewable energy sources. Solar and wind power have seen dramatic cost reductions, making them increasingly competitive with fossil fuels. However, the pace of transition remains insufficient to meet the targets set by the Paris Agreement. Individual actions also play a role, from reducing meat consumption to choosing sustainable transportation options.`;

const TEXT1_SIMILAR = 'Machine learning is a subset of artificial intelligence that enables computers to learn from data.';
const TEXT2_SIMILAR = 'Deep learning is a branch of machine learning that uses neural networks to process information from datasets.';
const TEXT1_DIFF    = 'The cat sat on the mat and looked out the window.';
const TEXT2_DIFF    = 'Global warming is caused by greenhouse gas emissions from industrial activities.';

// ─── 1. TOKENIZATION ─────────────────────────────────────────────────────────
section('1. TOKENIZATION');

test('Tokenize simple sentence', () => {
  const tokens = nlp.tokenize(TEXT_SIMPLE);
  if (!Array.isArray(tokens) || tokens.length === 0) throw new Error('Expected non-empty array');
  return { tokenCount: tokens.length, tokens };
});

test('Tokenize academic text', () => {
  const tokens = nlp.tokenize(TEXT_ACADEMIC);
  return { tokenCount: tokens.length, sample: tokens.slice(0, 10) };
});

// ─── 2. KEYWORD DENSITY ──────────────────────────────────────────────────────
section('2. KEYWORD DENSITY');

test('Keyword density — simple text', () => {
  const result = nlp.getKeywordDensity(TEXT_SIMPLE);
  if (!result.totalWords || !result.keywords) throw new Error('Missing fields');
  return result;
});

test('Keyword density — academic text', () => {
  const result = nlp.getKeywordDensity(TEXT_ACADEMIC);
  return { totalWords: result.totalWords, top5: result.keywords.slice(0, 5) };
});

test('Keyword density — long climate text', () => {
  const result = nlp.getKeywordDensity(TEXT_LONG);
  return { totalWords: result.totalWords, top8: result.keywords.slice(0, 8) };
});

// ─── 3. SIMILARITY ───────────────────────────────────────────────────────────
section('3. TF-IDF COSINE SIMILARITY');

test('Similarity — related AI texts (expect HIGH)', () => {
  const result = nlp.getSimilarity(TEXT1_SIMILAR, TEXT2_SIMILAR);
  if (typeof result.score !== 'number') throw new Error('score must be a number');
  return result;
});

test('Similarity — unrelated texts (expect LOW)', () => {
  const result = nlp.getSimilarity(TEXT1_DIFF, TEXT2_DIFF);
  return result;
});

test('Similarity — identical texts (expect 1.0)', () => {
  const result = nlp.getSimilarity(TEXT_SIMPLE, TEXT_SIMPLE);
  return result;
});

test('Similarity — academic vs negative review (expect VERY LOW)', () => {
  return nlp.getSimilarity(TEXT_ACADEMIC, TEXT_NEGATIVE);
});

// ─── 4. SENTIMENT ANALYSIS ───────────────────────────────────────────────────
section('4. SENTIMENT ANALYSIS');

test('Sentiment — positive text', () => {
  const result = nlp.getSentiment(TEXT_POSITIVE);
  if (result.label !== 'positive') throw new Error(`Expected positive, got ${result.label}`);
  return result;
});

test('Sentiment — negative text', () => {
  const result = nlp.getSentiment(TEXT_NEGATIVE);
  if (result.label !== 'negative') throw new Error(`Expected negative, got ${result.label}`);
  return result;
});

test('Sentiment — neutral text', () => {
  return nlp.getSentiment(TEXT_NEUTRAL);
});

test('Sentiment — academic text', () => {
  return nlp.getSentiment(TEXT_ACADEMIC);
});

// ─── 5. TONE DETECTION ───────────────────────────────────────────────────────
section('5. TONE DETECTION');

test('Tone — positive/enthusiastic text', () => {
  return nlp.getToneLabel(TEXT_POSITIVE);
});

test('Tone — negative/critical text', () => {
  return nlp.getToneLabel(TEXT_NEGATIVE);
});

test('Tone — neutral/factual text', () => {
  return nlp.getToneLabel(TEXT_NEUTRAL);
});

test('Tone — academic text', () => {
  return nlp.getToneLabel(TEXT_ACADEMIC);
});

// ─── 6. POS TAGGING ──────────────────────────────────────────────────────────
section('6. POS TAGGING (compromise)');

test('POS — simple sentence', () => {
  const result = nlp.getPOSTags(TEXT_SIMPLE);
  if (!Array.isArray(result.nouns)) throw new Error('nouns must be array');
  return result;
});

test('POS — academic text', () => {
  return nlp.getPOSTags(TEXT_ACADEMIC);
});

test('POS — negative review', () => {
  return nlp.getPOSTags(TEXT_NEGATIVE);
});

// ─── 7. READABILITY SCORE ────────────────────────────────────────────────────
section('7. READABILITY SCORE (Flesch)');

test('Readability — simple text (expect easy)', () => {
  const result = nlp.getReadabilityScore(TEXT_SIMPLE);
  if (typeof result.score !== 'number') throw new Error('score must be number');
  return result;
});

test('Readability — academic text (expect difficult)', () => {
  return nlp.getReadabilityScore(TEXT_ACADEMIC);
});

test('Readability — long climate text', () => {
  return nlp.getReadabilityScore(TEXT_LONG);
});

test('Readability — negative review', () => {
  return nlp.getReadabilityScore(TEXT_NEGATIVE);
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${'═'.repeat(60)}${RESET}`);
console.log(`${BOLD}  RESULTS: ${GREEN}${passed} passed${RESET}${BOLD}  ${failed > 0 ? RED : ''}${failed} failed${RESET}`);
console.log(`${BOLD}${'═'.repeat(60)}${RESET}\n`);
