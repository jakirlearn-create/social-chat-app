const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const { auth } = require('../middleware/auth');

// Helper function to check if viewer can see post based on privacy
const canViewPost = async (post, viewerId) => {
  if (post.deletedAt) {
    return post.author.toString() === viewerId?.toString();
  }

  if (post.privacy === 'public') return true;

  if (!viewerId) return false;

  if (post.author.toString() === viewerId.toString()) return true;

  if (post.privacy === 'private') return false;

  if (post.privacy === 'friends') {
    const author = await User.findById(post.author);
    const isFollower = author.followers?.some(f => f.toString() === viewerId.toString());
    return isFollower;
  }

  if (post.privacy === 'custom') {
    return post.customPrivacy?.some(u => u.toString() === viewerId.toString());
  }

  return false;
};

// GET /api/profile/:userId - Get user profile with posts feed
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, cursor } = req.query;
    const viewerId = req.query.viewerId || req.userId; // Auth optional

    // Get user profile
    const user = await User.findById(userId)
      .select('-password')
      .populate('followers', 'name profilePicture idNumber')
      .populate('following', 'name profilePicture idNumber')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build posts query
    const query = {
      author: userId,
      deletedAt: null,
      isPublished: true
    };

    // Cursor-based pagination
    if (cursor) {
      const [timestamp, id] = cursor.split('_');
      query.$or = [
        { createdAt: { $lt: new Date(timestamp) } },
        { createdAt: new Date(timestamp), _id: { $lt: id } }
      ];
    }

    // Fetch posts
    let posts = await Post.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(parseInt(limit) + 1)
      .populate('author', 'name profilePicture idNumber')
      .lean();

    // Check for next page
    const hasNextPage = posts.length > parseInt(limit);
    if (hasNextPage) posts = posts.slice(0, -1);

    // Filter by privacy and add viewer-specific data
    const filteredPosts = [];
    for (const post of posts) {
      const canView = await canViewPost(post, viewerId);
      if (canView) {
        // Get viewer's reaction if exists
        let viewerReaction = null;
        if (viewerId) {
          const reaction = await Reaction.findOne({ post: post._id, user: viewerId });
          viewerReaction = reaction?.type || null;
        }

        filteredPosts.push({
          ...post,
          viewerReaction,
          isSaved: false // TODO: implement saved posts
        });
      }
    }

    // Generate next cursor
    let nextCursor = null;
    if (hasNextPage && filteredPosts.length > 0) {
      const lastPost = filteredPosts[filteredPosts.length - 1];
      nextCursor = `${lastPost.createdAt}_${lastPost._id}`;
    }

    // Check if viewer is following this profile
    const isFollowing = viewerId && user.followers?.some(
      f => f._id?.toString() === viewerId.toString()
    );

    res.json({
      profile: {
        ...user,
        isFollowing,
        isOwnProfile: viewerId?.toString() === userId
      },
      posts: filteredPosts,
      nextCursor,
      hasNextPage: !!nextCursor
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// GET /api/profile/:userId/stats - Get profile statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('followers following');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count posts
    const postsCount = await Post.countDocuments({
      author: userId,
      deletedAt: null,
      isPublished: true
    });

    // Count reactions received
    const posts = await Post.find({ author: userId }).select('_id');
    const postIds = posts.map(p => p._id);
    const reactionsCount = await Reaction.countDocuments({ post: { $in: postIds } });

    res.json({
      postsCount,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      reactionsCount
    });

  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
