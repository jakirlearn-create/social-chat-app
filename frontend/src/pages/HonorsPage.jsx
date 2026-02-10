import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaCrown, 
  FaFire, 
  FaHeart,
  FaComments,
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa';
import './HonorsPage.css';

function HonorsPage() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [honors, setHonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHonors();
  }, []);

  const loadHonors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      // Get current user data
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (userResponse.data.success && userResponse.data.user) {
        const user = userResponse.data.user;
        
        // Get profile stats
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile/${user._id}/stats`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUserStats({
          level: user.level || 1,
          coins: user.earnings?.coins || 0,
          totalEarned: user.earnings?.totalEarned || 0,
          followers: user.followers?.length || 0,
          posts: statsResponse.data?.postsCount || 0,
          reactions: statsResponse.data?.reactionsCount || 0
        });

        // Generate honors based on achievements
        const generatedHonors = generateHonors({
          level: user.level || 1,
          coins: user.earnings?.coins || 0,
          followers: user.followers?.length || 0,
          posts: statsResponse.data?.postsCount || 0,
          reactions: statsResponse.data?.reactionsCount || 0
        });

        setHonors(generatedHonors);
      }
    } catch (error) {
      console.error('Error loading honors:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load honors');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateHonors = (stats) => {
    const allHonors = [
      {
        id: 'newcomer',
        icon: <FaStar />,
        name: 'Newcomer',
        description: 'Join the community',
        requirement: 'Create an account',
        earned: true,
        progress: 100,
        color: '#FFD700'
      },
      {
        id: 'first-post',
        icon: <FaCheckCircle />,
        name: 'First Post',
        description: 'Share your first post',
        requirement: 'Create 1 post',
        earned: stats.posts >= 1,
        progress: Math.min(100, (stats.posts / 1) * 100),
        color: '#4CAF50'
      },
      {
        id: 'content-creator',
        icon: <FaTrophy />,
        name: 'Content Creator',
        description: 'Active content creator',
        requirement: 'Create 10 posts',
        earned: stats.posts >= 10,
        progress: Math.min(100, (stats.posts / 10) * 100),
        color: '#FF9800'
      },
      {
        id: 'popular',
        icon: <FaUsers />,
        name: 'Popular',
        description: 'Build your audience',
        requirement: 'Get 50 followers',
        earned: stats.followers >= 50,
        progress: Math.min(100, (stats.followers / 50) * 100),
        color: '#E91E63'
      },
      {
        id: 'influencer',
        icon: <FaCrown />,
        name: 'Influencer',
        description: 'Become an influencer',
        requirement: 'Get 100 followers',
        earned: stats.followers >= 100,
        progress: Math.min(100, (stats.followers / 100) * 100),
        color: '#9C27B0'
      },
      {
        id: 'loved',
        icon: <FaHeart />,
        name: 'Loved',
        description: 'Get reactions on your posts',
        requirement: 'Receive 100 reactions',
        earned: stats.reactions >= 100,
        progress: Math.min(100, (stats.reactions / 100) * 100),
        color: '#F44336'
      },
      {
        id: 'trending',
        icon: <FaFire />,
        name: 'Trending',
        description: 'Create trending content',
        requirement: 'Receive 500 reactions',
        earned: stats.reactions >= 500,
        progress: Math.min(100, (stats.reactions / 500) * 100),
        color: '#FF5722'
      },
      {
        id: 'wealthy',
        icon: <FaMedal />,
        name: 'Wealthy',
        description: 'Accumulate coins',
        requirement: 'Earn 10,000 coins',
        earned: stats.coins >= 10000,
        progress: Math.min(100, (stats.coins / 10000) * 100),
        color: '#FFD700'
      }
    ];

    return allHonors;
  };

  const earnedHonors = honors.filter(h => h.earned);
  const upcomingHonors = honors.filter(h => !h.earned);

  return (
    <div className="honors-page">
      <div className="honors-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h1>Honors & Achievements</h1>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading honors...</p>
        </div>
      ) : (
        <>
          {userStats && (
            <div className="stats-overview">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{earnedHonors.length}/{honors.length}</div>
                <div className="stat-label">Honors Earned</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">Level {userStats.level}</div>
                <div className="stat-label">Current Level</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">{userStats.coins.toLocaleString()}</div>
                <div className="stat-label">Coins</div>
              </div>
            </div>
          )}

          <div className="honors-section">
            <h2>Earned Badges ({earnedHonors.length})</h2>
            {earnedHonors.length === 0 ? (
              <div className="empty-honors">
                <p>🏅 No badges earned yet. Keep creating content!</p>
              </div>
            ) : (
              <div className="honors-grid">
                {earnedHonors.map(honor => (
                  <div key={honor.id} className="honor-card earned">
                    <div className="honor-icon" style={{ color: honor.color }}>
                      {honor.icon}
                    </div>
                    <h3>{honor.name}</h3>
                    <p className="honor-description">{honor.description}</p>
                    <div className="honor-badge">✓ EARNED</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="honors-section">
            <h2>Upcoming Badges ({upcomingHonors.length})</h2>
            {upcomingHonors.length === 0 ? (
              <div className="empty-honors">
                <p>🎉 You've earned all available badges!</p>
              </div>
            ) : (
              <div className="honors-grid">
                {upcomingHonors.map(honor => (
                  <div key={honor.id} className="honor-card locked">
                    <div className="honor-icon locked-icon" style={{ color: '#999' }}>
                      {honor.icon}
                    </div>
                    <h3>{honor.name}</h3>
                    <p className="honor-description">{honor.description}</p>
                    <div className="honor-requirement">
                      <div className="requirement-text">{honor.requirement}</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${honor.progress}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">{Math.round(honor.progress)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HonorsPage;
