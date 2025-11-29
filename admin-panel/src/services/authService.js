import axios from 'axios';

// Force production API URL - no fallback to old Vercel URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fwp-backend-api.onrender.com/api';

// Debug logging for mobile troubleshooting
console.log('🔧 Admin Panel API Configuration:');
console.log('   REACT_APP_API_URL from env:', process.env.REACT_APP_API_URL);
console.log('   Final API_BASE_URL:', API_BASE_URL);
console.log('   Build time:', new Date().toISOString());

class AuthService {
  // Super Admin Login
  async superAdminLogin(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/superadmin/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  // Admin Login
  async adminLogin(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  // Admin Registration
  async adminRegister(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/register`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  // Get Pending Admin Requests (Super Admin only)
  async getPendingAdmins(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending admins' };
    }
  }

  // Approve Admin (Super Admin only)
  async approveAdmin(adminId, credentials, token) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/approve/${adminId}`,
        credentials,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve admin' };
    }
  }

  // Reject Admin (Super Admin only)
  async rejectAdmin(adminId, reason, token) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/reject/${adminId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject admin' };
    }
  }

  // Get Dashboard Stats
  async getDashboardStats(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  // Check if logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get role
  getRole() {
    return localStorage.getItem('role');
  }
}

export default new AuthService();
