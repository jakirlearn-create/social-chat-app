import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fwp-backend-api.onrender.com/api';

/**
 * Search Service - Facebook-style user search
 */
class SearchService {
  /**
   * Search users with debounce support
   * @param {string} query - Search query
   * @returns {Promise} - Array of users
   */
  async searchUsers(query) {
    try {
      if (!query || query.trim().length < 2) {
        return { success: true, users: [], count: 0 };
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_BASE_URL}/users/search`, {
        params: { q: query.toLowerCase().trim() },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('🔍 Search error:', error);
      throw error.response?.data || { message: 'Search failed' };
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise} - User profile data
   */
  async getUserProfile(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_BASE_URL}/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('👤 Profile fetch error:', error);
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  }

  /**
   * Cache recent searches in localStorage
   * @param {array} searches - Recent search results
   */
  cacheRecentSearches(searches) {
    try {
      const maxCache = 10;
      const cached = searches.slice(0, maxCache);
      localStorage.setItem('recent_searches', JSON.stringify(cached));
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  /**
   * Get cached recent searches
   * @returns {array} - Recent searches
   */
  getRecentSearches() {
    try {
      const cached = localStorage.getItem('recent_searches');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return [];
    }
  }

  /**
   * Clear search cache
   */
  clearRecentSearches() {
    try {
      localStorage.removeItem('recent_searches');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

export default new SearchService();
