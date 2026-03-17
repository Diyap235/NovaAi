const express = require('express');
const {
  saveDraft,
  getDrafts,
  getDraftById,
  deleteDraft,
  deleteAllDrafts,
} = require('../controllers/draftController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All draft routes require authentication
router.use(protect);

router.route('/')
  .get(getDrafts)          // GET  /api/drafts?page=1&limit=20&tool=Grammar+Checker
  .post(saveDraft)         // POST /api/drafts  (body: { toolName, originalText, processedText })
  .delete(deleteAllDrafts);// DELETE /api/drafts  (clear all for current user)

router.route('/:id')
  .get(getDraftById)       // GET    /api/drafts/:id
  .delete(deleteDraft);    // DELETE /api/drafts/:id

module.exports = router;
