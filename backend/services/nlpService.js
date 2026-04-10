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

// ─── Grammar Correction (comprehensive rule-based NLP) ───────────────────────

// 1. Irregular verbs — wrong past tense → correct past tense
const IRREGULAR_VERBS = {
  // A
  ariseed:'arose', awaked:'awoke',
  // B
  beared:'bore', beated:'beat', becomed:'became', begined:'began',
  bended:'bent', bited:'bit', bled:'bled', blowed:'blew', breaked:'broke',
  bringed:'brought', builded:'built', buyed:'bought',
  // C
  catched:'caught', chosed:'chose', comed:'came', costed:'costed',
  cutted:'cut', creepd:'crept', crept:'crept',
  // D
  dealed:'dealt', digged:'dug', dived:'dove', drawed:'drew',
  dreamed:'dreamt', drived:'drove', drank:'drank', drownded:'drowned',
  // E
  eated:'ate',
  // F
  falled:'fell', feeled:'felt', fighted:'fought', finded:'found',
  flied:'flew', forgeted:'forgot', freezed:'froze',
  // G
  gived:'gave', goed:'went', growed:'grew',
  // H
  hanged:'hung', holded:'held', hurted:'hurt',
  // K
  keeped:'kept', knowed:'knew',
  // L
  layed:'laid', leaded:'led', leaned:'leant', leaped:'leapt',
  leaved:'left', lended:'lent', letted:'let', lied:'lay',
  lighted:'lit', losted:'lost',
  // M
  maked:'made', meaned:'meant', meeted:'met',
  // P
  payed:'paid', putted:'put',
  // R
  readed:'read', ringed:'rang', rised:'rose', runned:'ran',
  // S
  sayed:'said', seed:'saw', selled:'sold', sended:'sent',
  setted:'set', shooted:'shot', shrinked:'shrank', singed:'sang',
  sitted:'sat', sleeped:'slept', slided:'slid', speaked:'spoke',
  spended:'spent', spilled:'spilt', standed:'stood', stealed:'stole',
  sticked:'stuck', striked:'struck', swimmed:'swam',
  // T
  taked:'took', teached:'taught', telled:'told', thinked:'thought',
  throwed:'threw', understanded:'understood',
  // W
  waked:'woke', weared:'wore', winned:'won', writed:'wrote',
};

