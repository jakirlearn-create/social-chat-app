/**
 * Chat Service - Firebase Realtime Database Operations
 * Handles all messenger functionality: chatList, messages, real-time updates
 */

import { 
  database, 
  ref, 
  onValue, 
  off, 
  push, 
  set, 
  update, 
  get,
  serverTimestamp 
} from './firebaseService';
import { generateChatRoomId } from '../utils/chatUtils';

/**
 * Load user's chat list with real-time updates
 * @param {string} userId - Current user ID
 * @param {function} callback - Callback function receiving chat list array
 * @returns {function} - Cleanup function to remove listener
 */
export const loadChatList = (userId, callback) => {
  if (!userId) {
    console.error('User ID is required to load chat list');
    return () => {};
  }

  const chatListRef = ref(database, `chatList/${userId}`);
  
  const unsubscribe = onValue(chatListRef, async (snapshot) => {
    if (snapshot.exists()) {
      const chatListData = snapshot.val();
      const chatListArray = [];

      // Convert object to array with user IDs
      for (const [otherUserId, chatData] of Object.entries(chatListData)) {
        chatListArray.push({
          userId: otherUserId,
          ...chatData,
        });
      }

      // Sort by most recent message
      chatListArray.sort((a, b) => (b.lastTime || 0) - (a.lastTime || 0));
      
      callback(chatListArray);
    } else {
      // No chats yet
      callback([]);
    }
  }, (error) => {
    console.error('Error loading chat list:', error);
    callback([]);
  });

  // Return cleanup function
  return () => off(chatListRef, 'value', unsubscribe);
};

/**
 * Load messages from a chat room with real-time updates
 * @param {string} chatRoomId - Chat room ID
 * @param {function} callback - Callback function receiving messages array
 * @returns {function} - Cleanup function to remove listener
 */
export const loadMessages = (chatRoomId, callback) => {
  if (!chatRoomId) {
    console.error('Chat room ID is required');
    return () => {};
  }

  const messagesRef = ref(database, `messages/${chatRoomId}`);
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messagesArray = [];

      // Convert object to array
      for (const [messageId, messageData] of Object.entries(messagesData)) {
        messagesArray.push({
          id: messageId,
          ...messageData,
        });
      }

      // Sort by timestamp (oldest first)
      messagesArray.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      
      callback(messagesArray);
    } else {
      // No messages yet
      callback([]);
    }
  }, (error) => {
    console.error('Error loading messages:', error);
    callback([]);
  });

  return () => off(messagesRef, 'value', unsubscribe);
};

/**
 * Send a message and update chat lists
 * @param {string} senderId - Sender user ID
 * @param {string} receiverId - Receiver user ID
 * @param {string} messageText - Message text content
 * @param {object} senderInfo - Sender's name and photo
 * @param {object} receiverInfo - Receiver's name and photo
 * @returns {Promise<boolean>} - Success status
 */
export const sendMessage = async (senderId, receiverId, messageText, senderInfo = {}, receiverInfo = {}) => {
  try {
    if (!senderId || !receiverId || !messageText.trim()) {
      console.error('Missing required parameters for sending message');
      return false;
    }

    const chatRoomId = generateChatRoomId(senderId, receiverId);
    const timestamp = Date.now();

    // 1. Save message to messages/{chatRoomId}/
    const messagesRef = ref(database, `messages/${chatRoomId}`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      senderId,
      receiverId,
      text: messageText.trim(),
      timestamp,
      read: false,
    });

    // 2. Update chat list for sender
    const senderChatListRef = ref(database, `chatList/${senderId}/${receiverId}`);
    await set(senderChatListRef, {
      lastMessage: messageText.trim(),
      lastTime: timestamp,
      unreadCount: 0, // Sender doesn't have unread messages from themselves
      userName: receiverInfo.name || 'Unknown User',
      userPhoto: receiverInfo.photo || '',
    });

    // 3. Update chat list for receiver (increment unread count)
    const receiverChatListRef = ref(database, `chatList/${receiverId}/${senderId}`);
    
    // Get current unread count
    const snapshot = await get(receiverChatListRef);
    const currentData = snapshot.val() || {};
    const currentUnreadCount = currentData.unreadCount || 0;

    await set(receiverChatListRef, {
      lastMessage: messageText.trim(),
      lastTime: timestamp,
      unreadCount: currentUnreadCount + 1, // Increment unread count
      userName: senderInfo.name || 'Unknown User',
      userPhoto: senderInfo.photo || '',
    });

    console.log('Message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

/**
 * Clear unread count when user opens a chat
 * @param {string} currentUserId - Current user ID
 * @param {string} otherUserId - Other user ID
 * @returns {Promise<boolean>} - Success status
 */
export const clearUnreadCount = async (currentUserId, otherUserId) => {
  try {
    if (!currentUserId || !otherUserId) {
      return false;
    }

    const chatListRef = ref(database, `chatList/${currentUserId}/${otherUserId}/unreadCount`);
    await set(chatListRef, 0);
    
    return true;
  } catch (error) {
    console.error('Error clearing unread count:', error);
    return false;
  }
};

/**
 * Get user info from chat list or backend
 * @param {string} userId - User ID to fetch
 * @returns {Promise<object>} - User info object
 */
export const getUserInfo = async (userId) => {
  try {
    // First try to get from Firebase users node
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }

    // If not in Firebase, fetch from backend API
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        name: data.user?.name || 'Unknown User',
        photo: data.user?.profilePhoto || '',
        userId: data.user?.userId || userId,
      };
    }

    return {
      name: 'Unknown User',
      photo: '',
      userId,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      name: 'Unknown User',
      photo: '',
      userId,
    };
  }
};

/**
 * Mark messages as read
 * @param {string} chatRoomId - Chat room ID
 * @param {string} currentUserId - Current user ID
 * @returns {Promise<boolean>} - Success status
 */
export const markMessagesAsRead = async (chatRoomId, currentUserId) => {
  try {
    const messagesRef = ref(database, `messages/${chatRoomId}`);
    const snapshot = await get(messagesRef);
    
    if (snapshot.exists()) {
      const updates = {};
      const messages = snapshot.val();
      
      // Mark all messages not sent by current user as read
      Object.keys(messages).forEach((messageId) => {
        const message = messages[messageId];
        if (message.receiverId === currentUserId && !message.read) {
          updates[`messages/${chatRoomId}/${messageId}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
};

/**
 * Delete a message
 * @param {string} chatRoomId - Chat room ID
 * @param {string} messageId - Message ID to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteMessage = async (chatRoomId, messageId) => {
  try {
    const messageRef = ref(database, `messages/${chatRoomId}/${messageId}`);
    await set(messageRef, null);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
};

/**
 * Create or update user profile in Firebase
 * @param {string} userId - User ID
 * @param {object} userInfo - User information
 * @returns {Promise<boolean>} - Success status
 */
export const updateUserProfile = async (userId, userInfo) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      name: userInfo.name || '',
      photo: userInfo.photo || '',
      userId,
      lastSeen: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
