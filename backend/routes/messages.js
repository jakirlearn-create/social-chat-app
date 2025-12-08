const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// GET - Get conversation messages
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Build query
    const query = { conversationId, isDeleted: false };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    // Get messages
    const messages = await Message.find(query)
      .populate('sender', 'name profilePic idNumber')
      .populate('receiver', 'name profilePic idNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// POST - Send message
router.post('/messages', auth, async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text', mediaUrl, replyTo } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Find or create conversation
    let conversation = await Conversation.findBetweenUsers(req.userId, receiverId);
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.userId, receiverId],
        isGroup: false
      });
    }

    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: req.userId,
      receiver: receiverId,
      content,
      messageType,
      mediaUrl,
      replyTo
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageText = content.substring(0, 100);
    conversation.lastMessageTime = new Date();
    
    // Update unread count for receiver
    const unreadCount = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), unreadCount + 1);
    
    await conversation.save();

    // Populate message before sending
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture idNumber')
      .populate('receiver', 'name profilePicture idNumber');

    res.status(201).json({ message: 'Message sent', data: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// PUT - Mark message as read
router.put('/messages/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      receiver: req.userId
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    // Update conversation unread count
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      const unreadCount = conversation.unreadCount.get(req.userId.toString()) || 0;
      conversation.unreadCount.set(req.userId.toString(), Math.max(0, unreadCount - 1));
      await conversation.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error: error.message });
  }
});

// PUT - Mark all conversation messages as read
router.put('/conversations/:conversationId/read', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Message.updateMany(
      {
        conversationId,
        receiver: req.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Reset unread count
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.unreadCount.set(req.userId.toString(), 0);
      await conversation.save();
    }

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating messages', error: error.message });
  }
});

// DELETE - Delete message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender: req.userId
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
});

// POST - Add reaction to message
router.post('/messages/:messageId/reactions', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.userId.toString()
    );

    if (existingReaction) {
      existingReaction.emoji = emoji;
      existingReaction.createdAt = new Date();
    } else {
      message.reactions.push({
        user: req.userId,
        emoji,
        createdAt: new Date()
      });
    }

    await message.save();

    res.json({ message: 'Reaction added', reactions: message.reactions });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reaction', error: error.message });
  }
});

module.exports = router;
