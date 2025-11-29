import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSettingsPage.css';
import authService from '../services/authService';
import uploadService from '../services/uploadService';
import { toast } from 'react-hot-toast';

function ProfileSettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const current = await authService.getCurrentUser();
      if (current) {
        setUser(current);
        setProfilePic(current.profilePic || '');
        setName(current.name || '');
        setBio(current.bio || '');
        setPreviewImage(current.profilePic || '');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const url = await uploadService.uploadImage(file);
      setProfilePic(url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setSaving(true);
      const updatedData = {
        ...user,
        profilePic,
        name: name.trim(),
        bio: bio.trim()
      };

      const result = await authService.updateProfile(updatedData);
      setUser(result);
      toast.success('Profile updated successfully!');
      
      // Navigate back after 1 second
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-settings-page">
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-settings-page">
      {/* Header */}
      <div className="settings-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Profile Settings</h2>
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={saving || uploading}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Content */}
      <div className="settings-content">
        {/* Profile Photo Section */}
        <div className="setting-section">
          <h3 className="section-title">Profile Photo</h3>
          <div className="photo-section">
            <div className="photo-preview">
              {previewImage ? (
                <img src={previewImage} alt="Profile" />
              ) : (
                <div className="photo-placeholder">
                  <span>No Photo</span>
                </div>
              )}
              {uploading && (
                <div className="upload-overlay">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            <div className="photo-actions">
              <button 
                className="btn-change-photo"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                📷 Change Photo
              </button>
              <p className="photo-hint">JPG, PNG or GIF. Max size 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Username Section */}
        <div className="setting-section">
          <h3 className="section-title">Username</h3>
          <input
            type="text"
            className="input-field"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
          <p className="field-hint">{name.length}/50 characters</p>
        </div>

        {/* Bio Section */}
        <div className="setting-section">
          <h3 className="section-title">Bio</h3>
          <textarea
            className="textarea-field"
            placeholder="Write a short bio about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            rows={4}
          />
          <p className="field-hint">{bio.length}/200 characters</p>
        </div>

        {/* User ID (Read-only) */}
        <div className="setting-section">
          <h3 className="section-title">User ID</h3>
          <div className="readonly-field">
            <span className="field-label">@{user?.idNumber}</span>
            <span className="field-badge">Read-only</span>
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="mobile-save-btn">
          <button 
            className="btn-save-full"
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsPage;
