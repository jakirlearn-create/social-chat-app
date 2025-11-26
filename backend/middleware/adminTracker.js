const AdminLog = require('../models/AdminLog');

/**
 * Middleware to log admin actions automatically
 * Usage: router.post('/endpoint', auth, adminAuth, trackAdminAction('create', 'User'), handler)
 */
const trackAdminAction = (action, targetModel) => {
  return async (req, res, next) => {
    // Store original json and send methods
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    // Track request details
    const startTime = Date.now();
    const adminId = req.userId; // From auth middleware
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Override res.json to capture response
    res.json = function(data) {
      logAction(data, 'success');
      return originalJson(data);
    };

    // Override res.send for error responses
    res.send = function(data) {
      if (res.statusCode >= 400) {
        logAction(data, 'failed');
      }
      return originalSend(data);
    };

    async function logAction(responseData, status) {
      try {
        const duration = Date.now() - startTime;
        
        await AdminLog.logAction({
          adminId: adminId,
          action: action,
          targetModel: targetModel,
          targetId: req.params.id || req.params.userId || req.params.transactionId || null,
          targetUser: req.params.userId || req.body.userId || null,
          description: `${action.toUpperCase()} ${targetModel} - ${req.method} ${req.path}`,
          changes: req.body || {},
          oldValues: req.oldValues || {},
          newValues: responseData || {},
          ipAddress: ipAddress,
          userAgent: userAgent,
          status: status,
          errorMessage: status === 'failed' ? (responseData?.message || 'Unknown error') : null,
          metadata: {
            method: req.method,
            path: req.path,
            duration: duration.toString(),
            statusCode: res.statusCode.toString()
          }
        });
      } catch (error) {
        console.error('Error tracking admin action:', error);
      }
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const adminAuth = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has admin role (you can add role field to User model)
    // For now, you can use a specific field or check against admin user IDs
    if (!user.isAdmin && !user.isStaff) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying admin status', error: error.message });
  }
};

/**
 * Helper function to manually log admin action
 */
const logAdminAction = async (adminId, action, targetModel, details = {}) => {
  try {
    return await AdminLog.logAction({
      adminId: adminId,
      action: action,
      targetModel: targetModel,
      targetId: details.targetId || null,
      targetUser: details.targetUser || null,
      description: details.description || `${action} ${targetModel}`,
      changes: details.changes || {},
      oldValues: details.oldValues || {},
      newValues: details.newValues || {},
      ipAddress: details.ipAddress || null,
      userAgent: details.userAgent || null,
      status: details.status || 'success',
      errorMessage: details.errorMessage || null,
      metadata: details.metadata || {}
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
    return null;
  }
};

module.exports = {
  trackAdminAction,
  adminAuth,
  logAdminAction
};
