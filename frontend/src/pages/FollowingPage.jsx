import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './FollowingPage.css';

function FollowingPage() {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unfollowing, setUnfollowing] = useState(null);

  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      // Get current user profile to fetch following
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        setFollowing(user.following || []);
      }
    } catch (error) {
      console.error('Error loading following:', error);
      toast.error('Failed to load following');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setUnfollowing(userId);
      const token = localStorage.getItem('token');

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/following/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFollowing(following.filter(u => u._id !== userId));
      toast.success('Unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing:', error);
      toast.error(error.response?.data?.message || 'Failed to unfollow');
    } finally {
      setUnfollowing(null);
    }
  };

  const filteredFollowing = following.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.idNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="following-page">
      <div className="following-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          ← Back
        </button>
        <h1>Following ({following.length})</h1>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search following..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="following-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading following...</p>
          </div>
        ) : filteredFollowing.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">👥</p>
            <h3>{searchQuery ? 'No users found' : 'Not following anyone yet'}</h3>
            <p className="empty-text">
              {searchQuery ? 'Try a different search term' : 'Start following people to see them here'}
            </p>
          </div>
        ) : (
          filteredFollowing.map(user => (
            <div key={user._id} className="following-card">
              <div className="following-info" onClick={() => navigate(`/user/${user._id}`)}>
                <img
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff`}
                  alt={user.name}
                  className="following-avatar"
                />
                <div className="following-details">
                  <h3>{user.name}</h3>
                  <p className="following-id">@{user.idNumber}</p>
                  {user.bio && <p className="following-bio">{user.bio}</p>}
                </div>
              </div>
              <button
                className="unfollow-btn"
                onClick={() => handleUnfollow(user._id)}
                disabled={unfollowing === user._id}
              >
                {unfollowing === user._id ? 'Unfollowing...' : 'Unfollow'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FollowingPage;
