import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ComingSoon.css';

function SettingPage({ title = 'Coming Soon' }) {
  const navigate = useNavigate();
  return (
    <div className="coming-soon-page">
      <button className="btn-back-coming-soon" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="coming-soon-content">
        <div className="emoji" />
        <h2>{title}</h2>
        <p>Update Coming Soon</p>
        <button className="btn-home" onClick={() => navigate('/profile')}>
          Return to Profile
        </button>
      </div>
    </div>
  );
}

export default SettingPage;
