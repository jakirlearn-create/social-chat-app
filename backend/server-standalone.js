const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded credentials
const SUPER_ADMIN = {
  id: 'superadmin_id',
  name: 'Jakir Hossain',
  username: 'superadmin',
  email: 'jakirlearn@gmail.com',
  password: 'Iqlab4219',
  role: 'superadmin'
};

const ADMIN_DEMO = {
  id: 'admin_demo_id',
  name: 'Demo Admin',
  username: 'admin_demo',
  email: 'admin@fwp.com',
  password: 'Jakir4219',
  role: 'admin',
  permissions: ['view_reports', 'manage_users', 'manage_wallet', 'moderate_content']
};

// Approved admins list (starts with demo admin)
const approvedAdmins = [
  { ...ADMIN_DEMO }
];

// Mock pending admin requests
const mockPendingRequests = [
  {
    _id: 'req1',
    fullName: 'Test User 1',
    email: 'test1@example.com',
    phone: '01712345678',
    country: 'Bangladesh',
    nid: '1234567890123',
    reason: 'I want to help manage the platform',
    createdAt: new Date()
  },
  {
    _id: 'req2',
    fullName: 'Test User 2',
    email: 'test2@example.com',
    phone: '01812345678',
    country: 'Malaysia',
    reason: 'Experienced in community management',
    createdAt: new Date()
  }
];

// Routes

// Super Admin Login
app.post('/api/admin/superadmin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  if ((username === SUPER_ADMIN.email || username === SUPER_ADMIN.username) && 
      password === SUPER_ADMIN.password) {
    
    const token = jwt.sign(
      { userId: SUPER_ADMIN.id, role: SUPER_ADMIN.role },
      'demo-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: SUPER_ADMIN.id,
        name: SUPER_ADMIN.name,
        username: SUPER_ADMIN.username,
        email: SUPER_ADMIN.email,
        role: SUPER_ADMIN.role
      }
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Check in approved admins list
  const admin = approvedAdmins.find(a => a.username === username && a.password === password);

  if (admin) {
    const token = jwt.sign(
      { userId: admin.id, role: admin.role },
      'demo-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`\n🔐 Admin Login:`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Name: ${admin.name}\n`);

    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  }

  return res.status(401).json({ 
    success: false,
    message: 'Invalid credentials. Please check your username and password.' 
  });
});

// Get Pending Admin Requests (Super Admin only)
app.get('/api/admin/pending', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'demo-secret-key');
    
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Super Admin access required' });
    }

    return res.json({
      success: true,
      requests: mockPendingRequests
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Approve Admin Request
app.put('/api/admin/approve/:id', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'demo-secret-key');
    
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Super Admin access required' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const requestId = req.params.id;
    
    // Find the pending request
    const requestIndex = mockPendingRequests.findIndex(r => r._id === requestId);
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const pendingRequest = mockPendingRequests[requestIndex];

    // Check if username already exists
    const existingAdmin = approvedAdmins.find(admin => admin.username === username);
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        message: 'Username already exists. Please choose a different username.' 
      });
    }

    // Create new admin
    const newAdminId = 'admin_' + Date.now();
    const newAdmin = {
      id: newAdminId,
      name: pendingRequest.fullName,
      username: username,
      email: pendingRequest.email,
      password: password, // In real app, this should be hashed
      phone: pendingRequest.phone,
      country: pendingRequest.country,
      role: 'admin',
      permissions: ['view_reports', 'manage_users', 'manage_wallet', 'moderate_content'],
      createdAt: new Date()
    };

    // Add to approved admins list
    approvedAdmins.push(newAdmin);

    // Remove from pending requests
    mockPendingRequests.splice(requestIndex, 1);

    console.log(`\n✅ Admin Approved:`);
    console.log(`   Name: ${newAdmin.name}`);
    console.log(`   Username: ${newAdmin.username}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Total Approved Admins: ${approvedAdmins.length}`);
    console.log(`   Remaining Pending: ${mockPendingRequests.length}\n`);

    return res.json({
      success: true,
      message: 'Admin approved successfully',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        username: newAdmin.username
      }
    });
  } catch (error) {
    console.error('Approve error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Reject Admin Request
app.put('/api/admin/reject/:id', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'demo-secret-key');
    
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Super Admin access required' });
    }

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason required' });
    }

    const requestId = req.params.id;
    
    // Find and remove the pending request
    const requestIndex = mockPendingRequests.findIndex(r => r._id === requestId);
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const rejectedRequest = mockPendingRequests[requestIndex];
    mockPendingRequests.splice(requestIndex, 1);

    console.log(`\n❌ Admin Rejected:`);
    console.log(`   Name: ${rejectedRequest.fullName}`);
    console.log(`   Email: ${rejectedRequest.email}`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Remaining Pending: ${mockPendingRequests.length}\n`);

    return res.json({
      success: true,
      message: 'Admin request rejected'
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Admin Registration
app.post('/api/admin/register', (req, res) => {
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

  if (!fullName || !email || !phone || !country || !reason) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Check if email already exists
  const existingRequest = mockPendingRequests.find(req => req.email === email);
  if (existingRequest) {
    return res.status(400).json({ 
      success: false,
      message: 'A pending request already exists with this email' 
    });
  }

  // Generate unique ID
  const requestId = 'req_' + Date.now();

  // Add new request to mock array
  const newRequest = {
    _id: requestId,
    fullName,
    email,
    phone,
    country,
    nid: nid || '',
    address: address || '',
    city: city || '',
    district: district || '',
    postalCode: postalCode || '',
    dateOfBirth: dateOfBirth || '',
    gender: gender || '',
    education: education || '',
    experience: experience || '',
    reason,
    referralCode: referralCode || '',
    status: 'pending',
    createdAt: new Date()
  };

  mockPendingRequests.push(newRequest);

  console.log(`\n✅ New Admin Registration:`);
  console.log(`   Name: ${fullName}`);
  console.log(`   Email: ${email}`);
  console.log(`   Country: ${country}`);
  console.log(`   Total Pending: ${mockPendingRequests.length}\n`);

  return res.status(201).json({
    success: true,
    message: 'Admin registration submitted successfully',
    requestId: requestId
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running (Standalone Mode - No MongoDB)' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'FWP Admin Panel API - Standalone Mode',
    version: '1.0.0',
    mongodb: 'Not required',
    endpoints: {
      superAdminLogin: 'POST /api/admin/superadmin/login',
      adminLogin: 'POST /api/admin/login',
      pendingRequests: 'GET /api/admin/pending',
      register: 'POST /api/admin/register'
    }
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║     FWP BACKEND - STANDALONE MODE             ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log('\n📝 Mode: STANDALONE (No MongoDB Required)');
  console.log('\n🔐 Hardcoded Credentials:\n');
  console.log('   Super Admin:');
  console.log('   - Email: jakirlearn@gmail.com');
  console.log('   - Password: Iqlab4219\n');
  console.log('   Admin Demo:');
  console.log('   - Username: admin_demo');
  console.log('   - Password: Jakir4219\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Admin Panel: http://localhost:3001\n');
});
