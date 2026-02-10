const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CREATE POST
router.post('/create', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = new Post({
      author: req.userId,
      content
    });

    await newPost.save();
    await newPost.populate('author', 'name profilePicture idNumber');

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// GET ALL POSTS
router.get('/feed', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePic idNumber')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// GET USER POSTS
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name profilePic idNumber')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
});

// LIKE POST
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Already liked this post' });
    }

    post.likes.push(req.userId);
    await post.save();

    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
});

// UNLIKE POST
router.post('/:postId/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.userId);
    await post.save();

    res.json({ message: 'Post unliked', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error: error.message });
  }
});

// ADD COMMENT
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.userId,
      text
    });

    await post.save();
    await post.populate('comments.user', 'name profilePicture');

    res.json({ message: 'Comment added', post });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// DELETE POST
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

module.exports = router;
