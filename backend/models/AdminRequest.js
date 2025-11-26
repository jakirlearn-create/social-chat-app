const mongoose = require('mongoose');

const adminRequestSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Country
  country: {
    type: String,
    required: true,
    enum: ['Bangladesh', 'Malaysia', 'India', 'Pakistan', 'Nepal']
  },

  // Bangladesh specific fields
  nid: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  education: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },

  // Application details
  reason: {
    type: String,
    required: true
  },
  referralCode: {
    type: String,
    trim: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Credentials (generated on approval)
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String
  },

  // Super Admin actions
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

const AdminRequest = mongoose.model('AdminRequest', adminRequestSchema);

module.exports = AdminRequest;
