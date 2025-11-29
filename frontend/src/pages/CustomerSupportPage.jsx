import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ComingSoon.css';

function CustomerSupportPage() {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-page">
      <button className="back-btn" onClick={() => navigate('/home')}>
         Back to Home
      </button>

      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h1>Customer Support</h1>
          <p className="coming-soon-emoji"></p>
          <p className="coming-soon-text">Update Coming Soon</p>
          <p className="coming-soon-subtext">
            This feature is under development. We'll notify you when it's ready!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerSupportPage;
