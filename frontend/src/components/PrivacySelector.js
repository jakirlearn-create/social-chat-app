import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './PrivacySelector.css';

const PrivacySelector = ({ isOpen, onClose, onSelect }) => {
  const { theme } = useTheme();
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
  const [showCustomUsers, setShowCustomUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock users list - replace with actual user fetch
  const [allUsers] = useState([
    { id: 1, name: 'John Doe', username: '@john', avatar: null },
    { id: 2, name: 'Sarah Khan', username: '@sarah', avatar: null },
    { id: 3, name: 'Mike Ross', username: '@mike', avatar: null },
    { id: 4, name: 'Emily Chen', username: '@emily', avatar: null },
    { id: 5, name: 'David Lee', username: '@david', avatar: null },
  ]);

  // Filter users based on search
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle privacy option selection
  const handlePrivacyChange = (option) => {
    setSelectedPrivacy(option);
    if (option === 'custom') {
      setShowCustomUsers(true);
    } else {
      setShowCustomUsers(false);
      setSelectedUsers([]);
    }
  };

  // Toggle user selection for custom privacy
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle confirm button
  const handleConfirm = () => {
    if (selectedPrivacy === 'custom' && selectedUsers.length === 0) {
      alert('অনুগ্রহ করে কমপক্ষে একজন ইউজার সিলেক্ট করুন।');
      return;
    }
    onSelect({
      type: selectedPrivacy,
      users: selectedPrivacy === 'custom' ? selectedUsers : []
    });
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`privacy-selector-overlay ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="privacy-selector-modal">
        {/* Header */}
        <div className="privacy-header">
          <h2>পোস্ট প্রাইভেসি সিলেক্ট করুন</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Privacy Options */}
        <div className="privacy-options">
          {/* Public Option */}
          <div
            className={`privacy-option ${selectedPrivacy === 'public' ? 'selected' : ''}`}
            onClick={() => handlePrivacyChange('public')}
          >
            <div className="option-icon">🌍</div>
            <div className="option-details">
              <h3>Public</h3>
              <p>সবার জন্য দৃশ্যমান - Explore-এ দেখাবে</p>
            </div>
            <div className="option-radio">
              {selectedPrivacy === 'public' && <div className="radio-dot" />}
            </div>
          </div>

          {/* Private Option */}
          <div
            className={`privacy-option ${selectedPrivacy === 'private' ? 'selected' : ''}`}
            onClick={() => handlePrivacyChange('private')}
          >
            <div className="option-icon">🔒</div>
            <div className="option-details">
              <h3>Private</h3>
              <p>শুধু আপনি দেখতে পারবেন - কারো টাইমলাইনে নেই</p>
            </div>
            <div className="option-radio">
              {selectedPrivacy === 'private' && <div className="radio-dot" />}
            </div>
          </div>

          {/* Custom Option */}
          <div
            className={`privacy-option ${selectedPrivacy === 'custom' ? 'selected' : ''}`}
            onClick={() => handlePrivacyChange('custom')}
          >
            <div className="option-icon">👥</div>
            <div className="option-details">
              <h3>Custom</h3>
              <p>নির্দিষ্ট ইউজার সিলেক্ট করুন</p>
              {selectedUsers.length > 0 && (
                <span className="selected-count">
                  {selectedUsers.length} জন সিলেক্ট করা হয়েছে
                </span>
              )}
            </div>
            <div className="option-radio">
              {selectedPrivacy === 'custom' && <div className="radio-dot" />}
            </div>
          </div>
        </div>

        {/* Custom Users Selection */}
        {showCustomUsers && (
          <div className="custom-users-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="ইউজার খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="users-list">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-username">{user.username}</div>
                  </div>
                  <div className="user-checkbox">
                    {selectedUsers.includes(user.id) && <span>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="privacy-actions">
          <button className="cancel-btn" onClick={onClose}>
            বাতিল
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            নিশ্চিত করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySelector;
