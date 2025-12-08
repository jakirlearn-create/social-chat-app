const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// GET - Get user's conversations
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.getUserConversations(req.userId);

    // Format response
    const formatted = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== req.userId.toString()
      );

      const unreadCount = conv.unreadCount.get(req.userId.toString()) || 0;

      return {
        _id: conv._id,
        participant: otherParticipant,
        lastMessage: conv.lastMessageText,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: unreadCount,
        isGroup: conv.isGroup,
        groupName: conv.groupName,
        groupIcon: conv.groupIcon,
        isPinned: conv.isPinned,
        createdAt: conv.createdAt
      };
    });

    res.json({ conversations: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// GET - Get specific conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name profilePic idNumber isActive lastLogin')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is participant
    if (!conversation.participants.find(p => p._id.toString() === req.userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
});

// POST - Create or get conversation with user
router.post('/with/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create conversation
    let conversation = await Conversation.findBetweenUsers(req.userId, userId);

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.userId, userId],
        isGroup: false
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name profilePicture idNumber isActive lastLogin');
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation', error: error.message });
  }
});

// PUT - Pin/Unpin conversation
router.put('/:conversationId/pin', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.isPinned = !conversation.isPinned;
    await conversation.save();

    res.json({ message: 'Conversation updated', isPinned: conversation.isPinned });
  } catch (error) {
    res.status(500).json({ message: 'Error updating conversation', error: error.message });
  }
});

// PUT - Archive conversation
router.put('/:conversationId/archive', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.isArchived = !conversation.isArchived;
    await conversation.save();

    res.json({ message: 'Conversation updated', isArchived: conversation.isArchived });
  } catch (error) {
    res.status(500).json({ message: 'Error updating conversation', error: error.message });
  }
});

// DELETE - Delete conversation
router.delete('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Delete all messages
    await Message.deleteMany({ conversationId });

    // Delete conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting conversation', error: error.message });
  }
});

// POST - Create group conversation
router.post('/group', auth, async (req, res) => {
  try {
    const { participantIds, groupName, groupIcon } = req.body;

    if (!participantIds || participantIds.length < 2) {
      return res.status(400).json({ message: 'At least 2 participants required' });
    }

    if (!groupName) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Add creator to participants
    const allParticipants = [req.userId, ...participantIds];

    const conversation = await Conversation.create({
      participants: allParticipants,
      isGroup: true,
      groupName,
      groupIcon,
      groupAdmin: req.userId
    });

    const populated = await Conversation.findById(conversation._id)
      .populate('participants', 'name profilePicture idNumber isActive');

    res.status(201).json({ message: 'Group created', conversation: populated });
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error: error.message });
  }
});

module.exports = router;
