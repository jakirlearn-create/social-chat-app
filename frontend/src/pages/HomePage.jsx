import React, { useState, useEffect } from 'react';
import './HomePage_styled.css';
import ProfilePage from './ProfilePage';
import authService from '../services/authService';
import SearchBar from '../components/SearchBar';

function HomePage() {
  const [query, setQuery] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [activeTab, setActiveTab] = useState('follow');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const path = window.location.pathname || '';
        if (path.startsWith('/profile/')) {
          const id = path.split('/profile/')[1];
          if (id) {
            const found = authService.findByIdNumber(id);
            if (found) setViewUser(found);
          }
        }
        const allUsers = await authService.getAllUsers();
        setUsers(allUsers || []);
      } catch (err) {
        console.error('HomePage init error:', err);
        setUsers([]);
      }
    };
    loadUsers();
  }, []);

  function doSearch(e) {
    if (e && e.preventDefault) e.preventDefault();
    const id = (query || '').trim();
    if (!id) return;
    const found = authService.findByIdNumber(id);
    if (found) {
      setViewUser(found);
      try { window.history.pushState({}, '', '/profile/' + id); } catch (err) {}
    } else {
      alert('User not found for ID: ' + id);
    }
  }

  function handleBackFromProfile() {
    setViewUser(null);
    try { window.history.pushState({}, '', '/home'); } catch (err) {}
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>FWP Audio & Video Chat Bot</h1>
        <div className="home-profile-pic" onClick={() => window.location.href = '/profile'} style={{ cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', marginLeft: 'auto' }}>
          U
        </div>
        <div className="search-bar-wrapper" style={{ maxWidth: '600px', margin: '20px auto' }}>
          <SearchBar placeholder="🔍 Search users by name or ID..." />
        </div>
      </header>

      {viewUser ? (
        <div>
          <button className="back-btn" onClick={handleBackFromProfile} style={{margin: '20px', padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
             Back
          </button>
          <ProfilePage viewUser={viewUser} />
        </div>
      ) : (
        <div className="home-main">
          <div className="tab-navigation">
            <button
              className={'tab-btn ' + (activeTab === 'follow' ? 'active' : '')}
              onClick={() => setActiveTab('follow')}
            >
              Follow
            </button>
            <button
              className={'tab-btn ' + (activeTab === 'live' ? 'active' : '')}
              onClick={() => setActiveTab('live')}
            >
              Live
            </button>
            <button
              className={'tab-btn ' + (activeTab === 'foryou' ? 'active' : '')}
              onClick={() => setActiveTab('foryou')}
            >
              For You
            </button>
            <button
              className="tab-btn"
              onClick={() => window.location.href = '/games'}
            >
              Game
            </button>
          </div>

          <div className="content-area">
            {activeTab === 'follow' && (
              <div className="follow-section">
                <h2>Followers</h2>
                <div className="users-grid">
                  {users.map((u) => (
                    <div key={u.id} className="user-card">
                      <div className="user-name">{u.name}</div>
                      <div className="user-id">ID: {u.idNumber}</div>
                      <button onClick={() => {
                        setViewUser(u);
                        try { window.history.pushState({}, '', '/profile/' + u.idNumber); } catch (e) {}
                      }} className="view-profile-btn">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'live' && (
              <div className="live-section">
                <h2>Live</h2>
                <div className="empty-message">No live streams now</div>
              </div>
            )}

            {activeTab === 'foryou' && (
              <div className="foryou-section">
                <h2>For You</h2>
                <div className="empty-message">Loading content...</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;