// 2. Subject-verb agreement — covers all common mismatches
const SUBJECT_VERB_RULES = [
  // plural subjects with singular verb
  { p: /\bthey was\b/gi,        f: 'they were' },
  { p: /\bwe was\b/gi,          f: 'we were' },
  { p: /\byou was\b/gi,         f: 'you were' },
  { p: /\bthey is\b/gi,         f: 'they are' },
  { p: /\bwe is\b/gi,           f: 'we are' },
  { p: /\bpeople is\b/gi,       f: 'people are' },
  { p: /\bchildren is\b/gi,     f: 'children are' },
  { p: /\bmen is\b/gi,          f: 'men are' },
  { p: /\bwomen is\b/gi,        f: 'women are' },
  // singular subjects with plural verb
  { p: /\bhe are\b/gi,          f: 'he is' },
  { p: /\bshe are\b/gi,         f: 'she is' },
  { p: /\bit are\b/gi,          f: 'it is' },
  { p: /\bhe were\b/gi,         f: 'he was' },
  { p: /\bshe were\b/gi,        f: 'she was' },
  { p: /\bit were\b/gi,         f: 'it was' },
  // I mismatches
  { p: /\bi is\b/gi,            f: 'I am' },
  { p: /\bi are\b/gi,           f: 'I am' },
  { p: /\bi were\b/gi,          f: 'I was' },
  // everyone/someone/nobody
  { p: /\beveryone are\b/gi,    f: 'everyone is' },
  { p: /\beverybody are\b/gi,   f: 'everybody is' },
  { p: /\bsomeone are\b/gi,     f: 'someone is' },
  { p: /\bsomebody are\b/gi,    f: 'somebody is' },
  { p: /\bnobody are\b/gi,      f: 'nobody is' },
  { p: /\bno one are\b/gi,      f: 'no one is' },
  // double negatives
  { p: /\bdon't got no\b/gi,    f: "don't have any" },
  { p: /\bdidn't got no\b/gi,   f: "didn't have any" },
  { p: /\bcan't get no\b/gi,    f: "can't get any" },
  { p: /\bain't got no\b/gi,    f: "don't have any" },
  { p: /\bain't\b/gi,           f: "isn't" },
  // wrong tense with "yesterday/last"
  { p: /\byesterday he is\b/gi,   f: 'yesterday he was' },
  { p: /\byesterday she is\b/gi,  f: 'yesterday she was' },
  { p: /\byesterday i am\b/gi,    f: 'yesterday I was' },
  { p: /\byesterday they are\b/gi,f: 'yesterday they were' },
  { p: /\byesterday we are\b/gi,  f: 'yesterday we were' },
];

// 3. Homophones and common confusions
const HOMOPHONE_RULES = [
  // their / there / they're
  { p: /\btheir\s+(going|coming|doing|trying|working|running|eating|sleeping|playing|studying|leaving|arriving|waiting|watching|reading|writing|talking|walking|sitting|standing)\b/gi,
    f: (m, v) => `they're ${v}` },
  { p: /\bthere\s+(going|coming|doing|trying|working|running|eating|sleeping|playing|studying|leaving|arriving|waiting|watching|reading|writing|talking|walking|sitting|standing)\b/gi,
    f: (m, v) => `they're ${v}` },
  // your / you're
  { p: /\byour\s+(going|coming|doing|trying|working|running|eating|sleeping|playing|studying|leaving|arriving|waiting|watching|reading|writing|talking|walking|sitting|standing)\b/gi,
    f: (m, v) => `you're ${v}` },
  { p: /\byour welcome\b/gi,    f: "you're welcome" },
  { p: /\byour right\b/gi,      f: "you're right" },
  { p: /\byour wrong\b/gi,      f: "you're wrong" },
  // its / it's
  { p: /\bits (a|an|the|not|very|so|too|really|quite)\b/gi, f: (m, w) => `it's ${w}` },
  // to / too / two
  { p: /\bto much\b/gi,         f: 'too much' },
  { p: /\bto many\b/gi,         f: 'too many' },
  { p: /\bto late\b/gi,         f: 'too late' },
  { p: /\bto early\b/gi,        f: 'too early' },
  { p: /\bto fast\b/gi,         f: 'too fast' },
  { p: /\bto slow\b/gi,         f: 'too slow' },
  { p: /\bto good\b/gi,         f: 'too good' },
  { p: /\bto bad\b/gi,          f: 'too bad' },
  { p: /\bto big\b/gi,          f: 'too big' },
  { p: /\bto small\b/gi,        f: 'too small' },
  { p: /\bto long\b/gi,         f: 'too long' },
  { p: /\bto short\b/gi,        f: 'too short' },
  { p: /\bto hard\b/gi,         f: 'too hard' },
  { p: /\bto easy\b/gi,         f: 'too easy' },
  { p: /\bto tired\b/gi,        f: 'too tired' },
  { p: /\bto busy\b/gi,         f: 'too busy' },
  { p: /\bto old\b/gi,          f: 'too old' },
  { p: /\bto young\b/gi,        f: 'too young' },
  { p: /\bto hot\b/gi,          f: 'too hot' },
  { p: /\bto cold\b/gi,         f: 'too cold' },
  // then / than
  { p: /\bbetter then\b/gi,     f: 'better than' },
  { p: /\bmore then\b/gi,       f: 'more than' },
  { p: /\bless then\b/gi,       f: 'less than' },
  { p: /\bother then\b/gi,      f: 'other than' },
  { p: /\brather then\b/gi,     f: 'rather than' },
  { p: /\bsmarter then\b/gi,    f: 'smarter than' },
  { p: /\bbigger then\b/gi,     f: 'bigger than' },
  { p: /\bsmaller then\b/gi,    f: 'smaller than' },
  { p: /\bolder then\b/gi,      f: 'older than' },
  { p: /\byounger then\b/gi,    f: 'younger than' },
  // affect / effect
  { p: /\bthe affect of\b/gi,   f: 'the effect of' },
  { p: /\bpositive affect\b/gi, f: 'positive effect' },
  { p: /\bnegative affect\b/gi, f: 'negative effect' },
  // loose / lose
  { p: /\bi will loose\b/gi,    f: 'I will lose' },
  { p: /\bdon't loose\b/gi,     f: "don't lose" },
  { p: /\bgoing to loose\b/gi,  f: 'going to lose' },
  // should of / could of / would of
  { p: /\bshould of\b/gi,       f: 'should have' },
  { p: /\bcould of\b/gi,        f: 'could have' },
  { p: /\bwould of\b/gi,        f: 'would have' },
  { p: /\bmust of\b/gi,         f: 'must have' },
  { p: /\bmight of\b/gi,        f: 'might have' },
  // a / an
  { p: /\ba ([aeiouAEIOU]\w)/g,  f: (m, w) => `an ${w}` },
  { p: /\ban ([^aeiouAEIOU\s]\w)/g, f: (m, w) => `a ${w}` },
];

// 4. Tense consistency — past time markers with present tense
const TENSE_RULES = [
  { p: /\byesterday .{0,30}?\b(is|are|am)\b/gi,
    f: (m) => m.replace(/\b(is|are|am)\b/gi, (v) => v === 'are' ? 'were' : 'was') },
  { p: /\blast (week|month|year|night|monday|tuesday|wednesday|thursday|friday|saturday|sunday) .{0,40}?\b(is|are|am)\b/gi,
    f: (m) => m.replace(/\b(is|are|am)\b/gi, (v) => v === 'are' ? 'were' : 'was') },
];

// 5. Article fixes — missing "a/an" before adjective+noun combos only
const ARTICLE_RULES = [
  { p: /\bafter (long|short|hard|busy|good|bad|great|terrible|wonderful|awful) (walk|run|day|night|week|month|year|trip|journey|meeting|class|game|match|race|fight|break|rest|sleep|meal|lunch|dinner|breakfast)\b/gi,
    f: (m, adj, noun) => `after a ${adj} ${noun}` },
];

// 6. Punctuation fixes
const fixPunctuation = (text) => {
  let t = text;
  t = t.replace(/\s+([.,!?;:])/g, '$1');       // space before punctuation
  t = t.replace(/([.,!?;:])([a-zA-Z])/g, '$1 $2'); // missing space after punctuation
  t = t.replace(/([.!?])\s{2,}/g, '$1 ');      // multiple spaces after sentence end
  t = t.replace(/\s{2,}/g, ' ');               // multiple spaces anywhere
  return t.trim();
};

// 7. Capitalisation
const fixCapitalisation = (text) => {
  // Sentence starts
  let t = text.replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, letter) => sep + letter.toUpperCase());
  // Standalone "i"
  t = t.replace(/\bi\b/g, 'I');
  // Days and months
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  [...days, ...months].forEach((word) => {
    t = t.replace(new RegExp(`\\b${word}\\b`, 'g'), word.charAt(0).toUpperCase() + word.slice(1));
  });
  return t;
};

/**
 * Uses compromise to fix subject-verb agreement dynamically.
 * Works for ANY verb — uses compromise's conjugate() to get correct forms.
 */
const fixSubjectVerbAgreement = (text, corrections) => {
  const THIRD_SINGULAR  = new Set(['she', 'he', 'it']);
  const PLURAL_OR_OTHER = new Set(['they', 'we', 'i', 'you']);

  // Common verbs compromise sometimes mis-tags as Adjective/Noun in certain contexts
  const COMMON_VERBS = new Set([
    'go','goes','walk','walks','run','runs','live','lives','make','makes',
    'eat','eats','work','works','come','comes','know','knows','think','thinks',
    'say','says','get','gets','take','takes','give','gives','see','sees',
    'look','looks','want','wants','need','needs','feel','feels','seem','seems',
    'keep','keeps','let','lets','put','puts','bring','brings','begin','begins',
    'show','shows','hear','hears','play','plays','move','moves','pay','pays',
    'turn','turns','start','starts','leave','leaves','try','tries','call','calls',
    'ask','asks','help','helps','talk','talks','use','uses','find','finds',
    'tell','tells','hold','holds','stand','stands','lose','loses','buy','buys',
    'send','sends','read','reads','spend','spends','grow','grows','open','opens',
    'write','writes','sit','sits','stop','stops','teach','teaches','reach','reaches',
  ]);

  const sentences = text.split(/(?<=[.!?])\s+/);

  const fixedSentences = sentences.map((sentence) => {
    const tagMap = nlp(sentence).out('tags')[0] || {};
    const words  = Object.keys(tagMap);
    let result   = sentence;

    for (let i = 0; i < words.length; i++) {
      const word     = words[i];
      const wordTags = tagMap[word] || [];
      const wordLow  = word.toLowerCase();

      // Accept word if tagged as Verb OR if it's a known verb (compromise mis-tag fix)
      const isVerb = wordTags.includes('Verb') || COMMON_VERBS.has(wordLow);
      if (!isVerb) continue;

      // Must be present tense — skip past tense words
      if (wordTags.includes('PastTense')) continue;

      // Get conjugations — try direct word first, then force as verb
      let conjugations = nlp(wordLow).verbs().conjugate()[0];
      if (!conjugations || !conjugations.Infinitive) {
        // Force compromise to treat it as a verb
        conjugations = nlp(`I ${wordLow}`).verbs().conjugate()[0];
      }
      if (!conjugations || !conjugations.Infinitive) continue;

      const infinitive   = conjugations.Infinitive;
      const presentThird = conjugations.PresentTense || (infinitive + 's');

      // Only act on infinitive or third-person present forms
      const isInfinitive   = wordLow === infinitive.toLowerCase();
      const isThirdPresent = wordLow === presentThird.toLowerCase();
      if (!isInfinitive && !isThirdPresent) continue;

      // Find subject — look back up to 5 words
      let subjectWord = null;
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const w    = words[j].toLowerCase();
        const wTags = tagMap[words[j]] || [];

        if (THIRD_SINGULAR.has(w))  { subjectWord = 'third-singular'; break; }
        if (PLURAL_OR_OTHER.has(w)) { subjectWord = 'plural-or-other'; break; }

        // Singular noun (dog, friend, teacher, etc.)
        if (wTags.includes('Noun') && wTags.includes('Singular') && !wTags.includes('Verb')) {
          subjectWord = 'third-singular';
          break;
        }
        // Actor nouns (friend, teacher, student)
        if (wTags.includes('Actor') && wTags.includes('Singular')) {
          subjectWord = 'third-singular';
          break;
        }
      }

      if (!subjectWord) continue;

      // Fix: third-singular + infinitive → use presentThird
      if (subjectWord === 'third-singular' && isInfinitive && wordLow !== presentThird.toLowerCase()) {
        const regex  = new RegExp(`\\b${word}\\b`);
        const before = result;
        result = result.replace(regex, presentThird);
        if (result !== before) corrections.push({ type: 'subject-verb agreement', original: word, fixed: presentThird });
      }

      // Fix: plural/other + third-present → use infinitive
      if (subjectWord === 'plural-or-other' && isThirdPresent && wordLow !== infinitive.toLowerCase()) {
        const regex  = new RegExp(`\\b${word}\\b`);
        const before = result;
        result = result.replace(regex, infinitive);
        if (result !== before) corrections.push({ type: 'subject-verb agreement', original: word, fixed: infinitive });
      }
    }

    return result;
  });

  return fixedSentences.join(' ');
};

/**
 * Comprehensive grammar correction using compromise NLP + rule-based fixes.
 *
 * Step 1 — compromise dynamic subject-verb agreement (works for ANY verb/subject)
 * Step 2 — homophones & word confusions
 * Step 3 — hardcoded subject-verb edge cases (they was, we was, etc.)
 * Step 4 — tense consistency with time markers
 * Step 5 — irregular verb past tense corrections
 * Step 6 — missing articles
 * Step 7 — punctuation
 * Step 8 — capitalisation
 */
const correctGrammar = (text) => {
  let corrected = text;
  const corrections = [];

  const track = (type, original, fixed) => {
    if (original.toLowerCase() !== fixed.toLowerCase()) {
      corrections.push({ type, original, fixed });
    }
  };

  // Step 1 — compromise dynamic subject-verb agreement (NLP-powered, any input)
  corrected = fixSubjectVerbAgreement(corrected, corrections);

  // Step 2 — Homophones & confusions
  for (const { p, f } of HOMOPHONE_RULES) {
    corrected = corrected.replace(p, (match, ...args) => {
      const fixed = typeof f === 'function' ? f(match, ...args) : f;
      track('homophone/confusion', match, fixed);
      return fixed;
    });
  }

  // Step 3 — Subject-verb edge cases (they was, we was, etc.)
  for (const { p, f } of SUBJECT_VERB_RULES) {
    corrected = corrected.replace(p, (match) => {
      track('subject-verb agreement', match, f);
      return f;
    });
  }

  // Step 4 — Tense consistency
  for (const { p, f } of TENSE_RULES) {
    corrected = corrected.replace(p, (match) => {
      const fixed = typeof f === 'function' ? f(match) : f;
      if (fixed !== match) track('tense consistency', match.trim(), fixed.trim());
      return fixed;
    });
  }

  // Step 5 — Irregular verbs (wrong past tense forms)
  corrected = corrected.replace(/\b[a-zA-Z]+\b/g, (word) => {
    const lower = word.toLowerCase();
    if (IRREGULAR_VERBS[lower]) {
      track('irregular verb', word, IRREGULAR_VERBS[lower]);
      return IRREGULAR_VERBS[lower];
    }
    return word;
  });

  // Step 6 — Article fixes
  for (const { p, f } of ARTICLE_RULES) {
    corrected = corrected.replace(p, (match, ...args) => {
      const fixed = typeof f === 'function' ? f(match, ...args) : f;
      track('missing article', match, fixed);
      return fixed;
    });
  }

  // Step 7 — Punctuation
  const beforePunct = corrected;
  corrected = fixPunctuation(corrected);
  if (corrected !== beforePunct) {
    corrections.push({ type: 'punctuation', original: '(spacing/punctuation)', fixed: '(fixed)' });
  }

  // Step 8 — Capitalisation
  const beforeCap = corrected;
  corrected = fixCapitalisation(corrected);
  if (corrected !== beforeCap) {
    corrections.push({ type: 'capitalisation', original: '(lowercase)', fixed: '(capitalised)' });
  }

  return {
    original:   text,
    corrected,
    totalFixes: corrections.length,
    corrections,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLAGIARISM DETECTION — Advanced NLP Engine
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lemmatize a word using simple suffix rules (lightweight, no external dep).
 * @param {string} word
 * @returns {string}
 */
const lemmatize = (word) => {
  const w = word.toLowerCase();
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ves') && w.length > 4) return w.slice(0, -3) + 'f';
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('tion') || w.endsWith('sion')) return w.slice(0, -3);
  if (w.endsWith('ness') && w.length > 5) return w.slice(0, -4);
  if (w.endsWith('ment') && w.length > 5) return w.slice(0, -4);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('er') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('ly') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
};

/**
 * Preprocess text: lowercase, remove punctuation, normalize whitespace,
 * tokenize, remove stopwords, lemmatize.
 * @param {string} text
 * @returns {string[]} processed tokens
 */
const preprocessTokens = (text) => {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return tokenizer
    .tokenize(cleaned)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
    .map(lemmatize);
};

/**
 * Split text into sentences, preserving original positions.
 * @param {string} text
 * @returns {Array<{text: string, start: number, end: number}>}
 */
const splitSentences = (text) => {
  const results = [];
  const regex = /[^.!?]+[.!?]*/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const s = match[0].trim();
    if (s.length > 10) {
      results.push({ text: s, start: match.index, end: match.index + match[0].length });
    }
  }
  return results;
};

/**
 * Generate overlapping word chunks (5–10 words) with original positions.
 * @param {string} text
 * @param {number} size  - chunk size in words
 * @param {number} step  - step size (overlap)
 * @returns {Array<{text: string, start: number, end: number}>}
 */
const buildChunks = (text, size = 7, step = 3) => {
  const wordRegex = /\S+/g;
  const words = [];
  let m;
  while ((m = wordRegex.exec(text)) !== null) {
    words.push({ word: m[0], index: m.index });
  }

  const chunks = [];
  for (let i = 0; i <= words.length - size; i += step) {
    const slice = words.slice(i, i + size);
    const chunkText = slice.map((w) => w.word).join(' ');
    chunks.push({
      text: chunkText,
      start: slice[0].index,
      end: slice[slice.length - 1].index + slice[slice.length - 1].word.length,
    });
  }
  return chunks;
};

/**
 * Compute TF-IDF cosine similarity between two raw texts.
 * @param {string} a
 * @param {string} b
 * @returns {number} 0–1
 */
const tfidfSimilarity = (a, b) => {
  const corpus = [a, b];
  const vecA = buildTfIdfVector(a, corpus);
  const vecB = buildTfIdfVector(b, corpus);
  return cosineSimilarity(vecA, vecB);
};

/**
 * Compute Jaccard similarity on lemmatized token sets.
 * Used as a proxy for semantic/partial matching.
 * @param {string} a
 * @param {string} b
 * @returns {number} 0–1
 */
const jaccardSimilarity = (a, b) => {
  const setA = new Set(preprocessTokens(a));
  const setB = new Set(preprocessTokens(b));
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
};

/**
 * Determine match type from similarity scores.
 * @param {number} tfidf
 * @param {number} jaccard
 * @returns {'exact'|'semantic'|'partial'|null}
 */
const classifyMatch = (tfidf, jaccard) => {
  const weighted = tfidf * 0.5 + jaccard * 0.5;
  if (tfidf >= 0.92 && jaccard >= 0.85) return 'exact';
  if (weighted >= 0.65) return 'semantic';
  if (weighted >= 0.40) return 'partial';
  return null;
};

/**
 * Merge overlapping highlight ranges.
 * @param {Array<{start,end,...}>} highlights
 * @returns {Array<{start,end,...}>}
 */
const mergeHighlights = (highlights) => {
  if (!highlights.length) return [];
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const merged = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i].start <= last.end) {
      last.end = Math.max(last.end, sorted[i].end);
      // Keep highest-weight match type
      const weights = { exact: 3, semantic: 2, partial: 1 };
      if ((weights[sorted[i].match_type] || 0) > (weights[last.match_type] || 0)) {
        last.match_type = sorted[i].match_type;
        last.source_text = sorted[i].source_text;
      }
    } else {
      merged.push({ ...sorted[i] });
    }
  }
  return merged;
};

