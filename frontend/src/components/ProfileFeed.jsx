import React, { useState, useEffect, useRef, useCallback } from 'react';
import postService from '../services/postService';
import PostCard from './PostCard';
import CreatePostButton from './CreatePostButton';
import './ProfileFeed.css';

const ProfileFeed = ({ userId, isOwnProfile }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [error, setError] = useState(null);
  
  const observerRef = useRef();
  const lastPostRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore]);

  // Load initial posts
  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUserId = localStorage.getItem('userId');
      const response = await postService.getProfileFeed(userId, {
        limit: 10,
        cursor: null,
        viewerId: currentUserId
      });

      setPosts(response.posts || []);
      setCursor(response.nextCursor);
      setHasMore(response.hasNextPage);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!cursor || loadingMore) return;

    try {
      setLoadingMore(true);
      
      const currentUserId = localStorage.getItem('userId');
      const response = await postService.getProfileFeed(userId, {
        limit: 10,
        cursor: cursor,
        viewerId: currentUserId
      });

      setPosts(prev => [...prev, ...(response.posts || [])]);
      setCursor(response.nextCursor);
      setHasMore(response.hasNextPage);
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => 
      p._id === updatedPost._id ? updatedPost : p
    ));
  };

  if (loading) {
    return (
      <div className="profile-feed">
        {isOwnProfile && <CreatePostButton onPostCreated={handlePostCreated} />}
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-feed">
        <div className="feed-error">
          <p>{error}</p>
          <button onClick={loadPosts} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-feed">
      {isOwnProfile && <CreatePostButton onPostCreated={handlePostCreated} />}
      
      {posts.length === 0 ? (
        <div className="feed-empty">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>
            {isOwnProfile 
              ? 'Share your first post to get started!' 
              : 'This user hasn\'t shared anything yet.'}
          </p>
        </div>
      ) : (
        <div className="feed-posts">
          {posts.map((post, index) => (
            <div 
              key={post._id}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <PostCard 
                post={post}
                isOwnPost={isOwnProfile}
                onDelete={handlePostDeleted}
                onUpdate={handlePostUpdated}
              />
            </div>
          ))}
          
          {loadingMore && (
            <div className="feed-loading-more">
              <div className="loading-spinner-small"></div>
              <span>Loading more...</span>
            </div>
          )}
          
          {!hasMore && posts.length > 0 && (
            <div className="feed-end">
              <p>You've reached the end</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileFeed;
