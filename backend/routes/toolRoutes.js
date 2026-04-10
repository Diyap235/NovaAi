const express = require('express');
const {
  paraphrase, humanize, enhance, restructure, toneRewrite, styleRewrite,
  vocabulary, wordChoice, plagiarism, citation,
  keywordDensity, similarity, sentiment,
  summarize, grammar, readability,
} = require('../controllers/toolController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All tool routes require a valid JWT
router.use(protect);

// ── AI Tools (generative) ─────────────────────────────────────────────────────
router.post('/paraphrase',      paraphrase);
router.post('/humanize',        humanize);
router.post('/enhance',         enhance);
router.post('/restructure',     restructure);
router.post('/tone',            toneRewrite);
router.post('/style',           styleRewrite);
router.post('/vocabulary',      vocabulary);

// ── NLP Tools (analytical) ───────────────────────────────────────────────────
router.post('/keyword-density', keywordDensity);
router.post('/similarity',      similarity);
router.post('/sentiment',       sentiment);
router.post('/plagiarism',      plagiarism);
router.post('/citation',        citation);
router.post('/word-choice',     wordChoice);

// ── Hybrid Tools (NLP first → AI fallback) ───────────────────────────────────
router.post('/summarize',       summarize);
router.post('/grammar',         grammar);
router.post('/readability',     readability);

module.exports = router;
