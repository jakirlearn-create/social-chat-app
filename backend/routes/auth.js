const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Country dial codes mapping
const countryDialCodes = {
  'BD': '+880',  // Bangladesh
  'MY': '+60',   // Malaysia
  'IN': '+91',   // India
  'PK': '+92',   // Pakistan
  'NP': '+977'   // Nepal
};

// Helper function to generate country-based unique ID
const generateCountryBasedId = async (countryCode) => {
  try {
    // Get dial code for the country
    const dialCode = countryDialCodes[countryCode] || '+880';
    
    // Find the last user with this country code
    const lastUser = await User.findOne({ countryCode: countryCode })
      .sort({ createdAt: -1 })
      .select('idNumber');
    
    let serialNumber = 1;
    
    if (lastUser && lastUser.idNumber) {
      // Extract the last serial number from existing ID
      // Format: +880099X where X is the serial
      const match = lastUser.idNumber.match(/099(\d+)$/);
      if (match) {
        serialNumber = parseInt(match[1]) + 1;
      }
    }
    
    // Generate new ID: dialCode + 099 + serialNumber
    const newId = `${dialCode}099${serialNumber}`;
    return newId;
  } catch (error) {
    console.error('Error generating country-based ID:', error);
    // Fallback to simple ID
    return `+880099${Date.now() % 10000}`;
  }
};

// SIGNUP - Manual, Google, Facebook
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, dob, gender, country, countryCode } = req.body;

    // Validate input
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    if (!country || !countryCode) {
      return res.status(400).json({ message: 'Country selection is required' });
    }

    // Check if user exists
    let existingUser = null;
    if (email) existingUser = await User.findOne({ email });
    if (!existingUser && phone) existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate country-based unique ID
    const idNumber = await generateCountryBasedId(countryCode);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      idNumber,
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      dob,
      gender,
      country,
      countryCode
    });

    await newUser.save();

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
        country: newUser.country,
        countryCode: newUser.countryCode,
        dob: newUser.dob,
        gender: newUser.gender,
        profilePicture: newUser.profilePicture,
        followers: newUser.followers,
        following: newUser.following,
        earnings: newUser.earnings,
        level: newUser.level,
        nextLevelCoins: newUser.nextLevelCoins,
        currentLevelProgress: newUser.currentLevelProgress
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
    let user = null;
    if (email) user = await User.findOne({ email });
    if (!user && phone) user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

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
        country: user.country,
        countryCode: user.countryCode,
        dob: user.dob,
        gender: user.gender,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        earnings: user.earnings,
        level: user.level,
        nextLevelCoins: user.nextLevelCoins,
        currentLevelProgress: user.currentLevelProgress,
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
    const user = await User.findById(req.userId)
      .populate('followers', 'name profilePicture idNumber')
      .populate('following', 'name profilePicture idNumber')
      .populate('posts');

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
    const { name, bio, profilePicture, dob, gender, country } = req.body;

    const updateData = { name, bio, profilePicture, dob, gender, country, updatedAt: new Date() };

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

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

    const user = await User.findById(req.userId);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

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

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { email: newEmail, updatedAt: new Date() },
      { new: true }
    );

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

    const existingUser = await User.findOne({ phone: newPhone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { phone: newPhone, updatedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Phone updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating phone', error: error.message });
  }
});

// Get user profile by ID
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
