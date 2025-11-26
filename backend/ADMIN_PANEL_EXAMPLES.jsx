// Admin Panel - User Management Example
// How to display timestamps and edit history

import React, { useEffect, useState } from 'react';

const UserDetailsAdmin = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    fetchUserDetails();
    fetchActivityLogs();
  }, [userId]);

  const fetchUserDetails = async () => {
    const response = await fetch(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setUser(data.user);
  };

  const fetchActivityLogs = async () => {
    const response = await fetch(`/api/admin/logs/target/User/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setActivityLogs(data.logs);
  };

  // Format timestamp to Bengali
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate time ago
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 60) return `${seconds} সেকেন্ড আগে`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} মিনিট আগে`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ঘন্টা আগে`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} দিন আগে`;
    return formatTimestamp(timestamp);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-details-admin">
      {/* User Basic Info */}
      <div className="user-info-card">
        <h2>{user.name}</h2>
        <p>ID: {user.idNumber}</p>
        <p>Role: {user.role}</p>
        
        {/* Timestamp Display */}
        <div className="timestamps">
          <div className="timestamp-item">
            <span className="label">📅 Account Created:</span>
            <span className="value">{formatTimestamp(user.createdAt)}</span>
            <span className="relative">{timeAgo(user.createdAt)}</span>
          </div>

          <div className="timestamp-item">
            <span className="label">🔄 Last Updated:</span>
            <span className="value">{formatTimestamp(user.updatedAt)}</span>
            <span className="relative">{timeAgo(user.updatedAt)}</span>
          </div>

          {user.lastLogin && (
            <div className="timestamp-item">
              <span className="label">🔐 Last Login:</span>
              <span className="value">{formatTimestamp(user.lastLogin)}</span>
              <span className="relative">{timeAgo(user.lastLogin)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Activity History */}
      <div className="activity-history">
        <h3>📜 Edit History & Activity Log</h3>
        
        {activityLogs.map((log, index) => (
          <div key={log._id} className="activity-item">
            <div className="activity-header">
              <img src={log.admin.profilePic} alt={log.admin.name} />
              <div className="activity-info">
                <strong>{log.admin.name}</strong>
                <span className="action-badge">{log.action}</span>
              </div>
              <div className="activity-time">
                {formatTimestamp(log.createdAt)}
                <br />
                <small>{timeAgo(log.createdAt)}</small>
              </div>
            </div>

            <div className="activity-description">
              {log.description}
            </div>

            {/* Show Changes */}
            {Object.keys(log.changes).length > 0 && (
              <div className="changes-details">
                <strong>Changes Made:</strong>
                {Object.entries(log.changes).map(([field, value]) => (
                  <div key={field} className="change-item">
                    <span className="field-name">{field}:</span>
                    
                    {/* Before Value */}
                    {log.oldValues?.[field] && (
                      <span className="old-value">
                        ❌ {JSON.stringify(log.oldValues[field])}
                      </span>
                    )}
                    
                    {/* Arrow */}
                    <span className="arrow">→</span>
                    
                    {/* After Value */}
                    {log.newValues?.[field] && (
                      <span className="new-value">
                        ✅ {JSON.stringify(log.newValues[field])}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* IP & Device Info */}
            <div className="activity-meta">
              <small>
                📍 IP: {log.ipAddress || 'N/A'} | 
                💻 Device: {log.userAgent || 'N/A'}
              </small>
            </div>
          </div>
        ))}

        {activityLogs.length === 0 && (
          <p className="no-activity">No activity logs found</p>
        )}
      </div>
    </div>
  );
};

// Admin Dashboard - Recent Activity
const AdminDashboard = () => {
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    const response = await fetch('/api/admin/activity/recent?limit=20', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setRecentActivity(data.activity);
  };

  return (
    <div className="admin-dashboard">
      <h2>Recent Admin Activity</h2>
      
      <div className="activity-feed">
        {recentActivity.map(log => (
          <div key={log._id} className="feed-item">
            <img src={log.admin.profilePic} alt={log.admin.name} />
            <div className="feed-content">
              <p>
                <strong>{log.admin.name}</strong> 
                {' '}<span className="action">{log.action}</span>{' '}
                {log.targetModel}
                {log.targetUser && (
                  <span> for <strong>{log.targetUser.name}</strong></span>
                )}
              </p>
              <small className="feed-time">
                {new Date(log.createdAt).toLocaleString('bn-BD')}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Transaction Admin - Approval History
const TransactionAdmin = ({ transactionId }) => {
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    const response = await fetch(`/api/wallet/transactions/${transactionId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setTransaction(data.transaction);
  };

  if (!transaction) return <div>Loading...</div>;

  return (
    <div className="transaction-admin">
      <h3>Transaction Details</h3>
      
      <div className="transaction-timeline">
        {/* Created */}
        <div className="timeline-item">
          <div className="timeline-badge">📝</div>
          <div className="timeline-content">
            <strong>Created</strong>
            <p>{new Date(transaction.createdAt).toLocaleString('bn-BD')}</p>
          </div>
        </div>

        {/* Processed */}
        {transaction.processedAt && (
          <div className="timeline-item">
            <div className="timeline-badge">⚙️</div>
            <div className="timeline-content">
              <strong>Processed by {transaction.processedBy?.name}</strong>
              <p>{new Date(transaction.processedAt).toLocaleString('bn-BD')}</p>
            </div>
          </div>
        )}

        {/* Approved */}
        {transaction.approvedAt && (
          <div className="timeline-item success">
            <div className="timeline-badge">✅</div>
            <div className="timeline-content">
              <strong>Approved by {transaction.approvedBy?.name}</strong>
              <p>{new Date(transaction.approvedAt).toLocaleString('bn-BD')}</p>
            </div>
          </div>
        )}

        {/* Rejected */}
        {transaction.rejectedAt && (
          <div className="timeline-item danger">
            <div className="timeline-badge">❌</div>
            <div className="timeline-content">
              <strong>Rejected by {transaction.rejectedBy?.name}</strong>
              <p>{new Date(transaction.rejectedAt).toLocaleString('bn-BD')}</p>
              <p className="rejection-reason">{transaction.rejectionReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
.timestamp-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.timestamp-item .label {
  font-weight: bold;
  min-width: 150px;
}

.timestamp-item .value {
  color: #333;
}

.timestamp-item .relative {
  color: #888;
  font-size: 0.9em;
  margin-left: auto;
}

.activity-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.action-badge {
  background: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
}

.changes-details {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.change-item {
  display: flex;
  gap: 10px;
  margin: 5px 0;
  align-items: center;
}

.old-value {
  color: #f44336;
  text-decoration: line-through;
}

.new-value {
  color: #4CAF50;
  font-weight: bold;
}

.timeline-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-left: 2px solid #e0e0e0;
  padding-left: 20px;
  position: relative;
}

.timeline-badge {
  position: absolute;
  left: -12px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-item.success .timeline-badge {
  border-color: #4CAF50;
}

.timeline-item.danger .timeline-badge {
  border-color: #f44336;
}
`;

export { UserDetailsAdmin, AdminDashboard, TransactionAdmin };
