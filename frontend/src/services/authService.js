import safeLocalStorage from "../utils/safeStorage";
﻿import API_BASE_URL from '../config/api';

class AuthService {
  async signup(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const result = await response.json();
      if (result.token) {
        safeLocalStorage.setItem('token', result.token);
        safeLocalStorage.setItem('user', JSON.stringify(result.user));
      }
      return result.user;
    } catch (error) {
      console.error('Auth Service Error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      if (result.token) {
        safeLocalStorage.setItem('token', result.token);
        safeLocalStorage.setItem('user', JSON.stringify(result.user));
      }
      return result.user;
    } catch (error) {
      console.error('Auth Service Error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = safeLocalStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('Get User Error:', error);
      return null;
    }
  }

  async updateProfile(data) {
    try {
      const token = safeLocalStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const result = await response.json();
      safeLocalStorage.setItem('user', JSON.stringify(result.user));
      return result.user;
    } catch (error) {
      console.error('Update Profile Error:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const token = safeLocalStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const result = await response.json();
      return result.users || [];
    } catch (error) {
      console.error('Get All Users Error:', error);
      return [];
    }
  }

  logout() {
    safeLocalStorage.removeItem('token');
    safeLocalStorage.removeItem('user');
  }

  getToken() {
    return safeLocalStorage.getItem('token');
  }

  getUser() {
    const user = safeLocalStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

const authService = new AuthService();
export default authService;
