import React, { useState, useEffect, useRef } from 'react';
import MessengerTaskbar from '../components/MessengerTaskbar';
import { useNavigate } from 'react-router-dom';
import './MessengerPage.css';
import { t } from '../i18n';
import MessengerSearchBar from '../components/MessengerSearchBar';
import { loadChatList } from '../services/chatService';
import { formatMessageTime } from '../utils/chatUtils';

export default function MessengerPage() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const listRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!currentUserId) {
      console.error('User not logged in');
      navigate('/login');
      return;
    }

    setLoading(true);

    // Load chat list from Firebase with real-time updates
    const unsubscribe = loadChatList(currentUserId, async (chatListData) => {
      // Enhance chat list with formatted time
      const enhancedChats = chatListData.map(chat => ({
        ...chat,
        time: formatMessageTime(chat.lastTime),
        name: chat.userName || 'Unknown User',
        avatar: chat.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.userName || 'User')}&background=667eea&color=fff`,
        id: chat.userId,
        unread: chat.unreadCount || 0,
      }));

      setChats(enhancedChats);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserId, navigate]);

  const handleChatClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="messenger-page">
      <MessengerTaskbar />
      <header className="messenger-header">
        <div className="header-left">
          <h2>{t('messenger.title') || 'Messenger'}</h2>
        </div>
        <div className="header-center">
          <MessengerSearchBar
            placeholder={t('search.placeholder') || '🔍 Search to start chat...'}
            onUserSelect={(user) => {
              // Open chat with selected user
              navigate(`/chat/${user.userId}`);
            }}
            onSearchChange={(isSearching) => setShowSearchResults(isSearching)}
          />
        </div>
        <div className="header-right">
          <button className="games-icon-btn" onClick={() => setShowGamesModal(true)} title="Play Games">
            🎮
          </button>
          <button className="new-chat-btn" onClick={() => navigate('/search-users')}>New</button>
        </div>
      </header>

      {/* Show chat list only when not searching */}
      {!showSearchResults && (
        <div className="chats-list" ref={listRef}>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>No conversations yet</h3>
              <p>Start a new chat by searching for users above</p>
            </div>
          ) : (
            <>
              {chats.map((chat) => (
                <div key={chat.id} className="chat-row" onClick={() => handleChatClick(chat.userId)}>
                  <div className="avatar-wrap">
                    <img src={chat.avatar} alt={chat.name} className="avatar" />
                  </div>
                  <div className="chat-meta">
                    <div className="meta-top">
                      <div className="chat-name">{chat.name}</div>
                      <div className="chat-time">{chat.time}</div>
                    </div>
                    <div className="meta-bottom">
                      <div className="chat-preview">{chat.lastMessage || 'No messages yet'}</div>
                      {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Games Modal */}
      {showGamesModal && (
        <div className="games-modal-overlay" onClick={() => setShowGamesModal(false)}>
          <div className="games-modal" onClick={(e) => e.stopPropagation()}>
            <div className="games-modal-header">
              <h3>🎮 Play Games</h3>
              <button className="close-btn" onClick={() => setShowGamesModal(false)}>×</button>
            </div>
            <div className="games-grid">
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🎲</div>
                <div className="game-name">Ludo Quick</div>
                <div className="game-fee">Entry: 1000 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🎯</div>
                <div className="game-name">Carrom Lite</div>
                <div className="game-fee">Entry: 1500 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🐔</div>
                <div className="game-name">Chicken Jump</div>
                <div className="game-fee">Entry: 500 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">📈</div>
                <div className="game-name">Crash Game</div>
                <div className="game-fee">Entry: 1500 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🎡</div>
                <div className="game-name">Spin Wheel</div>
                <div className="game-fee">Entry: 1000 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🔢</div>
                <div className="game-name">Number Roll</div>
                <div className="game-fee">Entry: 800 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🔪</div>
                <div className="game-name">Knife Hit</div>
                <div className="game-fee">Entry: 1200 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🍎</div>
                <div className="game-name">Fruit Slice</div>
                <div className="game-fee">Entry: 1000 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🧠</div>
                <div className="game-name">Memory Match</div>
                <div className="game-fee">Entry: 500 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">⭕</div>
                <div className="game-name">Tic Tac Toe</div>
                <div className="game-fee">Entry: 500 coins</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
