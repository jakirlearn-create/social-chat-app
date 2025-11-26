import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ComingSoon.css';

function FollowingPage() {
  const navigate = useNavigate();
  return (
    <div className="coming-soon-page">
      <button className="back-btn" onClick={() => navigate('/profile')}>
        ← Back to Profile
      </button>
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h1>Following</h1>
          <p className="coming-soon-emoji">👥</p>
          <p className="coming-soon-text">Update Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

export default FollowingPage;
