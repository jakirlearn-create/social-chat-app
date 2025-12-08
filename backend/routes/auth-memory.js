const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/memory');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate unique ID
const generateUniqueId = async () => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `FWP${timestamp}${randomStr}`;
};

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, dob, gender } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    // Check if user exists
    if (email && await db.findUserByEmail(email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (phone && await db.findUserByPhone(phone)) {
      return res.status(400).json({ message: 'Phone already exists' });
    }

    // Generate unique ID
    const idNumber = await generateUniqueId();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.createUser({
      idNumber,
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      dob,
      gender,
      bio: '',
      profilePic: null,
      followers: [],
      following: [],
      posts: [],
      earnings: { coins: 0, totalEarned: 0 },
      isActive: true,
      createdAt: new Date()
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, idNumber: newUser.idNumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        _id: newUser._id,
        idNumber: newUser.idNumber,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        followers: newUser.followers,
        following: newUser.following,
        earnings: newUser.earnings
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    // Find user
    let user = email ? await db.findUserByEmail(email) : await db.findUserByPhone(phone);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Update last login
    await db.updateUser(user._id, { lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, idNumber: user.idNumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        idNumber: user.idNumber,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        earnings: user.earnings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// GET CURRENT USER
router.get('/me', auth, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// UPDATE PROFILE
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, dob, gender } = req.body;
    
    const user = await db.updateUser(req.userId, { name, bio, dob, gender });

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// CHANGE PASSWORD
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    const user = await db.findUserById(req.userId);
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.updateUser(user._id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// CHANGE EMAIL
router.put('/change-email', auth, async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }

    const existingUser = await db.findUserByEmail(newEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await db.updateUser(req.userId, { email: newEmail });

    res.json({ message: 'Email updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating email', error: error.message });
  }
});

// CHANGE PHONE
router.put('/change-phone', auth, async (req, res) => {
  try {
    const { newPhone } = req.body;

    if (!newPhone) {
      return res.status(400).json({ message: 'New phone is required' });
    }

    const existingUser = await db.findUserByPhone(newPhone);
    if (existingUser) {
      return res.status(400).json({ message: 'Phone already in use' });
    }

    const user = await db.updateUser(req.userId, { phone: newPhone });

    res.json({ message: 'Phone updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating phone', error: error.message });
  }
});

module.exports = router;
