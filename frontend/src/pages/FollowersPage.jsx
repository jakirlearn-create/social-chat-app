import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './FollowersPage.css';

function FollowersPage() {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    loadFollowers();
  }, []);

  const loadFollowers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      // Get current user profile to fetch followers
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        setFollowers(user.followers || []);
      }
    } catch (error) {
      console.error('Error loading followers:', error);
      toast.error('Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      setRemoving(followerId);
      const token = localStorage.getItem('token');

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/followers/${followerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFollowers(followers.filter(f => f._id !== followerId));
      toast.success('Follower removed');
    } catch (error) {
      console.error('Error removing follower:', error);
      toast.error(error.response?.data?.message || 'Failed to remove follower');
    } finally {
      setRemoving(null);
    }
  };

  const filteredFollowers = followers.filter(follower =>
    follower.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    follower.idNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="followers-page">
      <div className="followers-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          ← Back
        </button>
        <h1>Followers ({followers.length})</h1>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search followers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="followers-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading followers...</p>
          </div>
        ) : filteredFollowers.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">👥</p>
            <h3>{searchQuery ? 'No followers found' : 'No followers yet'}</h3>
            <p className="empty-text">
              {searchQuery ? 'Try a different search term' : 'People who follow you will appear here'}
            </p>
          </div>
        ) : (
          filteredFollowers.map(follower => (
            <div key={follower._id} className="follower-card">
              <div className="follower-info" onClick={() => navigate(`/user/${follower._id}`)}>
                <img
                  src={follower.profilePicture || `https://ui-avatars.com/api/?name=${follower.name}&background=667eea&color=fff`}
                  alt={follower.name}
                  className="follower-avatar"
                />
                <div className="follower-details">
                  <h3>{follower.name}</h3>
                  <p className="follower-id">@{follower.idNumber}</p>
                  {follower.bio && <p className="follower-bio">{follower.bio}</p>}
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFollower(follower._id)}
                disabled={removing === follower._id}
              >
                {removing === follower._id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FollowersPage;
