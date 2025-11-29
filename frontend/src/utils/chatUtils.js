/**
 * Chat Utility Functions
 * Contains helper functions for chat room management
 */

/**
 * Generate a unique chat room ID from two user IDs
 * Always returns the same ID regardless of order (A→B or B→A)
 * 
 * @param {string|number} userId1 - First user ID
 * @param {string|number} userId2 - Second user ID
 * @returns {string} - Sorted chat room ID (e.g., "100001_100005")
 */
export const generateChatRoomId = (userId1, userId2) => {
  const id1 = String(userId1);
  const id2 = String(userId2);
  
  // Sort IDs to ensure consistent room ID regardless of who initiates chat
  const sortedIds = [id1, id2].sort((a, b) => {
    // Numeric comparison if both are numbers
    if (!isNaN(a) && !isNaN(b)) {
      return Number(a) - Number(b);
    }
    // String comparison otherwise
    return a.localeCompare(b);
  });
  
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

/**
 * Format timestamp to readable time
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} - Formatted time (e.g., "2:30 PM")
 */
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  // If within last 24 hours, show time only
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If within last week, show day name
  if (diffInHours < 168) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/**
 * Get the other user's ID from a chat room ID
 * @param {string} chatRoomId - Chat room ID (e.g., "100001_100005")
 * @param {string} currentUserId - Current user's ID
 * @returns {string} - The other user's ID
 */
export const getOtherUserId = (chatRoomId, currentUserId) => {
  const [id1, id2] = chatRoomId.split('_');
  return id1 === String(currentUserId) ? id2 : id1;
};

/**
 * Validate user ID format
 * @param {string|number} userId - User ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidUserId = (userId) => {
  if (!userId) return false;
  const id = String(userId);
  return id.length > 0 && id !== 'undefined' && id !== 'null';
};
