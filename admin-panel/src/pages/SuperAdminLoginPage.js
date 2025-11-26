import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import authService from '../services/authService';
import '../styles/SuperAdminLogin.css';

const SuperAdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.superAdminLogin(formData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', 'superadmin');
        
        toast.success('Welcome back, Super Admin!');
        setTimeout(() => {
          navigate('/superadmin/dashboard');
        }, 1000);
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-login-container">
      <Toaster position="top-center" />
      
      <div className="login-card">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>

        {/* Crown Icon */}
        <div className="crown-icon">👑</div>

        <h1 className="login-title">Super Admin Login</h1>
        <p className="login-subtitle">Full System Access</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="security-notice">
          <p>⚠️ Super Admin access only. All activities are logged.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
