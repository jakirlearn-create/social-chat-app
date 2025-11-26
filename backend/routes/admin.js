const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { adminAuth, trackAdminAction } = require('../middleware/adminTracker');
const AdminLog = require('../models/AdminLog');
const AdminRequest = require('../models/AdminRequest');
const User = require('../models/User');

// ========== ADMIN REGISTRATION ROUTES ==========

// POST - Submit admin registration request
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      nid,
      address,
      city,
      district,
      postalCode,
      dateOfBirth,
      gender,
      education,
      experience,
      reason,
      referralCode
    } = req.body;

    // Check if email already exists in requests
    const existingRequest = await AdminRequest.findOne({ email, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'A pending request already exists with this email' });
    }

    // Check if email already exists in users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Create admin request
    const adminRequest = new AdminRequest({
      fullName,
      email,
      phone,
      country,
      nid,
      address,
      city,
      district,
      postalCode,
      dateOfBirth,
      gender,
      education,
      experience,
      reason,
      referralCode
    });

    await adminRequest.save();

    res.status(201).json({
      success: true,
      message: 'Admin registration submitted successfully',
      requestId: adminRequest._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// GET - Get all pending admin requests (Super Admin only)
router.get('/pending', auth, adminAuth, async (req, res) => {
  try {
    // Check if super admin
    const adminUser = await User.findById(req.userId);
    if (adminUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Super Admin access required' });
    }

    const pendingRequests = await AdminRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests: pendingRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching requests', error: error.message });
  }
});

// PUT - Approve admin request (Super Admin only)
router.put('/approve/:id', auth, adminAuth, async (req, res) => {
  try {
    // Check if super admin
    const adminUser = await User.findById(req.userId);
    if (adminUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Super Admin access required' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const adminRequest = await AdminRequest.findById(req.params.id);
    if (!adminRequest) {
      return res.status(404).json({ message: 'Admin request not found' });
    }

    if (adminRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = new User({
      name: adminRequest.fullName,
      email: adminRequest.email,
      username: username,
      password: hashedPassword,
      phone: adminRequest.phone,
      role: 'admin',
      isAdmin: true,
      permissions: ['view_reports', 'manage_users', 'manage_wallet', 'moderate_content'],
      createdBy: req.userId
    });

    await newAdmin.save();

    // Update admin request
    adminRequest.status = 'approved';
    adminRequest.username = username;
    adminRequest.password = hashedPassword;
    adminRequest.reviewedBy = req.userId;
    adminRequest.reviewedAt = new Date();
    await adminRequest.save();

    // Log admin action
    await AdminLog.logAction(
      req.userId,
      'approve',
      'AdminRequest',
      adminRequest._id,
      newAdmin._id,
      'Approved admin request and created admin account',
      {},
      { username, email: adminRequest.email },
      req,
      'success'
    );

    res.json({
      success: true,
      message: 'Admin approved successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        username: username
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving admin', error: error.message });
  }
});

// PUT - Reject admin request (Super Admin only)
router.put('/reject/:id', auth, adminAuth, async (req, res) => {
  try {
    // Check if super admin
    const adminUser = await User.findById(req.userId);
    if (adminUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Super Admin access required' });
    }

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason required' });
    }

    const adminRequest = await AdminRequest.findById(req.params.id);
    if (!adminRequest) {
      return res.status(404).json({ message: 'Admin request not found' });
    }

    if (adminRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Update admin request
    adminRequest.status = 'rejected';
    adminRequest.rejectionReason = reason;
    adminRequest.reviewedBy = req.userId;
    adminRequest.reviewedAt = new Date();
    await adminRequest.save();

    // Log admin action
    await AdminLog.logAction(
      req.userId,
      'reject',
      'AdminRequest',
      adminRequest._id,
      null,
      'Rejected admin request',
      {},
      { reason },
      req,
      'success'
    );

    res.json({
      success: true,
      message: 'Admin request rejected'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rejecting admin', error: error.message });
  }
});

// POST - Super Admin Login
router.post('/superadmin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // HARDCODED SUPER ADMIN CREDENTIALS FOR DEMO
    const SUPER_ADMIN_EMAIL = 'jakirlearn@gmail.com';
    const SUPER_ADMIN_USERNAME = 'superadmin';
    const SUPER_ADMIN_PASSWORD = 'Iqlab4219';

    // Check hardcoded credentials first
    if ((username === SUPER_ADMIN_EMAIL || username === SUPER_ADMIN_USERNAME) && 
        password === SUPER_ADMIN_PASSWORD) {
      
      const token = jwt.sign(
        { userId: 'superadmin_id', role: 'superadmin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: 'superadmin_id',
          name: 'Jakir Hossain',
          username: 'superadmin',
          email: SUPER_ADMIN_EMAIL,
          role: 'superadmin'
        }
      });
    }

    // Try database if hardcoded fails
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }], 
      role: 'superadmin' 
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Log login
    await AdminLog.logAction(
      user._id,
      'login',
      'User',
      user._id,
      user._id,
      'Super Admin logged in',
      {},
      {},
      req,
      'success'
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// POST - Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // HARDCODED ADMIN DEMO CREDENTIALS
    const ADMIN_USERNAME = 'admin_demo';
    const ADMIN_PASSWORD = 'Jakir4219';

    // Check hardcoded credentials first
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { userId: 'admin_demo_id', role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: 'admin_demo_id',
          name: 'Demo Admin',
          username: ADMIN_USERNAME,
          email: 'admin@fwp.com',
          role: 'admin',
          permissions: ['view_reports', 'manage_users', 'manage_wallet', 'moderate_content']
        }
      });
    }

    // Try database if hardcoded fails
    const user = await User.findOne({ username, role: { $in: ['admin', 'staff'] } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Log login
    await AdminLog.logAction(
      user._id,
      'login',
      'User',
      user._id,
      user._id,
      'Admin logged in',
      {},
      {},
      req,
      'success'
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// ========== ADMIN LOGS ROUTES ==========

// GET - Get all admin logs (admin only)
router.get('/logs', auth, adminAuth, async (req, res) => {
  try {
    const { 
      limit = 50, 
      skip = 0, 
      action, 
      targetModel, 
      adminId, 
      startDate, 
      endDate,
      status
    } = req.query;

    // Build query
    const query = {};
    if (action) query.action = action;
    if (targetModel) query.targetModel = targetModel;
    if (adminId) query.admin = adminId;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AdminLog.find(query)
      .populate('admin', 'name idNumber email role')
      .populate('targetUser', 'name idNumber email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await AdminLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
});

// GET - Get admin's own activity
router.get('/logs/my-activity', auth, adminAuth, async (req, res) => {
  try {
    const { limit = 50, skip = 0, startDate, endDate } = req.query;

    const logs = await AdminLog.getAdminActivity(req.userId, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      startDate,
      endDate
    });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
});

// GET - Get activity by target
router.get('/logs/target/:targetModel/:targetId', auth, adminAuth, async (req, res) => {
  try {
    const { targetModel, targetId } = req.params;

    const logs = await AdminLog.getTargetHistory(targetModel, targetId);

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching target history', error: error.message });
  }
});

// GET - Get activity statistics
router.get('/stats/activity', auth, adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get activity by action
    const actionStats = await AdminLog.aggregate([
      { $match: query },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get activity by admin
    const adminStats = await AdminLog.aggregate([
      { $match: query },
      { $group: { _id: '$admin', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Populate admin details
    await AdminLog.populate(adminStats, {
      path: '_id',
      select: 'name idNumber role'
    });

    // Get activity by target model
    const modelStats = await AdminLog.aggregate([
      { $match: query },
      { $group: { _id: '$targetModel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get activity by status
    const statusStats = await AdminLog.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      actionStats,
      adminStats,
      modelStats,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// GET - Get recent admin activity (dashboard)
router.get('/activity/recent', auth, adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const recentActivity = await AdminLog.find({})
      .populate('admin', 'name idNumber role profilePic')
      .populate('targetUser', 'name idNumber profilePic')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ activity: recentActivity });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activity', error: error.message });
  }
});

// DELETE - Clear old logs (superadmin only)
router.delete('/logs/cleanup', auth, adminAuth, async (req, res) => {
  try {
    // Check if superadmin
    if (req.adminUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Superadmin access required' });
    }

    const { daysOld = 90 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const result = await AdminLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.json({
      message: `Deleted ${result.deletedCount} logs older than ${daysOld} days`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cleaning up logs', error: error.message });
  }
});

module.exports = router;
