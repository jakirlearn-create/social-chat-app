import React, { useState } from 'react';
import PostActions from './PostActions';
import CommentSection from './CommentSection';
import PostMedia from './PostMedia';
import './PostCard.css';

const PostCard = ({ post, isOwnPost, onDelete, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'public': return '🌍'; // তুমি icon replace করবে
      case 'friends': return '👥';
      case 'private': return '🔒';
      case 'custom': return '⚙️';
      default: return '🌍';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setIsDeleting(true);
      const postService = (await import('../services/postService')).default;
      await postService.deletePost(post._id);
      onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // TODO: Open edit modal
    alert('Edit functionality coming soon');
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-author">
          <img 
            src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${post.author?.name || 'User'}`}
            alt={post.author?.name}
            className="author-avatar"
          />
          <div className="author-info">
            <div className="author-name">{post.author?.name || 'Unknown User'}</div>
            <div className="post-meta">
              <span className="post-time">{formatTime(post.createdAt)}</span>
              <span className="privacy-indicator">{getPrivacyIcon(post.privacy)}</span>
              {post.editedAt && <span className="edited-badge">Edited</span>}
            </div>
          </div>
        </div>

        {isOwnPost && (
          <div className="post-menu">
            <button 
              className="menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleEdit} className="menu-item">
                  ✏️ Edit Post
                </button>
                <button 
                  onClick={handleDelete} 
                  className="menu-item danger"
                  disabled={isDeleting}
                >
                  🗑️ {isDeleting ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <PostMedia media={post.media} type={post.type} />
      )}

      {/* Live Badge */}
      {post.type === 'live' && post.liveStatus === 'live' && (
        <div className="live-badge">
          <span className="live-indicator"></span>
          <span>LIVE</span>
          {post.viewerCount > 0 && (
            <span className="viewer-count">👁 {post.viewerCount}</span>
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="post-stats">
        {post.reactionsCount > 0 && (
          <div className="reactions-summary">
            <span className="reaction-icons">❤️👍</span>
            <span className="count">{post.reactionsCount}</span>
          </div>
        )}
        
        <div className="stats-right">
          {post.commentsCount > 0 && (
            <span className="stat-item">{post.commentsCount} comment{post.commentsCount > 1 ? 's' : ''}</span>
          )}
          {post.sharesCount > 0 && (
            <span className="stat-item">{post.sharesCount} share{post.sharesCount > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <PostActions 
        post={post}
        onCommentClick={() => setShowComments(!showComments)}
      />

      {/* Comment Section */}
      {showComments && (
        <CommentSection postId={post._id} />
      )}
    </div>
  );
};

export default PostCard;
