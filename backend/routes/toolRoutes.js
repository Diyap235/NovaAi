const express = require('express');
const {
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
} = require('../controllers/toolController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All tool routes require authentication
router.use(protect);

router.post('/writing-assistant',  aiWritingAssistant);
router.post('/grammar-check',      grammarChecker);
router.post('/paraphrase',         paraphraseText);
router.post('/summarize',          summarizeText);
router.post('/tone-analyze',       toneAnalyzer);
router.post('/plagiarism',         plagiarismCheck);
router.post('/citation',           citationGenerator);
router.post('/word-enhance',       wordChoiceEnhancer);
router.post('/restructure',        sentenceRestructure);
router.post('/readability',        readabilityScore);
router.post('/vocabulary',         vocabularyBuilder);
router.post('/style-guide',        styleGuide);

module.exports = router;
