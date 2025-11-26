const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'update',
      'delete',
      'approve',
      'reject',
      'ban',
      'unban',
      'verify',
      'moderate',
      'login',
      'logout',
      'export',
      'import',
      'other'
    ]
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['User', 'Post', 'Message', 'Conversation', 'Wallet', 'WalletTransaction', 'Notification', 'System']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  changes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  oldValues: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  newValues: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: {
    type: String,
    default: null
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for efficient querying
adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ targetModel: 1, action: 1, createdAt: -1 });
adminLogSchema.index({ targetUser: 1, createdAt: -1 });
adminLogSchema.index({ createdAt: -1 });

// Static method to log admin action
adminLogSchema.statics.logAction = async function(data) {
  try {
    const log = await this.create({
      admin: data.adminId,
      action: data.action,
      targetModel: data.targetModel,
      targetId: data.targetId || null,
      targetUser: data.targetUser || null,
      description: data.description,
      changes: data.changes || {},
      oldValues: data.oldValues || {},
      newValues: data.newValues || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      status: data.status || 'success',
      errorMessage: data.errorMessage || null,
      metadata: data.metadata || {}
    });
    return log;
  } catch (error) {
    console.error('Error logging admin action:', error);
    return null;
  }
};

// Static method to get admin activity
adminLogSchema.statics.getAdminActivity = async function(adminId, options = {}) {
  const { limit = 50, skip = 0, startDate, endDate } = options;
  
  const query = { admin: adminId };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .populate('admin', 'name idNumber')
    .populate('targetUser', 'name idNumber')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get activity by target
adminLogSchema.statics.getTargetHistory = async function(targetModel, targetId) {
  return this.find({ targetModel, targetId })
    .populate('admin', 'name idNumber')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('AdminLog', adminLogSchema);
