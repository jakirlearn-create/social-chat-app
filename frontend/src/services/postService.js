import API_BASE_URL from '../config/api';
import safeLocalStorage from '../utils/safeStorage';

class PostService {
  // Get auth token
  getToken() {
    return safeLocalStorage.getItem('token');
  }

  // Get profile with posts feed
  async getProfileFeed(userId, { limit = 10, cursor = null, viewerId = null } = {}) {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (cursor) params.append('cursor', cursor);
      if (viewerId) params.append('viewerId', viewerId);

      const response = await fetch(
        `${API_BASE_URL}/api/profile/${userId}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch profile feed');

      return await response.json();
    } catch (error) {
      console.error('Get profile feed error:', error);
      throw error;
    }
  }

  // Get single post
  async getPost(postId, viewerId = null) {
    try {
      const params = viewerId ? `?viewerId=${viewerId}` : '';
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch post');

      return await response.json();
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  }

  // Create post
  async createPost({ type, content, media, privacy, liveRoomId }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ type, content, media, privacy, liveRoomId })
      });

      if (!response.ok) throw new Error('Failed to create post');

      return await response.json();
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  // Update post
  async updatePost(postId, { content, media, privacy }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ content, media, privacy })
      });

      if (!response.ok) throw new Error('Failed to update post');

      return await response.json();
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  }

  // Delete post
  async deletePost(postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete post');

      return await response.json();
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  // Toggle reaction
  async toggleReaction(postId, reactionType) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/reaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify({ type: reactionType })
        }
      );

      if (!response.ok) throw new Error('Failed to toggle reaction');

      return await response.json();
    } catch (error) {
      console.error('Toggle reaction error:', error);
      throw error;
    }
  }

  // Get reactions
  async getReactions(postId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/reactions`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch reactions');

      return await response.json();
    } catch (error) {
      console.error('Get reactions error:', error);
      throw error;
    }
  }

  // Add comment
  async addComment(postId, { content, parentCommentId = null }) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify({ content, parentCommentId })
        }
      );

      if (!response.ok) throw new Error('Failed to add comment');

      return await response.json();
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  }

  // Get comments
  async getComments(postId, { limit = 20, cursor = null } = {}) {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch comments');

      return await response.json();
    } catch (error) {
      console.error('Get comments error:', error);
      throw error;
    }
  }

  // Get comment replies
  async getCommentReplies(commentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/comments/${commentId}/replies`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch replies');

      return await response.json();
    } catch (error) {
      console.error('Get replies error:', error);
      throw error;
    }
  }

  // Share post
  async sharePost(postId, { shareType, caption, privacy }) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/share`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify({ shareType, caption, privacy })
        }
      );

      if (!response.ok) throw new Error('Failed to share post');

      return await response.json();
    } catch (error) {
      console.error('Share post error:', error);
      throw error;
    }
  }

  // Report post
  async reportPost(postId, reason) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify({ reason })
        }
      );

      if (!response.ok) throw new Error('Failed to report post');

      return await response.json();
    } catch (error) {
      console.error('Report post error:', error);
      throw error;
    }
  }

  // Request upload URL
  async requestUploadUrl(fileName, contentType, fileSize) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/uploads/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ fileName, contentType, fileSize })
      });

      if (!response.ok) throw new Error('Failed to request upload URL');

      return await response.json();
    } catch (error) {
      console.error('Request upload URL error:', error);
      throw error;
    }
  }

  // Upload file to signed URL
  async uploadFile(signedUrl, file, contentType) {
    try {
      const response = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType
        },
        body: file
      });

      if (!response.ok) throw new Error('Failed to upload file');

      return true;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  // Complete upload
  async completeUpload(filePath, contentType) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/uploads/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ filePath, contentType })
      });

      if (!response.ok) throw new Error('Failed to complete upload');

      return await response.json();
    } catch (error) {
      console.error('Complete upload error:', error);
      throw error;
    }
  }

  // Full upload flow
  async uploadMedia(file) {
    try {
      // Step 1: Request signed URL
      const { uploadUrl, filePath, publicUrl } = await this.requestUploadUrl(
        file.name,
        file.type,
        file.size
      );

      // Step 2: Upload to signed URL
      await this.uploadFile(uploadUrl, file, file.type);

      // Step 3: Complete upload and get final URLs
      const result = await this.completeUpload(filePath, file.type);

      return result;
    } catch (error) {
      console.error('Upload media error:', error);
      throw error;
    }
  }
}

export default new PostService();
