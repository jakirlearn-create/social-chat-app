const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    default: null
  },
  groupIcon: {
    type: String,
    default: null
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastMessageText: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  mutedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for efficient querying
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });
conversationSchema.index({ participants: 1, lastMessageTime: -1 });

// Method to get conversation between two users
conversationSchema.statics.findBetweenUsers = async function(userId1, userId2) {
  return this.findOne({
    isGroup: false,
    participants: { $all: [userId1, userId2], $size: 2 }
  })
  .populate('participants', 'name profilePic idNumber isActive lastLogin')
  .populate('lastMessage');
};

// Method to get user's conversations
conversationSchema.statics.getUserConversations = async function(userId) {
  return this.find({
    participants: userId,
    isArchived: false
  })
  .populate('participants', 'name profilePic idNumber isActive lastLogin')
  .populate('lastMessage')
  .sort({ lastMessageTime: -1 });
};

module.exports = mongoose.model('Conversation', conversationSchema);
