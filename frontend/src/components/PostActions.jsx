import React, { useState, useEffect } from 'react';
import './PostActions.css';

const PostActions = ({ post, onCommentClick }) => {
  const [userReaction, setUserReaction] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [localReactionsCount, setLocalReactionsCount] = useState(post.reactionsCount || 0);

  const reactions = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'haha', emoji: '😂', label: 'Haha' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'angry', emoji: '😡', label: 'Angry' }
  ];

  useEffect(() => {
    // Check if user has reacted to this post
    const checkUserReaction = async () => {
      try {
        const postService = (await import('../services/postService')).default;
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Get reactions to check user's reaction
        const reactionsData = await postService.getReactions(post._id);
        const myReaction = reactionsData.find(r => r.user._id === userId);
        if (myReaction) {
          setUserReaction(myReaction.type);
        }
      } catch (error) {
        console.error('Error checking user reaction:', error);
      }
    };

    checkUserReaction();
  }, [post._id]);

  const handleReaction = async (reactionType) => {
    try {
      const postService = (await import('../services/postService')).default;
      
      // Optimistic update
      const wasReacted = userReaction === reactionType;
      const oldReaction = userReaction;
      
      if (wasReacted) {
        setUserReaction(null);
        setLocalReactionsCount(prev => Math.max(0, prev - 1));
      } else {
        setUserReaction(reactionType);
        setLocalReactionsCount(prev => oldReaction ? prev : prev + 1);
      }
      
      setShowReactionPicker(false);

      // API call
      await postService.toggleReaction(post._id, reactionType);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Revert on error
      setUserReaction(userReaction);
      setLocalReactionsCount(post.reactionsCount);
    }
  };

  const handleShare = async () => {
    try {
      const postService = (await import('../services/postService')).default;
      await postService.sharePost(post._id, {
        shareType: 'timeline',
        caption: ''
      });
      alert('Post shared successfully!');
    } catch (error) {
      console.error('Error sharing post:', error);
      alert('Failed to share post');
    }
  };

  const getReactionDisplay = () => {
    if (!userReaction) return { emoji: '👍', label: 'Like' };
    const reaction = reactions.find(r => r.type === userReaction);
    return reaction || { emoji: '👍', label: 'Like' };
  };

  const reactionDisplay = getReactionDisplay();

  return (
    <div className="post-actions">
      <div className="actions-row">
        {/* Like Button with Reaction Picker */}
        <div 
          className="action-btn-wrapper"
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
        >
          {showReactionPicker && (
            <div className="reaction-picker">
              {reactions.map(reaction => (
                <button
                  key={reaction.type}
                  className="reaction-item"
                  onClick={() => handleReaction(reaction.type)}
                  title={reaction.label}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
          
          <button 
            className={`action-btn ${userReaction ? 'active' : ''}`}
            onClick={() => handleReaction(userReaction || 'like')}
          >
            <span className="action-icon">{reactionDisplay.emoji}</span>
            <span className="action-label">{reactionDisplay.label}</span>
          </button>
        </div>

        {/* Comment Button */}
        <button 
          className="action-btn"
          onClick={onCommentClick}
        >
          <span className="action-icon">💬</span>
          <span className="action-label">Comment</span>
        </button>

        {/* Share Button */}
        <button 
          className="action-btn"
          onClick={handleShare}
        >
          <span className="action-icon">🔄</span>
          <span className="action-label">Share</span>
        </button>

        {/* Save Button */}
        <button 
          className="action-btn"
          onClick={() => alert('Save feature coming soon')}
        >
          <span className="action-icon">🔖</span>
          <span className="action-label">Save</span>
        </button>
      </div>
    </div>
  );
};

export default PostActions;
