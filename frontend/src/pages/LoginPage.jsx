import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import './AuthPages.css';
import safeLocalStorage from '../utils/safeStorage';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    try {
      window.history.pushState({}, '', '/');
      window.location.href = '/';
    } catch (err) {
      window.location.href = '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authService.login({ email, password });
      if (user) {
        toast.success('Login successful!');
        safeLocalStorage.setItem('user', JSON.stringify(user));
        // Store userId for messenger
        safeLocalStorage.setItem('userId', user._id || user.id || user.userId);
        try { window.history.pushState({}, '', '/home'); } catch (e) {}      
        window.location.href = '/home';
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-btn-auth" onClick={handleBack}> Back</button>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email or Phone *</label>
            <input
              type="text"
              placeholder="Enter email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">  
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/signup">Don't have an account? Sign up</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

