import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <div className="logo-section">
          <h1 className="app-title">FWP Admin Panel</h1>
          <p className="app-subtitle">Control Panel for Social Chat App</p>
        </div>

        <div className="role-selection-content">
          <h2 className="selection-title">Select Your Role</h2>
          <p className="selection-subtitle">Choose your access level to continue</p>

          <div className="role-buttons">
            {/* Super Admin Button */}
            <button 
              className="role-btn super-admin-btn"
              onClick={() => navigate('/superadmin/login')}
            >
              <div className="role-icon">👑</div>
              <div className="role-info">
                <h3>Super Admin</h3>
                <p>Full system control & management</p>
              </div>
            </button>

            {/* Admin Button */}
            <button 
              className="role-btn admin-btn"
              onClick={() => navigate('/admin/options')}
            >
              <div className="role-icon">👔</div>
              <div className="role-info">
                <h3>Admin</h3>
                <p>User management & operations</p>
              </div>
            </button>
          </div>
        </div>

        <div className="footer-section">
          <p className="footer-text">© 2025 FWP Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
