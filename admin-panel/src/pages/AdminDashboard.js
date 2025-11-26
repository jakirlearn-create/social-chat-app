import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import authService from '../services/authService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Check authentication
    const role = authService.getRole();
    if (role !== 'admin' && role !== 'staff') {
      toast.error('Admin access required');
      navigate('/admin/login');
      return;
    }

    const user = authService.getCurrentUser();
    setAdminData(user);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const renderDashboard = () => {
    return (
      <div className="dashboard-overview">
        <h2>📊 Dashboard Overview</h2>
        
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">1,234</p>
              <span className="stat-change positive">+12% this month</span>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Pending Approvals</h3>
              <p className="stat-number">45</p>
              <span className="stat-change">Requires attention</span>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Wallet Requests</h3>
              <p className="stat-number">23</p>
              <span className="stat-change positive">+5 today</span>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">✉️</div>
            <div className="stat-info">
              <h3>Messages</h3>
              <p className="stat-number">567</p>
              <span className="stat-change">Last 7 days</span>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>📌 Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon new">👤</div>
              <div className="activity-content">
                <p className="activity-title">New User Registration</p>
                <p className="activity-desc">John Doe registered from Bangladesh</p>
                <span className="activity-time">5 minutes ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon pending">💰</div>
              <div className="activity-content">
                <p className="activity-title">Wallet Request</p>
                <p className="activity-desc">Withdrawal request of $50 by User #123</p>
                <span className="activity-time">15 minutes ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon success">✓</div>
              <div className="activity-content">
                <p className="activity-title">User Approved</p>
                <p className="activity-desc">Sarah Khan's account verified</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div className="users-section">
        <h2>👥 User Management</h2>
        <p className="section-subtitle">View and manage all users</p>

        <div className="users-filters">
          <input
            type="text"
            placeholder="🔍 Search users..."
            className="search-input"
          />
          <select className="filter-select">
            <option>All Users</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Blocked</option>
          </select>
        </div>

        <div className="coming-soon-box">
          <div className="coming-icon">🚧</div>
          <h3>Coming Soon</h3>
          <p>User management features will be available here</p>
        </div>
      </div>
    );
  };

  const renderWallet = () => {
    return (
      <div className="wallet-section">
        <h2>💰 Wallet Management</h2>
        <p className="section-subtitle">Handle wallet requests and transactions</p>

        <div className="coming-soon-box">
          <div className="coming-icon">🚧</div>
          <h3>Coming Soon</h3>
          <p>Wallet management features will be available here</p>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    return (
      <div className="messages-section">
        <h2>✉️ User Messages</h2>
        <p className="section-subtitle">Send messages to users</p>

        <div className="coming-soon-box">
          <div className="coming-icon">🚧</div>
          <h3>Coming Soon</h3>
          <p>Messaging features will be available here</p>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="notifications-section">
        <h2>🔔 Notifications</h2>
        <p className="section-subtitle">Send notifications to users</p>

        <div className="coming-soon-box">
          <div className="coming-icon">🚧</div>
          <h3>Coming Soon</h3>
          <p>Notification features will be available here</p>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="profile-section">
        <h2>👤 My Profile</h2>
        <p className="section-subtitle">View your profile (Read-only)</p>

        <div className="profile-card-view">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {adminData?.name?.charAt(0) || 'A'}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{adminData?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{adminData?.username || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{adminData?.email || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className="role-badge">{adminData?.role || 'admin'}</span>
            </div>
          </div>

          <div className="profile-notice">
            <p>⚠️ Profile editing is disabled. Contact Super Admin for changes.</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="admin-badge-icon">👔</div>
          <div>
            <h1>Admin Panel</h1>
            <p>Welcome, {adminData?.name || 'Admin'}</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          💰 Wallet
        </button>
        <button
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          ✉️ Messages
        </button>
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default AdminDashboard;
