const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'live'],
    default: 'text',
    required: true
  },
  content: {
    type: String,
    maxlength: 10000
  },
  media: [{
    url: { type: String, required: true },
    thumb: String,
    mime: String,
    size: Number,
    duration: Number, // for video/audio in seconds
    width: Number,    // for images/video
    height: Number,   // for images/video
    cloudinaryId: String
  }],
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private', 'custom'],
    default: 'public'
  },
  customPrivacy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Live post specific fields
  liveRoomId: {
    type: String,
    default: null
  },
  liveStatus: {
    type: String,
    enum: ['live', 'ended', null],
    default: null
  },
  viewerCount: {
    type: Number,
    default: 0
  },
  // Counters (denormalized for performance)
  reactionsCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  sharesCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // Legacy fields for backward compatibility
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  shares: {
    type: Number,
    default: 0
  },
  // Admin/moderation fields
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  editedAt: Date,
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationNote: String,
  isReported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for efficient queries
postSchema.index({ author: 1, createdAt: -1 }); // Author's posts chronologically
postSchema.index({ createdAt: -1 }); // All posts chronologically
postSchema.index({ type: 1, createdAt: -1 }); // Posts by type
postSchema.index({ privacy: 1, createdAt: -1 }); // Posts by privacy
postSchema.index({ liveStatus: 1, createdAt: -1 }); // Live posts

// Virtual for reaction details (will be populated from Reaction model)
postSchema.virtual('reactions', {
  ref: 'Reaction',
  localField: '_id',
  foreignField: 'post'
});

// Virtual for detailed comments (will be populated from Comment model)
postSchema.virtual('detailedComments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

module.exports = mongoose.model('Post', postSchema);
