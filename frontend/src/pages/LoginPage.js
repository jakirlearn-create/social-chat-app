import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await authService.login({
        email_or_phone: email,
        password: password,
      });

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        setIsAuthenticated(true);
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="logo-placeholder">LOGO</div>
          <h1>Login Your Account</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label>Gmail & Mobile Number</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="text"
                placeholder="Enter email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Links */}
        <div className="login-links">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        {/* Sign Up Link */}
        <div className="signup-section">
          <p>
            If you don't already have an account, click{' '}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
            {' '}to create one first.
          </p>
        </div>

        {/* Social Login */}
        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button type="button" className="social-btn google-btn">
              Google
            </button>
            <button type="button" className="social-btn facebook-btn">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
