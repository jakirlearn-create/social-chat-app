import React, { useState, useEffect } from 'react';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const postService = (await import('../services/postService')).default;
      const data = await postService.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const postService = (await import('../services/postService')).default;
      
      const commentData = {
        content: newComment.trim(),
        parentComment: replyTo?._id || null
      };

      const createdComment = await postService.addComment(postId, commentData);
      
      // Add comment to list
      if (replyTo) {
        // Add as reply
        setComments(prev => prev.map(c => 
          c._id === replyTo._id 
            ? { ...c, replies: [...(c.replies || []), createdComment] }
            : c
        ));
      } else {
        // Add as top-level comment
        setComments(prev => [createdComment, ...prev]);
      }

      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setNewComment(`@${comment.user.name} `);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="comment-section">
        <div className="comments-loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="comment-section">
      {/* Comment Input */}
      <form className="comment-input-form" onSubmit={handleSubmitComment}>
        {replyTo && (
          <div className="reply-indicator">
            Replying to <strong>{replyTo.user.name}</strong>
            <button type="button" onClick={cancelReply} className="cancel-reply">✕</button>
          </div>
        )}
        
        <div className="comment-input-wrapper">
          <img 
            src={`https://ui-avatars.com/api/?name=You`}
            alt="Your avatar"
            className="comment-avatar"
          />
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <button 
            type="submit" 
            className="submit-comment-btn"
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? '...' : '➤'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, onReply, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className={`comment-item ${isReply ? 'reply' : ''}`}>
      <img 
        src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${comment.user?.name || 'User'}`}
        alt={comment.user?.name}
        className="comment-avatar"
      />
      
      <div className="comment-body">
        <div className="comment-bubble">
          <div className="comment-author">{comment.user?.name || 'Unknown User'}</div>
          <div className="comment-content">{comment.content}</div>
        </div>
        
        <div className="comment-actions">
          <span className="comment-time">{formatTime(comment.createdAt)}</span>
          {!isReply && (
            <button 
              className="comment-action-btn"
              onClick={() => onReply(comment)}
            >
              Reply
            </button>
          )}
          <button className="comment-action-btn">Like</button>
          {comment.likesCount > 0 && (
            <span className="like-count">❤️ {comment.likesCount}</span>
          )}
        </div>

        {/* Replies */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div className="replies-section">
            {!showReplies ? (
              <button 
                className="show-replies-btn"
                onClick={() => setShowReplies(true)}
              >
                ↩️ {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            ) : (
              <>
                <button 
                  className="hide-replies-btn"
                  onClick={() => setShowReplies(false)}
                >
                  Hide replies
                </button>
                <div className="replies-list">
                  {comment.replies.map(reply => (
                    <CommentItem 
                      key={reply._id} 
                      comment={reply}
                      onReply={onReply}
                      isReply={true}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
