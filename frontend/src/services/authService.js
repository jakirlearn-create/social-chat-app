import axios from 'axios';
import { API_BASE_URL } from '../config/firebase';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },
  
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  
  forgotPassword: async (data) => {
    return apiClient.post('/auth/forgot-password', data);
  },
  
  googleAuth: async (googleToken) => {
    return apiClient.post('/auth/google', { google_token: googleToken });
  },
  
  facebookAuth: async (facebookToken) => {
    return apiClient.post('/auth/facebook', { facebook_token: facebookToken });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

export default apiClient;
