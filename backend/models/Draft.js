const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    toolName: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
      enum: [
        'AI Writing Assistant',
        'Grammar Checker',
        'Paraphrasing Tool',
        'Text Summarizer',
        'Tone Analyzer',
        'Plagiarism Detector',
        'Citation Generator',
        'Word Choice Enhancer',
        'Sentence Restructure',
        'Readability Score',
        'Vocabulary Builder',
        'Style Guide',
      ],
    },
    originalText: {
      type: String,
      required: [true, 'Original text is required'],
      maxlength: [10000, 'Original text cannot exceed 10,000 characters'],
    },
    processedText: {
      type: String,
      required: [true, 'Processed text is required'],
      maxlength: [20000, 'Processed text cannot exceed 20,000 characters'],
    },
    metadata: {
      // Optional per-tool metadata (e.g. tone %, readability score, etc.)
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound index for efficient user history queries ────────────────────────
draftSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Draft', draftSchema);
