import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import './PostsPage.css';

const PostsPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  // Scroll করলে header hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling up - hide header
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling down - show header
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Mock data - আসল implementation এ backend থেকে fetch করবেন
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          user: {
            name: 'John Doe',
            username: '@john',
            avatar: null
          },
          timestamp: '2 hours ago',
          contentType: 'text',
          content: 'Hello everyone! This is my first post 🎉',
          likes: 245,
          comments: 12,
          shares: 5,
          isLiked: false,
          isSaved: false
        },
        {
          id: 2,
          user: {
            name: 'Sarah Khan',
            username: '@sarah',
            avatar: null
          },
          timestamp: '5 hours ago',
          contentType: 'image',
          content: 'Beautiful sunset today! 🌅',
          media: ['/assets/posts/sample1.jpg'],
          likes: 1024,
          comments: 45,
          shares: 89,
          isLiked: true,
          isSaved: false
        },
        {
          id: 3,
          user: {
            name: 'Mike Ross',
            username: '@mike',
            avatar: null
          },
          timestamp: '1 day ago',
          contentType: 'video',
          content: 'Check out my new video! 🎬',
          media: ['/assets/posts/sample-video.mp4'],
          likes: 2340,
          comments: 156,
          shares: 234,
          isLiked: false,
          isSaved: true
        },
        {
          id: 4,
          user: {
            name: 'Emily Chen',
            username: '@emily',
            avatar: null
          },
          timestamp: '3 hours ago',
          contentType: 'multi-image',
          content: 'Trip memories 📸✨',
          media: [
            '/assets/posts/img1.jpg',
            '/assets/posts/img2.jpg',
            '/assets/posts/img3.jpg'
          ],
          likes: 567,
          comments: 34,
          shares: 12,
          isLiked: false,
          isSaved: false
        },
        {
          id: 5,
          user: {
            name: 'David Lee',
            username: '@david',
            avatar: null
          },
          timestamp: '6 hours ago',
          contentType: 'audio',
          content: 'New podcast episode! 🎙️',
          media: ['/assets/posts/audio.mp3'],
          likes: 189,
          comments: 23,
          shares: 45,
          isLiked: true,
          isSaved: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Reactions
  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleComment = (postId) => {
    setSelectedPost(postId);
    setShowComments(true);
  };

  const handleShare = (postId) => {
    // Share functionality
    console.log('Share post:', postId);
  };

  const handleInterest = (postId, interested) => {
    console.log(`${interested ? 'Interested' : 'Not interested'} in post:`, postId);
  };

  const handleMenuAction = (postId, action) => {
    console.log(`Action: ${action} on post:`, postId);
    setShowMenu(null);
  };

  // Render user avatar
  const renderAvatar = (user) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} className="post-avatar" />;
    }
    return (
      <div className="post-avatar placeholder">
        {user.name.charAt(0)}
      </div>
    );
  };

  // Render content based on type
  const renderContent = (post) => {
    switch (post.contentType) {
      case 'text':
        return <p className="post-text">{post.content}</p>;

      case 'image':
        return (
          <>
            <p className="post-text">{post.content}</p>
            <div className="post-media single-image">
              <img src={post.media[0]} alt="Post" onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23667eea" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20">Image</text></svg>'} />
            </div>
          </>
        );

      case 'multi-image':
        return (
          <>
            <p className="post-text">{post.content}</p>
            <div className="post-media carousel">
              {post.media.map((img, idx) => (
                <img key={idx} src={img} alt={`Slide ${idx + 1}`} onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23667eea" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20">Image ' + (idx+1) + '</text></svg>'} />
              ))}
            </div>
          </>
        );

      case 'video':
        return (
          <>
            <p className="post-text">{post.content}</p>
            <div className="post-media video">
              <video controls>
                <source src={post.media[0]} type="video/mp4" />
                Your browser does not support video.
              </video>
            </div>
          </>
        );

      case 'audio':
        return (
          <>
            <p className="post-text">{post.content}</p>
            <div className="post-media audio">
              <audio controls>
                <source src={post.media[0]} type="audio/mpeg" />
                Your browser does not support audio.
              </audio>
            </div>
          </>
        );

      default:
        return <p className="post-text">{post.content}</p>;
    }
  };

  if (loading) {
    return (
      <div className={`posts-page ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        <div className="loading-spinner">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className={`posts-page ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      {/* Header - Hide on scroll up */}
      <div className={`posts-header ${!showHeader ? 'hidden' : ''}`}>
        <button className="posts-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="posts-title">Posts</h1>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {/* User Info */}
            <div className="post-header">
              <div className="post-user-info">
                {renderAvatar(post.user)}
                <div className="post-user-details">
                  <h3 className="post-username">{post.user.name}</h3>
                  <span className="post-handle">{post.user.username}</span>
                  <span className="post-timestamp"> · {post.timestamp}</span>
                </div>
              </div>

              {/* 3-dot Menu */}
              <button 
                className="post-menu-btn"
                onClick={() => setShowMenu(showMenu === post.id ? null : post.id)}
              >
                ⋮
              </button>

              {showMenu === post.id && (
                <div className="post-menu-dropdown">
                  <button onClick={() => handleMenuAction(post.id, 'report')}>
                    🚩 Report
                  </button>
                  <button onClick={() => handleMenuAction(post.id, 'hide')}>
                    👁️ {t('common.back')}</button>
                  <button onClick={() => handleMenuAction(post.id, 'block')}>
                    🚫 {t('posts.block')}
                  </button>
                  <button onClick={() => handleMenuAction(post.id, 'copy')}>
                    🔗 {t('posts.copyLink')}
                  </button>
                  <button onClick={() => handleMenuAction(post.id, 'mute')}>
                    🔕 {t('posts.mute')}
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="post-content">
              {renderContent(post)}
            </div>

            {/* Reaction Row */}
            <div className="post-reactions">
              <button 
                className={`reaction-btn ${post.isLiked ? 'active' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <span className="reaction-icon">{post.isLiked ? '❤️' : '🤍'}</span>
                <span className="reaction-count">{post.likes}</span>
              </button>

              <button 
                className="reaction-btn"
                onClick={() => handleComment(post.id)}
              >
                <span className="reaction-icon">💬</span>
                <span className="reaction-count">{post.comments}</span>
              </button>

              <button 
                className="reaction-btn"
                onClick={() => handleShare(post.id)}
              >
                <span className="reaction-icon">↗️</span>
                <span className="reaction-count">{post.shares}</span>
              </button>

              <button 
                className={`reaction-btn ${post.isSaved ? 'active' : ''}`}
                onClick={() => handleSave(post.id)}
              >
                <span className="reaction-icon">{post.isSaved ? '🔖' : '📑'}</span>
              </button>

              <button 
                className="reaction-btn"
                onClick={() => handleInterest(post.id, true)}
              >
                <span className="reaction-icon">👍</span>
              </button>

              <button 
                className="reaction-btn"
                onClick={() => handleInterest(post.id, false)}
              >
                <span className="reaction-icon">👎</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="comments-modal">
          <div className="comments-container">
            <div className="comments-header">
              <h2>{t('posts.comments')}</h2>
              <button onClick={() => setShowComments(false)}>✕</button>
            </div>
            <div className="comments-list">
              <p className="no-comments">{t('posts.noComments')}</p>
            </div>
            <div className="comment-input-container">
              <input
                type="text"
                placeholder={t('posts.writeComment')}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="send-comment-btn">{t('common.send')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