/**
 * Build a synthetic reference corpus from the input text itself.
 * Simulates "known sources" by using sentence permutations and paraphrases
 * derived from the text — this enables self-similarity detection for demo/dev.
 *
 * In production, replace this with real database/web source lookups.
 * @param {string} text
 * @returns {Array<{id: string, text: string}>}
 */
const buildReferenceCorpus = (text) => {
  const sentences = splitSentences(text);
  const corpus = [];

  // Simulate "source 1": exact copy of first half
  if (sentences.length >= 2) {
    const half = Math.ceil(sentences.length / 2);
    corpus.push({
      id: 'source-1',
      text: sentences.slice(0, half).map((s) => s.text).join(' '),
    });
  }

  // Simulate "source 2": shuffled sentences (partial match scenario)
  if (sentences.length >= 3) {
    const shuffled = [...sentences].sort(() => 0.5 - Math.random());
    corpus.push({
      id: 'source-2',
      text: shuffled.slice(0, Math.ceil(sentences.length / 2)).map((s) => s.text).join(' '),
    });
  }

  // Simulate "source 3": common academic phrases extracted from text
  const tokens = preprocessTokens(text);
  if (tokens.length >= 10) {
    corpus.push({
      id: 'source-3',
      text: tokens.slice(0, Math.ceil(tokens.length / 3)).join(' '),
    });
  }

  return corpus;
};

