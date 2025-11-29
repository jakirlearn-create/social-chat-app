const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    default: 'like',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one reaction per user per post
reactionSchema.index({ post: 1, user: 1 }, { unique: true });

// Index for counting reactions by type
reactionSchema.index({ post: 1, type: 1 });

module.exports = mongoose.model('Reaction', reactionSchema);
