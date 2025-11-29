import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import SettingsPanel from './SettingsPanel';
import './ProfilePage_new.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);
        console.log('User loaded:', currentUser);
        setEditData({
          name: currentUser.name || '',
          bio: currentUser.bio || '',
          profilePicture: currentUser.profilePicture || ''
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleCopyUserId = () => {
    if (user?.idNumber) {
      navigator.clipboard.writeText(user.idNumber);
      alert('User ID copied!');
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUploading(true);
      
      let profilePictureData = editData.profilePicture;
      
      // If user selected a new image, convert to base64
      if (selectedImage) {
        console.log('Converting image to base64...');
        const reader = new FileReader();
        profilePictureData = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImage);
        });
        console.log('Image converted, size:', profilePictureData.length);
      }
      
      const dataToUpdate = {
        ...editData,
        profilePicture: profilePictureData
      };
      
      console.log('Sending update to backend:', { ...dataToUpdate, profilePicture: profilePictureData ? `${profilePictureData.substring(0, 50)}...` : 'none' });
      
      const updated = await authService.updateProfile(dataToUpdate);
      console.log('Update response:', updated);
      
      setUser(updated);
      setEditData({
        name: updated.name || '',
        bio: updated.bio || '',
        profilePicture: updated.profilePicture || ''
      });
      
      // Dispatch custom event to update MessengerTaskbar
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: { user: updated } 
      }));
      
      setShowEditModal(false);
      setSelectedImage(null);
      setImagePreview(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getLevelBadge = (level) => {
    if (level >= 50) return { name: '💎 Diamond', color: '#B9F2FF' };
    if (level >= 30) return { name: '🥇 Gold', color: '#FFD700' };
    if (level >= 15) return { name: '🥈 Silver', color: '#C0C0C0' };
    return { name: '🥉 Bronze', color: '#CD7F32' };
  };

  if (loading) {
    return <div className="loading-new">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const badge = getLevelBadge(user.level || 1);
  const progressPercent = ((user.currentLevelProgress || 0) / (user.nextLevelCoins || 500)) * 100;

  return (
    <div className="profile-page-new">
      {/* Back Button */}
      <button className="profile-back-btn" onClick={() => navigate('/home')} title="Back to Home">
        ? Back
      </button>

      {/* Settings Button */}
      <button className="profile-settings-btn" onClick={() => setShowSettings(true)} title="Settings">
        ??
      </button>

      {/* Top Header Section */}
      <div className="profile-header-top">
        <div className="profile-avatar-large">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} />
          ) : (
            <div className="avatar-placeholder-large">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <h2 className="profile-name-bold">{user.name}</h2>
        
        <div className="user-id-container">
          <span className="user-id-grey">{user.idNumber}</span>
          <button className="copy-icon-btn" onClick={handleCopyUserId} title="Copy User ID">
            📋
          </button>
        </div>

        <button className="edit-icon-btn" onClick={handleEditProfile} title="Edit Profile">
          ✏️ Edit
        </button>

        {user.bio && <p className="user-bio">{user.bio}</p>}
      </div>

      {/* Wallet Card Section */}
      <div className="wallet-card-container">
        <div className="wallet-card-glass">
          <div className="wallet-middle">
            <h1 className="coins-balance-big">{user.coins || 0}</h1>
            <p className="coins-label-small">Available Coins</p>
          </div>
        </div>
      </div>

      {/* User Level Section */}
      <div className="level-section">
        <h3 className="level-title">User Level</h3>
        
        <div className="level-badge-container">
          <span className="level-badge" style={{ color: badge.color }}>
            {badge.name}
          </span>
          <span className="level-number">LV {user.level || 1}</span>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Next level at +{user.nextLevelCoins || 500} coins top-up
          </p>
          <p className="progress-current">
            Progress: {user.currentLevelProgress || 0} / {user.nextLevelCoins || 500} coins
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-btn-new" onClick={() => {
        authService.logout();
        navigate('/login');
      }}>
        Logout
      </button>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="edit-modal-overlay" onClick={handleCloseEdit}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            
            <div className="edit-form-group">
              <label>Profile Picture</label>
              
              <div className="image-upload-container">
                {(imagePreview || user.profilePicture) && (
                  <div className="current-image-preview">
                    <img 
                      src={imagePreview || user.profilePicture} 
                      alt="Preview" 
                    />
                  </div>
                )}
                
                <label htmlFor="image-upload" className="upload-btn">
                  📷 Choose Photo from Device
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                
                {selectedImage && (
                  <p className="selected-file-name">
                    ✅ Selected: {selectedImage.name}
                  </p>
                )}
              </div>
              
              <small>📱 Select photo from gallery or camera (Max 5MB)</small>
            </div>

            <div className="edit-form-group">
              <label>Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Enter your name"
              />
              <small>⚠️ Can change twice every 3 months</small>
            </div>

            <div className="edit-form-group">
              <label>Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Write about yourself..."
                rows="4"
              />
              <small>✅ Unlimited changes allowed</small>
            </div>

            <div className="edit-modal-buttons">
              <button className="btn-cancel" onClick={handleCloseEdit} disabled={uploading}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveProfile} disabled={uploading}>
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default ProfilePage;
