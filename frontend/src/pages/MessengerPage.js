import React, { useState, useEffect, useRef } from 'react';
import MessengerTaskbar from '../components/MessengerTaskbar';
import { useNavigate } from 'react-router-dom';
import './MessengerPage.css';
import { t } from '../i18n';

const makeMockChat = (i) => ({
  id: `chat-${i}`,
  name: i % 3 === 0 ? `Group ${i}` : `User ${i}`,
  lastMessage: i % 4 === 0 ? 'Sent a photo' : 'Hey, how are you?',
  time: new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  unread: i % 5 === 0 ? Math.floor(Math.random() * 10) + 1 : 0,
  online: i % 2 === 0,
  avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
});

export default function MessengerPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(0);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    const next = Array.from({ length: 20 }).map((_, idx) => makeMockChat(page * 20 + idx + 1));
    setChats((s) => [...s, ...next]);
    setPage((p) => p + 1);
  };

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) loadMore();
  };

  const filtered = chats.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMessage.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="messenger-page">      <MessengerTaskbar />
      <header className="messenger-header">
        <div className="header-left">
          <h2>{t('messenger.title') || 'Messenger'}</h2>
        </div>
        <div className="header-center">
          <input className="search-input" placeholder={t('search.placeholder') || 'Search chats or messages'} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="header-right">
          <button className="games-icon-btn" onClick={() => setShowGamesModal(true)} title="Play Games">
            🎮
          </button>
          <button className="new-chat-btn" onClick={() => alert('New chat - not implemented')}>New</button>
        </div>
      </header>

      <div className="chats-list" onScroll={handleScroll} ref={listRef}>
        {filtered.map((c) => (
          <div key={c.id} className="chat-row" onClick={() => navigate(`/chat/${c.id}`)}>
            <div className="avatar-wrap">
              <img src={c.avatar} alt="avatar" className={`avatar ${c.online ? 'online' : ''}`} />
            </div>
            <div className="chat-meta">
              <div className="meta-top">
                <div className="chat-name">{c.name}</div>
                <div className="chat-time">{c.time}</div>
              </div>
              <div className="meta-bottom">
                <div className="chat-preview">{c.lastMessage}</div>
                {c.unread > 0 && <div className="unread-badge">{c.unread}</div>}
              </div>
            </div>
          </div>
        ))}
        <div className="list-end">End of list</div>
      </div>

      {/* Games Modal */}
      {showGamesModal && (
        <div className="games-modal-overlay" onClick={() => setShowGamesModal(false)}>
          <div className="games-modal" onClick={(e) => e.stopPropagation()}>
            <div className="games-modal-header">
              <h3>🎮 Play Games</h3>
              <button className="close-btn" onClick={() => setShowGamesModal(false)}>✕</button>
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
                <div className="game-icon">💥</div>
                <div className="game-name">Crash Game</div>
                <div className="game-fee">Entry: 1500 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🎡</div>
                <div className="game-name">Spin Wheel</div>
                <div className="game-fee">Entry: 1000 coins</div>
              </div>
              <div className="game-card" onClick={() => navigate('/games')}>
                <div className="game-icon">🎲</div>
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


