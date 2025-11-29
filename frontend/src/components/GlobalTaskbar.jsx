import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalTaskbar.css';
import safeLocalStorage from '../utils/safeStorage';
import authService from '../services/authService';

function GlobalTaskbar({ showBack = true }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const current = await authService.getCurrentUser();
        if (current) {
          setUser(current);
        } else {
          const userStr = safeLocalStorage.getItem('user');
          if (userStr) {
            setUser(JSON.parse(userStr));
          } else {
            setUser({
              name: 'Demo User',
              id: 100001,
              profilePicture: ''
            });
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setUser({
          name: 'Demo User',
          id: 100001,
          profilePicture: ''
        });
      }
    };
    loadUser();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.user) {
        setUser(event.detail.user);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  if (!user) return null;

  const handleBack = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="global-taskbar">
      {showBack && (
        <button className="taskbar-back-btn" onClick={handleBack} title="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      
      <div className="taskbar-user-info" onClick={handleProfileClick}>
        <div className="taskbar-profile-pic">
          {(user.profilePicture || user.profilePic) ? (
            <img src={user.profilePicture || user.profilePic} alt={user.name} />
          ) : (
            <div className="taskbar-profile-placeholder">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        
        <div className="taskbar-user-details">
          <div className="taskbar-username">{user.name}</div>
          <div className="taskbar-userid">ID: {user.idNumber || user.id}</div>
        </div>
      </div>
    </div>
  );
}

export default GlobalTaskbar;
