const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true,
    index: true
  },
  phone: {
    type: String,
    sparse: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  dob: String,
  gender: String,
  country: {
    type: String,
    default: ''
  },
  countryCode: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  earnings: {
    coins: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 }
  },
  level: {
    type: Number,
    default: 1
  },
  nextLevelCoins: {
    type: Number,
    default: 1000
  },
  currentLevelProgress: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin', 'superadmin'],
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_posts',
      'manage_wallet',
      'manage_transactions',
      'view_reports',
      'moderate_content',
      'send_notifications',
      'view_logs',
      'manage_settings'
    ]
  }],
  lastLogin: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