/**
 * Main plagiarism detection function.
 *
 * Pipeline:
 *   1. Preprocess
 *   2. Chunk + sentence split
 *   3. TF-IDF + Jaccard similarity per chunk vs corpus
 *   4. Classify match type
 *   5. Merge highlights
 *   6. Calculate weighted plagiarism %
 *   7. Build human-readable report + JSON output
 *
 * @param {string} inputText
 * @returns {object} Full plagiarism report
 */
const detectPlagiarism = (inputText) => {
  const text = inputText.trim();

  // Low confidence guard
  if (text.split(/\s+/).length < 20) {
    return {
      mode: 'plagiarism',
      input_text: text,
      plagiarism_percentage: 0,
      confidence: 'low confidence — text too short for reliable analysis',
      highlights: [],
      results: [],
      overall_risk: 'low',
      report: [
        'PLAGIARISM REPORT',
        'Input Summary:',
        'Text is too short for reliable plagiarism analysis (minimum ~20 words recommended).',
        '',
        'Overall Result:',
        '- Plagiarism Score: N/A',
        '- Risk Level: LOW CONFIDENCE',
        '',
        'Suggestion:',
        'Provide a longer text sample for accurate results.',
      ].join('\n'),
    };
  }

  const corpus = buildReferenceCorpus(text);
  const sentences = splitSentences(text);
  const chunks = buildChunks(text, 7, 3);

  const highlights = [];
  const results = [];

  // ── Sentence-level analysis ──────────────────────────────────────────────
  for (const sentence of sentences) {
    let bestScore = 0;
    let bestType = null;
    let bestSource = '';

    for (const source of corpus) {
      const tfidf = tfidfSimilarity(sentence.text, source.text);
      const jaccard = jaccardSimilarity(sentence.text, source.text);
      const matchType = classifyMatch(tfidf, jaccard);
      const weighted = tfidf * 0.5 + jaccard * 0.3 + (matchType ? 0.2 : 0);

      if (matchType && weighted > bestScore) {
        bestScore = weighted;
        bestType = matchType;
        bestSource = source.text.slice(0, 120) + (source.text.length > 120 ? '...' : '');
      }
    }

    if (bestType) {
      highlights.push({
        text: sentence.text,
        start_index: sentence.start,
        end_index: sentence.end,
        match_type: bestType,
        source_text: bestSource,
      });

      results.push({
        matched_text: sentence.text.slice(0, 100) + (sentence.text.length > 100 ? '...' : ''),
        similarity_score: parseFloat(bestScore.toFixed(2)),
        semantic_match: bestType === 'semantic',
        match_type: bestType,
        label: bestScore >= 0.8 ? 'high' : bestScore >= 0.5 ? 'moderate' : 'low',
      });
    }
  }

  // ── Chunk-level analysis (catches partial overlaps) ──────────────────────
  for (const chunk of chunks) {
    for (const source of corpus) {
      const tfidf = tfidfSimilarity(chunk.text, source.text);
      const jaccard = jaccardSimilarity(chunk.text, source.text);
      const matchType = classifyMatch(tfidf, jaccard);
      if (!matchType) continue;

      // Only add if not already covered by a sentence highlight
      const alreadyCovered = highlights.some(
        (h) => chunk.start >= h.start_index && chunk.end <= h.end_index
      );
      if (!alreadyCovered) {
        highlights.push({
          text: chunk.text,
          start_index: chunk.start,
          end_index: chunk.end,
          match_type: matchType,
          source_text: source.text.slice(0, 120) + (source.text.length > 120 ? '...' : ''),
        });
      }
    }
  }

  // ── Merge overlapping highlights ─────────────────────────────────────────
  const mergedHighlights = mergeHighlights(highlights);

  // ── Plagiarism percentage (weighted by match type) ────────────────────────
  const MATCH_WEIGHTS = { exact: 1.0, semantic: 0.8, partial: 0.6 };
  const totalLength = text.length;
  let weightedMatchedLength = 0;

  for (const h of mergedHighlights) {
    const segLen = h.end_index - h.start_index;
    weightedMatchedLength += segLen * (MATCH_WEIGHTS[h.match_type] || 0.5);
  }

  const rawPct = totalLength > 0 ? (weightedMatchedLength / totalLength) * 100 : 0;
  const plagiarism_percentage = Math.min(100, parseFloat(rawPct.toFixed(1)));

  // ── Risk level ────────────────────────────────────────────────────────────
  const overall_risk =
    plagiarism_percentage >= 50 ? 'high' :
    plagiarism_percentage >= 25 ? 'moderate' : 'low';

  // ── Human-readable report ─────────────────────────────────────────────────
  const topMatches = [...results]
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 5);

  const reportLines = [
    'PLAGIARISM REPORT',
    'Input Summary:',
    `Analyzed ${sentences.length} sentence(s) and ${chunks.length} text chunk(s) across ${corpus.length} reference source(s).`,
    '',
    'Overall Result:',
    `- Plagiarism Score: ${plagiarism_percentage}%`,
    `- Risk Level: ${overall_risk.toUpperCase()}`,
    '',
  ];

  if (topMatches.length > 0) {
    reportLines.push('Matched Content:');
    topMatches.forEach((m, i) => {
      reportLines.push(
        `  ${i + 1}. "${m.matched_text.slice(0, 60)}${m.matched_text.length > 60 ? '...' : ''}"`,
        `     Similarity: ${Math.round(m.similarity_score * 100)}% | Type: ${m.match_type}`
      );
    });
    reportLines.push('');
  }

  if (mergedHighlights.length > 0) {
    reportLines.push('Highlighted Sections:');
    mergedHighlights.slice(0, 5).forEach((h) => {
      reportLines.push(`  - [${h.match_type}] "${h.text.slice(0, 80)}${h.text.length > 80 ? '...' : ''}"`);
    });
    reportLines.push('');
  } else {
    reportLines.push('No significant matches found.\n');
  }

  reportLines.push('Suggestion:');
  if (overall_risk === 'high') {
    reportLines.push('High similarity detected. Rewrite flagged sections in your own words and cite any sources you referenced.');
  } else if (overall_risk === 'moderate') {
    reportLines.push('Some similarity found. Review highlighted sections and improve originality where possible.');
  } else {
    reportLines.push('Text appears mostly original. Minor similarities are within acceptable range.');
  }

  return {
    mode: 'plagiarism',
    input_text: text,
    plagiarism_percentage,
    highlights: mergedHighlights,
    results,
    overall_risk,
    report: reportLines.join('\n'),
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// CITATION GENERATOR — Strict Rule-Based (NO NLP, NO AI)
// ═══════════════════════════════════════════════════════════════════════════════

const CITATION_FORMATS = ['APA', 'MLA', 'Chicago', 'Harvard'];

/**
 * Trim a value and return null if empty/missing.
 * @param {*} val
 * @returns {string|null}
 */
const trimField = (val) => {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s.length > 0 ? s : null;
};

/**
 * Format author name for citation styles.
 * Accepts "First Last" or "Last, First" — normalizes to required style.
 * @param {string} author
 * @param {'last-first'|'first-last'} style
 * @returns {string}
 */
const formatAuthor = (author, style = 'last-first') => {
  const a = author.trim();
  if (a.includes(',')) {
    const [last, first] = a.split(',').map((s) => s.trim());
    return style === 'last-first'
      ? `${last}, ${first ? first.charAt(0) + '.' : ''}`.trim().replace(/,\s*$/, '')
      : `${first} ${last}`;
  }
  const parts = a.split(/\s+/);
  const last = parts[parts.length - 1];
  const first = parts.slice(0, -1).join(' ');
  return style === 'last-first'
    ? `${last}, ${first ? first.charAt(0) + '.' : ''}`.trim().replace(/,\s*$/, '')
    : `${first} ${last}`;
};

/**
 * Generate a citation using strict field-based templates.
 *
 * Mode 2 — completely independent from Mode 1 (plagiarism).
 * Never checks inputText. Never falls back to generic text errors.
 * All validation is field-driven.
 *
 * Required fields: title, year, author
 * Optional fields: publisher, url  (omitted cleanly if missing — no extra punctuation)
 *
 * @param {object} params
 * @param {string} params.title      - Required
 * @param {string} params.author     - Required
 * @param {string} params.year       - Required
 * @param {string} [params.publisher]- Optional
 * @param {string} [params.url]      - Optional
 * @param {string} params.style      - Required: APA | MLA | Chicago | Harvard
 * @param {string} [params.type]     - Optional: reserved for future source types
 * @returns {{ status: 'success'|'error', data: string|null, message: string|null }}
 */
const generateCitation = ({ title, author, year, publisher, url, style, type } = {}) => {
  // ── Field-level validation (Mode 2 only — no inputText, no generic text checks) ──

  const fmt = trimField(style);
  if (!fmt) {
    return {
      status: 'error',
      data: null,
      message: `ERROR: Missing required field 'style'. Supported: ${CITATION_FORMATS.join(', ')}`,
    };
  }
  if (!CITATION_FORMATS.map((f) => f.toUpperCase()).includes(fmt.toUpperCase())) {
    return {
      status: 'error',
      data: null,
      message: `ERROR: Invalid format '${fmt}'. Supported formats: ${CITATION_FORMATS.join(', ')}`,
    };
  }

  const cleanTitle = trimField(title);
  if (!cleanTitle) {
    return { status: 'error', data: null, message: "ERROR: Missing required field 'title'" };
  }

  const cleanYear = trimField(year);
  if (!cleanYear) {
    return { status: 'error', data: null, message: "ERROR: Missing required field 'year'" };
  }

  const cleanAuthor = trimField(author);
  if (!cleanAuthor) {
    return { status: 'error', data: null, message: "ERROR: Missing required field 'author'" };
  }

  // Optional fields — null if empty, never cause punctuation artifacts
  const cleanPublisher = trimField(publisher);
  const cleanUrl = trimField(url);

  const fmtUpper = fmt.toUpperCase();
  let citation = '';

  if (fmtUpper === 'APA') {
    // APA: Author, A. A. (Year). Title. Publisher. URL
    const parts = [
      `${formatAuthor(cleanAuthor, 'last-first')}.`,
      `(${cleanYear}).`,
      `${cleanTitle}.`,
    ];
    if (cleanPublisher) parts.push(`${cleanPublisher}.`);
    if (cleanUrl) parts.push(cleanUrl);
    citation = parts.join(' ');

  } else if (fmtUpper === 'MLA') {
    // MLA: Author. "Title." Publisher, Year. URL.
    const parts = [`${formatAuthor(cleanAuthor, 'last-first')}.`, `"${cleanTitle}."`];
    const pubYear = [cleanPublisher, cleanYear].filter(Boolean).join(', ');
    if (pubYear) parts.push(`${pubYear}.`);
    if (cleanUrl) parts.push(`${cleanUrl}.`);
    citation = parts.join(' ');

  } else if (fmtUpper === 'CHICAGO') {
    // Chicago: Author. Title. Publisher, Year. URL.
    const parts = [`${formatAuthor(cleanAuthor, 'last-first')}.`, `${cleanTitle}.`];
    const pubYear = [cleanPublisher, cleanYear].filter(Boolean).join(', ');
    if (pubYear) parts.push(`${pubYear}.`);
    if (cleanUrl) parts.push(`${cleanUrl}.`);
    citation = parts.join(' ');

  } else if (fmtUpper === 'HARVARD') {
    // Harvard: Author (Year) Title. Publisher. Available at: URL
    const parts = [
      `${formatAuthor(cleanAuthor, 'last-first')}`,
      `(${cleanYear})`,
      `${cleanTitle}.`,
    ];
    if (cleanPublisher) parts.push(`${cleanPublisher}.`);
    if (cleanUrl) parts.push(`Available at: ${cleanUrl}`);
    citation = parts.join(' ');
  }

  return {
    status: 'success',
    data: citation,
    message: null,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// WORD CHOICE ENHANCER — NLP-powered (wordpos + natural + compromise)
// ═══════════════════════════════════════════════════════════════════════════════

const WordPOS = require('wordpos');
const wordpos = new WordPOS();

// Weak/overused words with stronger alternatives (curated wordlist)
const WEAK_WORD_MAP = {
  // Verbs
  'said':      ['stated', 'declared', 'remarked', 'noted', 'asserted'],
  'got':       ['obtained', 'acquired', 'received', 'gained', 'secured'],
  'get':       ['obtain', 'acquire', 'receive', 'gain', 'secure'],
  'make':      ['create', 'produce', 'generate', 'craft', 'develop'],
  'made':      ['created', 'produced', 'generated', 'crafted', 'developed'],
  'show':      ['demonstrate', 'illustrate', 'reveal', 'exhibit', 'highlight'],
  'showed':    ['demonstrated', 'illustrated', 'revealed', 'exhibited', 'highlighted'],
  'use':       ['utilize', 'employ', 'apply', 'leverage', 'implement'],
  'used':      ['utilized', 'employed', 'applied', 'leveraged', 'implemented'],
  'help':      ['assist', 'support', 'facilitate', 'enable', 'aid'],
  'helped':    ['assisted', 'supported', 'facilitated', 'enabled', 'aided'],
  'think':     ['believe', 'consider', 'conclude', 'determine', 'assess'],
  'thought':   ['believed', 'considered', 'concluded', 'determined', 'assessed'],
  'look':      ['examine', 'analyze', 'inspect', 'observe', 'review'],
  'looked':    ['examined', 'analyzed', 'inspected', 'observed', 'reviewed'],
  'give':      ['provide', 'offer', 'present', 'deliver', 'supply'],
  'gave':      ['provided', 'offered', 'presented', 'delivered', 'supplied'],
  'put':       ['place', 'position', 'insert', 'establish', 'set'],
  'take':      ['acquire', 'obtain', 'capture', 'extract', 'derive'],
  'took':      ['acquired', 'obtained', 'captured', 'extracted', 'derived'],
  'come':      ['arrive', 'emerge', 'appear', 'approach', 'surface'],
  'came':      ['arrived', 'emerged', 'appeared', 'approached', 'surfaced'],
  'go':        ['proceed', 'advance', 'progress', 'move', 'travel'],
  'went':      ['proceeded', 'advanced', 'progressed', 'moved', 'traveled'],
  'see':       ['observe', 'notice', 'perceive', 'identify', 'recognize'],
  'saw':       ['observed', 'noticed', 'perceived', 'identified', 'recognized'],
  'know':      ['understand', 'recognize', 'comprehend', 'realize', 'grasp'],
  'knew':      ['understood', 'recognized', 'comprehended', 'realized', 'grasped'],
  'want':      ['desire', 'seek', 'require', 'aim for', 'intend'],
  'wanted':    ['desired', 'sought', 'required', 'aimed for', 'intended'],
  'need':      ['require', 'demand', 'necessitate', 'depend on', 'call for'],
  'needed':    ['required', 'demanded', 'necessitated', 'depended on', 'called for'],
  'try':       ['attempt', 'endeavor', 'strive', 'seek', 'pursue'],
  'tried':     ['attempted', 'endeavored', 'strived', 'sought', 'pursued'],
  'start':     ['initiate', 'commence', 'launch', 'establish', 'introduce'],
  'started':   ['initiated', 'commenced', 'launched', 'established', 'introduced'],
  'end':       ['conclude', 'finalize', 'terminate', 'complete', 'resolve'],
  'ended':     ['concluded', 'finalized', 'terminated', 'completed', 'resolved'],
  'find':      ['discover', 'identify', 'locate', 'determine', 'uncover'],
  'found':     ['discovered', 'identified', 'located', 'determined', 'uncovered'],
  'tell':      ['inform', 'notify', 'communicate', 'convey', 'explain'],
  'told':      ['informed', 'notified', 'communicated', 'conveyed', 'explained'],
  'ask':       ['inquire', 'request', 'query', 'question', 'solicit'],
  'asked':     ['inquired', 'requested', 'queried', 'questioned', 'solicited'],
  'keep':      ['maintain', 'preserve', 'retain', 'sustain', 'uphold'],
  'kept':      ['maintained', 'preserved', 'retained', 'sustained', 'upheld'],
  'change':    ['modify', 'alter', 'transform', 'revise', 'adjust'],
  'changed':   ['modified', 'altered', 'transformed', 'revised', 'adjusted'],
  'increase':  ['enhance', 'expand', 'amplify', 'elevate', 'boost'],
  'decreased': ['reduced', 'diminished', 'declined', 'lowered', 'contracted'],
  // Adjectives
  'good':      ['excellent', 'effective', 'superior', 'outstanding', 'remarkable'],
  'bad':       ['poor', 'inadequate', 'inferior', 'deficient', 'substandard'],
  'big':       ['substantial', 'significant', 'considerable', 'extensive', 'large-scale'],
  'small':     ['minimal', 'limited', 'modest', 'minor', 'negligible'],
  'important': ['critical', 'essential', 'significant', 'crucial', 'vital'],
  'new':       ['innovative', 'novel', 'emerging', 'contemporary', 'modern'],
  'old':       ['established', 'traditional', 'conventional', 'longstanding', 'dated'],
  'many':      ['numerous', 'multiple', 'various', 'several', 'abundant'],
  'few':       ['limited', 'scarce', 'minimal', 'sparse', 'insufficient'],
  'hard':      ['challenging', 'demanding', 'complex', 'rigorous', 'difficult'],
  'easy':      ['straightforward', 'simple', 'accessible', 'manageable', 'effortless'],
  'fast':      ['rapid', 'swift', 'efficient', 'accelerated', 'expedient'],
  'slow':      ['gradual', 'deliberate', 'measured', 'unhurried', 'methodical'],
  'clear':     ['evident', 'apparent', 'transparent', 'explicit', 'unambiguous'],
  'real':      ['genuine', 'authentic', 'actual', 'tangible', 'concrete'],
  'different': ['distinct', 'diverse', 'varied', 'alternative', 'contrasting'],
  'same':      ['identical', 'consistent', 'uniform', 'equivalent', 'comparable'],
  'high':      ['elevated', 'substantial', 'significant', 'considerable', 'superior'],
  'low':       ['minimal', 'reduced', 'limited', 'modest', 'diminished'],
  // Adverbs
  'very':      ['extremely', 'highly', 'significantly', 'considerably', 'substantially'],
  'really':    ['genuinely', 'truly', 'notably', 'remarkably', 'particularly'],
  'just':      ['precisely', 'exactly', 'specifically', 'merely', 'simply'],
  'also':      ['additionally', 'furthermore', 'moreover', 'likewise', 'similarly'],
  'often':     ['frequently', 'regularly', 'consistently', 'repeatedly', 'routinely'],
  'always':    ['consistently', 'invariably', 'perpetually', 'continuously', 'constantly'],
  'never':     ['rarely', 'seldom', 'infrequently', 'scarcely', 'hardly ever'],
  'only':      ['solely', 'exclusively', 'merely', 'purely', 'strictly'],
  'quickly':   ['rapidly', 'swiftly', 'promptly', 'efficiently', 'expeditiously'],
  'slowly':    ['gradually', 'methodically', 'deliberately', 'incrementally', 'steadily'],
  'well':      ['effectively', 'proficiently', 'skillfully', 'competently', 'adeptly'],
  'badly':     ['poorly', 'inadequately', 'ineffectively', 'deficiently', 'insufficiently'],
};

/**
 * Enhances word choice using wordpos POS tagging + curated wordlist + compromise NLP.
 * Identifies weak/overused words and suggests stronger alternatives.
 *
 * @param {string} text
 * @returns {Promise<string>} — formatted enhancement report
 */
const enhanceWordChoice = async (text) => {
  const doc    = nlp(text);
  const tokens = tokenize(text);

  // Get POS tags via compromise
  const pos = {
    verbs:      new Set(doc.verbs().out('array').map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))),
    adjectives: new Set(doc.adjectives().out('array').map((w) => w.toLowerCase())),
    adverbs:    new Set(doc.adverbs().out('array').map((w) => w.toLowerCase())),
    nouns:      new Set(doc.nouns().out('array').map((w) => w.toLowerCase())),
  };

  // Find weak words in the text
  const suggestions = [];
  const seen = new Set();

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (seen.has(lower)) continue;
    if (WEAK_WORD_MAP[lower]) {
      seen.add(lower);
      // Determine POS category
      let category = 'word';
      if (pos.verbs.has(lower))      category = 'verb';
      else if (pos.adjectives.has(lower)) category = 'adjective';
      else if (pos.adverbs.has(lower))    category = 'adverb';
      else if (pos.nouns.has(lower))      category = 'noun';

      suggestions.push({
        word:        lower,
        category,
        alternatives: WEAK_WORD_MAP[lower],
      });
    }
  }

  // Use wordpos to verify/enrich — get synonyms for nouns and adjectives
  const wordposEnrichments = [];
  const wordposTargets = tokens
    .filter((t) => pos.adjectives.has(t.toLowerCase()) || pos.nouns.has(t.toLowerCase()))
    .filter((t) => t.length > 3 && !STOP_WORDS.has(t.toLowerCase()))
    .slice(0, 8); // limit to avoid slowdown

  for (const word of wordposTargets) {
    try {
      const isAdj  = await wordpos.isAdjective(word);
      const isNoun = await wordpos.isNoun(word);
      if (isAdj || isNoun) {
        wordposEnrichments.push({ word, type: isAdj ? 'adjective' : 'noun' });
      }
    } catch {
      // wordpos lookup failed — skip silently
    }
  }

  // Build output report
  const lines = [];

  lines.push(`📝 Word Choice Analysis`);
  lines.push(`${'─'.repeat(40)}`);
  lines.push(`Total words: ${tokens.length}`);
  lines.push(`Weak/overused words found: ${suggestions.length}`);
  lines.push('');

  if (suggestions.length === 0) {
    lines.push('✅ Great job! No weak or overused words detected.');
    lines.push('   Your word choices are strong and varied.');
  } else {
    lines.push('⚠️  Suggestions to strengthen your writing:');
    lines.push('');
    suggestions.forEach((s, i) => {
      lines.push(`${i + 1}. "${s.word}" [${s.category}]`);
      lines.push(`   → Try: ${s.alternatives.slice(0, 3).join(', ')}`);
    });
  }

  lines.push('');
  lines.push(`🔍 POS Breakdown (via compromise NLP):`);
  lines.push(`   Verbs: ${[...pos.verbs].slice(0, 6).join(', ') || 'none'}`);
  lines.push(`   Adjectives: ${[...pos.adjectives].slice(0, 6).join(', ') || 'none'}`);
  lines.push(`   Adverbs: ${[...pos.adverbs].slice(0, 6).join(', ') || 'none'}`);

  if (wordposEnrichments.length > 0) {
    lines.push('');
    lines.push(`📚 WordNet-verified words (wordpos):`);
    wordposEnrichments.forEach((w) => {
      lines.push(`   • "${w.word}" — confirmed ${w.type}`);
    });
  }

  lines.push('');
  lines.push(`💡 Tip: Replace weak words with the suggested alternatives`);
  lines.push(`   to make your writing more precise and impactful.`);

  return lines.join('\n');
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
  detectPlagiarism,
  generateCitation,
  enhanceWordChoice,
};
