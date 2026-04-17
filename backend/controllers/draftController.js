const Draft = require('../models/Draft');
const User  = require('../models/User');

// ─── POST /api/drafts/save 
const saveDraft = async (req, res, next) => {
  try {
    const { toolName, originalText, processedText, metadata } = req.body;

    if (!toolName || !originalText || !processedText) {
      return res.status(400).json({
        success: false,
        message: 'toolName, originalText, and processedText are required.',
      });
    }

    const draft = await Draft.create({
      userId:        req.user._id,
      toolName,
      originalText,
      processedText,
      metadata:      metadata || {},
    });

    // Increment user's toolsUsed stat
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'stats.toolsUsed':      1,
        'stats.wordsProcessed': originalText.trim().split(/\s+/).length,
      },
      'stats.lastActive': new Date(),
    });

    res.status(201).json({ success: true, message: 'Draft saved.', data: { draft } });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/drafts 
const getDrafts = async (req, res, next) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 20);
    const toolName = req.query.tool;
    const search   = req.query.search;

    const filter = { userId: req.user._id };
    if (toolName) filter.toolName = toolName;
    if (search)   filter.$text    = { $search: search };

    const [drafts, total] = await Promise.all([
      Draft.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Draft.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        drafts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/drafts/:id 
const getDraftById = async (req, res, next) => {
  try {
    const draft = await Draft.findOne({ _id: req.params.id, userId: req.user._id });
    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found.' });
    }
    res.json({ success: true, data: { draft } });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/drafts/:id 
const deleteDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found.' });
    }
    res.json({ success: true, message: 'Draft deleted.' });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/drafts 
const deleteAllDrafts = async (req, res, next) => {
  try {
    const { deletedCount } = await Draft.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: `${deletedCount} draft(s) deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveDraft, getDrafts, getDraftById, deleteDraft, deleteAllDrafts };
