import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminOptions.css';

const AdminOptionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-options-container">
      <div className="options-card">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>

        {/* Admin Icon */}
        <div className="admin-icon">👔</div>

        <h1 className="options-title">Admin Access</h1>
        <p className="options-subtitle">Choose an option to continue</p>

        <div className="options-buttons">
          <button 
            className="option-btn login-option"
            onClick={() => navigate('/admin/login')}
          >
            <div className="btn-icon">🔐</div>
            <h3>Login</h3>
            <p>Already have an account</p>
          </button>

          <button 
            className="option-btn register-option"
            onClick={() => navigate('/admin/register/country')}
          >
            <div className="btn-icon">📝</div>
            <h3>Create Account</h3>
            <p>Request admin access</p>
          </button>
        </div>

        <div className="info-box">
          <p>📌 New admin accounts require Super Admin approval</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOptionsPage;
