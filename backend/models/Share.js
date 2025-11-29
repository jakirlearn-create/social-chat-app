const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
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
  shareType: {
    type: String,
    enum: ['direct', 'timeline', 'messenger', 'external'],
    default: 'timeline'
  },
  caption: {
    type: String,
    maxlength: 1000
  },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
});

// Compound index
shareSchema.index({ post: 1, user: 1 });
shareSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Share', shareSchema);
