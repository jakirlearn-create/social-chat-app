import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import authService from '../services/authService';
import '../styles/SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    // Check authentication
    const role = authService.getRole();
    if (role !== 'superadmin') {
      toast.error('Super Admin access required');
      navigate('/superadmin/login');
      return;
    }

    fetchPendingRequests();
  }, [navigate]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await authService.getPendingAdmins(token);
      
      if (response.success) {
        setPendingRequests(response.requests);
      }
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error('Please provide username and password');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');
      console.log('📋 Approving request ID:', selectedRequest._id);
      console.log('👤 Credentials:', { username: credentials.username, password: '***' });
      
      const response = await authService.approveAdmin(
        selectedRequest._id,
        credentials,
        token
      );

      console.log('✅ Approve response:', response);

      if (response.success) {
        toast.success('Admin approved successfully!');
        setShowApproveModal(false);
        setCredentials({ username: '', password: '' });
        setSelectedRequest(null);
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('❌ Approve error:', error);
      toast.error(error.message || 'Failed to approve admin');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('Please provide rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await authService.rejectAdmin(
        selectedRequest._id,
        rejectionReason,
        token
      );

      if (response.success) {
        toast.success('Admin request rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedRequest(null);
        fetchPendingRequests();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject admin');
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/superadmin/login');
  };

  const renderPendingRequests = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading requests...</p>
        </div>
      );
    }

    if (pendingRequests.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Pending Requests</h3>
          <p>All admin requests have been processed</p>
        </div>
      );
    }

    return (
      <div className="requests-grid">
        {pendingRequests.map((request) => (
          <div key={request._id} className="request-card">
            <div className="request-header">
              <div className="request-flag">{getCountryFlag(request.country)}</div>
              <div className="request-info">
                <h3>{request.fullName}</h3>
                <p className="request-country">{request.country}</p>
              </div>
              <span className="status-badge pending">Pending</span>
            </div>

            <div className="request-details">
              <div className="detail-item">
                <span className="detail-label">📧 Email:</span>
                <span className="detail-value">{request.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📱 Phone:</span>
                <span className="detail-value">{request.phone}</span>
              </div>
              {request.nid && (
                <div className="detail-item">
                  <span className="detail-label">🆔 NID:</span>
                  <span className="detail-value">{request.nid}</span>
                </div>
              )}
              <div className="detail-item full-width">
                <span className="detail-label">💭 Reason:</span>
                <p className="detail-text">{request.reason}</p>
              </div>
              <div className="detail-item">
                <span className="detail-label">📅 Applied:</span>
                <span className="detail-value">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="request-actions">
              <button
                className="btn-approve"
                onClick={() => {
                  setSelectedRequest(request);
                  setShowApproveModal(true);
                }}
              >
                ✓ Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => {
                  setSelectedRequest(request);
                  setShowRejectModal(true);
                }}
              >
                ✗ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getCountryFlag = (country) => {
    const flags = {
      Bangladesh: '🇧🇩',
      Malaysia: '🇲🇾',
      India: '🇮🇳',
      Pakistan: '🇵🇰',
      Nepal: '🇳🇵'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="superadmin-dashboard">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="crown-badge">👑</div>
          <div>
            <h1>Super Admin Panel</h1>
            <p>Full System Control</p>
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
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Requests
          {pendingRequests.length > 0 && (
            <span className="badge">{pendingRequests.length}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          👥 Manage Admins
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👤 All Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          💰 Wallet Control
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'pending' && renderPendingRequests()}
        {activeTab === 'admins' && (
          <div className="coming-soon">
            <h2>👥 Manage Admins</h2>
            <p>Coming soon...</p>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="coming-soon">
            <h2>👤 All Users</h2>
            <p>Coming soon...</p>
          </div>
        )}
        {activeTab === 'wallet' && (
          <div className="coming-soon">
            <h2>💰 Wallet Control</h2>
            <p>Coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="coming-soon">
            <h2>⚙️ Settings</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✓ Approve Admin</h2>
            <p className="modal-subtitle">
              Create login credentials for <strong>{selectedRequest?.fullName}</strong>
            </p>

            <div className="modal-form">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="text"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>

              <div className="info-box">
                <p>📧 Credentials will be sent to: {selectedRequest?.email}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-confirm" onClick={handleApprove}>
                Approve & Create Account
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowApproveModal(false);
                  setCredentials({ username: '', password: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✗ Reject Admin Request</h2>
            <p className="modal-subtitle">
              Provide reason for rejecting <strong>{selectedRequest?.fullName}</strong>
            </p>

            <div className="modal-form">
              <div className="form-group">
                <label>Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this request is being rejected..."
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-confirm-reject" onClick={handleReject}>
                Reject Request
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
