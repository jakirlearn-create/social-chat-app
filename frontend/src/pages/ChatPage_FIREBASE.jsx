import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatPage.css';
import { toast } from 'react-hot-toast';
import { loadMessages, sendMessage as sendFirebaseMessage, clearUnreadCount, getUserInfo } from '../services/chatService';
import { generateChatRoomId } from '../utils/chatUtils';

function ChatPage() {
  const { id } = useParams(); // This is the other user's ID
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('userName') || 'You';
  const currentUserPhoto = localStorage.getItem('userPhoto') || '';

  useEffect(() => {
    if (!currentUserId) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (!id) {
      toast.error('Invalid chat');
      navigate('/messenger');
      return;
    }

    // Load partner info
    loadPartnerInfo();

    // Clear unread count
    clearUnreadCount(currentUserId, id);

    // Generate chat room ID
    const chatRoomId = generateChatRoomId(currentUserId, id);

    // Load messages with real-time updates
    const unsubscribe = loadMessages(chatRoomId, (messagesData) => {
      // Format messages for display
      const formattedMessages = messagesData.map(msg => ({
        id: msg.id,
        senderId: msg.senderId === currentUserId ? 'me' : 'other',
        type: 'text',
        content: msg.text,
        timestamp: new Date(msg.timestamp).toISOString(),
        status: msg.read ? 'read' : 'delivered',
      }));

      setMessages(formattedMessages);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id, currentUserId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadPartnerInfo = async () => {
    try {
      const userInfo = await getUserInfo(id);
      setPartner({
        name: userInfo.name || `User ${id}`,
        profilePic: userInfo.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || 'User')}&background=667eea&color=fff`,
        id: id,
      });
    } catch (error) {
      console.error('Error loading partner info:', error);
      setPartner({
        name: `User ${id}`,
        profilePic: `https://ui-avatars.com/api/?name=User&background=667eea&color=fff`,
        id: id,
      });
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const success = await sendFirebaseMessage(
        currentUserId,
        id,
        text.trim(),
        { name: currentUserName, photo: currentUserPhoto },
        { name: partner?.name || 'User', photo: partner?.profilePic || '' }
      );

      if (success) {
        setText('');
        // Message will appear automatically via real-time listener
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate('/messenger')}>
          ← Back
        </button>
        <div className="partner-info">
          <img
            src={partner?.profilePic || ''}
            alt={partner?.name || 'User'}
            className="partner-avatar"
          />
          <div className="partner-details">
            <div className="partner-name">{partner?.name || 'User'}</div>
            <div className="partner-status">Active now</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" title="Voice Call">📞</button>
          <button className="icon-btn" title="Video Call">📹</button>
          <button className="icon-btn" title="More Options">⋮</button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Start the conversation with {partner?.name || 'this user'}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.senderId}`}>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {msg.senderId === 'me' && (
                  <span className="message-status">
                    {msg.status === 'read' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <button
          className="plus-btn"
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          title="Attach"
        >
          +
        </button>

        {showPlusMenu && (
          <div className="plus-menu">
            <button onClick={() => toast.info('Photo upload coming soon')}>
              📷 Photo
            </button>
            <button onClick={() => toast.info('Video upload coming soon')}>
              🎥 Video
            </button>
            <button onClick={() => toast.info('Document upload coming soon')}>
              📄 Document
            </button>
            <button onClick={() => toast.info('Location sharing coming soon')}>
              📍 Location
            </button>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows="1"
          className="message-input"
          disabled={sending}
        />

        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          title="Send"
        >
          {sending ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
