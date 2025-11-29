const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   GET /api/users
 * @desc    Get all users (for admin/search pages)
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({
      isActive: true,
      deletedAt: null
    })
    .select('name idNumber profilePicture country bio createdAt')
    .limit(100)
    .sort({ createdAt: -1 })
    .lean();
    
    const results = users.map(user => ({
      userId: user._id,
      name: user.name,
      username: user.idNumber,
      uid: user.idNumber,
      profilePhoto: user.profilePicture || '',
      country: user.country || '',
      bio: user.bio || ''
    }));
    
    res.json({
      success: true,
      users: results,
      count: results.length
    });
    
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/users/search
 * @desc    Search users by name, idNumber, email (Facebook-style)
 * @access  Private
 */
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query;
    
    // Validate query parameter
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        users: [],
        message: 'Query too short'
      });
    }
    
    const searchQuery = q.toLowerCase().trim();
    
    // Search in searchableKeywords array
    const users = await User.find({
      searchableKeywords: { $in: [searchQuery] },
      isActive: true,
      deletedAt: null
    })
    .select('name idNumber profilePicture country bio')
    .limit(20)
    .sort({ name: 1 })
    .lean();
    
    // Format response
    const results = users.map(user => ({
      userId: user._id,
      name: user.name,
      username: user.idNumber, // Using idNumber as username
      uid: user.idNumber,
      profilePhoto: user.profilePicture || '',
      country: user.country || '',
      bio: user.bio || ''
    }));
    
    res.json({
      success: true,
      users: results,
      count: results.length
    });
    
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/users/profile/:userId
 * @desc    Get user profile (read-only for visitors)
 * @access  Private
 */
router.get('/profile/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;
    
    const user = await User.findById(userId)
      .select('-password -searchableKeywords')
      .populate('posts', 'content mediaUrl likes comments createdAt')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if current user is viewing their own profile
    const isOwner = currentUserId === userId;
    
    // Check if current user follows this user
    const isFollowing = user.followers.some(
      follower => follower.toString() === currentUserId
    );
    
    res.json({
      success: true,
      user: {
        ...user,
        isOwner,
        isFollowing,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: user.posts.length
      }
    });
    
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;
