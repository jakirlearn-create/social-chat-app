import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaImage, 
  FaVideo, 
  FaBookmark, 
  FaTag, 
  FaNewspaper,
  FaHeart 
} from 'react-icons/fa';
import './ProfileMenuPage.css';

function ProfileMenuPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    posts: 0,
    photos: 0,
    videos: 0,
    saved: 0,
    tagged: 0,
    liked: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      // Get current user ID
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (userResponse.data.success && userResponse.data.user) {
        const userId = userResponse.data.user._id;
        
        // Fetch profile stats
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile/${userId}/stats`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (statsResponse.data) {
          setStats({
            posts: statsResponse.data.postsCount || 0,
            photos: 0, // TODO: Implement photo count
            videos: 0, // TODO: Implement video count
            saved: 0, // TODO: Implement saved posts
            tagged: 0, // TODO: Implement tagged posts
            liked: statsResponse.data.reactionsCount || 0
          });
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load stats');
      }
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: 'posts',
      icon: <FaNewspaper />,
      label: 'Posts',
      count: stats.posts,
      onClick: () => navigate('/profile')
    },
    {
      id: 'photos',
      icon: <FaImage />,
      label: 'Photos',
      count: stats.photos,
      onClick: () => toast.info('Photos feature coming soon')
    },
    {
      id: 'videos',
      icon: <FaVideo />,
      label: 'Videos',
      count: stats.videos,
      onClick: () => toast.info('Videos feature coming soon')
    },
    {
      id: 'saved',
      icon: <FaBookmark />,
      label: 'Saved',
      count: stats.saved,
      onClick: () => toast.info('Saved posts feature coming soon')
    },
    {
      id: 'tagged',
      icon: <FaTag />,
      label: 'Tagged',
      count: stats.tagged,
      onClick: () => toast.info('Tagged posts feature coming soon')
    },
    {
      id: 'liked',
      icon: <FaHeart />,
      label: 'Liked',
      count: stats.liked,
      onClick: () => toast.info('Liked posts feature coming soon')
    }
  ];

  return (
    <div className="profile-menu-page">
      <div className="profile-menu-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          ← Back to Profile
        </button>
        <h1>Profile Sections</h1>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="menu-grid">
          {menuItems.map(item => (
            <div 
              key={item.id} 
              className="menu-item"
              onClick={item.onClick}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-label">{item.label}</div>
              <div className="menu-count">{item.count}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileMenuPage;
