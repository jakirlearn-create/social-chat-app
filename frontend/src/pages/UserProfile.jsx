import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import searchService from '../services/searchService';
import ProfileFeed from '../components/ProfileFeed';
import '../styles/UserProfile.css';

/**
 * UserProfile Page - Read-only profile view for visitors
 */
const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await searchService.getUserProfile(userId);
      
      if (data.success) {
        setProfile(data.user);
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Profile load error:', err);
      setError(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <span className="error-icon">⚠️</span>
          <h2>Profile Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const {
    name,
    idNumber,
    profilePicture,
    bio,
    country,
    gender,
    followersCount,
    followingCount,
    postsCount,
    isOwner,
    isFollowing,
    level,
    earnings
  } = profile;

  // Fallback profile photo
  const defaultPhoto = 'https://via.placeholder.com/150/667eea/ffffff?text=' + (name?.[0] || 'U');

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={() => navigate(-1)} className="btn-back-header">
          ← Back
        </button>
        <h1>User Profile</h1>
      </div>

      <div className="profile-card">
        {/* Cover Section */}
        <div className="profile-cover">
          <div className="cover-gradient"></div>
        </div>

        {/* Profile Info Section */}
        <div className="profile-info-section">
          <div className="profile-photo-wrapper">
            <img 
              src={profilePicture || defaultPhoto} 
              alt={name}
              className="profile-photo-large"
              onError={(e) => {
                e.target.src = defaultPhoto;
              }}
            />
            {level && (
              <div className="profile-level-badge">
                Level {level}
              </div>
            )}
          </div>

          <div className="profile-details">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-id">ID: {idNumber}</p>
            
            {bio && (
              <p className="profile-bio">{bio}</p>
            )}

            {country && (
              <div className="profile-meta">
                <span className="meta-item">
                  <span className="meta-icon">🌍</span>
                  {country}
                </span>
                {gender && (
                  <span className="meta-item">
                    <span className="meta-icon">
                      {gender === 'male' ? '👨' : gender === 'female' ? '👩' : '🧑'}
                    </span>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{postsCount || 0}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{followersCount || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{followingCount || 0}</span>
                <span className="stat-label">Following</span>
              </div>
              {earnings && (
                <div className="stat-item">
                  <span className="stat-number">{earnings.coins || 0}</span>
                  <span className="stat-label">Coins</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {!isOwner && (
                <>
                  <button className={`btn-follow ${isFollowing ? 'following' : ''}`}>
                    {isFollowing ? '✓ Following' : '+ Follow'}
                  </button>
                  <button className="btn-message">
                    💬 Message
                  </button>
                </>
              )}
              
              {isOwner && (
                <div className="owner-notice">
                  <span className="notice-icon">👤</span>
                  <p>This is your profile</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Viewer Notice */}
        {!isOwner && (
          <div className="viewer-notice">
            <span className="notice-icon">👁️</span>
            <p>You are viewing {name}'s profile (Read-only mode)</p>
          </div>
        )}

        {/* Posts Feed Section */}
        <div className="profile-posts-section">
          <h3 className="section-title">Posts</h3>
          <ProfileFeed userId={userId} isOwnProfile={isOwner} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
