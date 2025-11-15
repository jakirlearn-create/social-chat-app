import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import './SignupPage.css';

function SignupPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [method, setMethod] = useState('manual'); // manual, google, facebook
  const [showTerms, setShowTerms] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manual signup state
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.dob) {
      toast.error('Date of birth is required');
      return false;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error('Email or phone number is required');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleManualSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await authService.signup({
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token || '');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Account created successfully!');
        setIsAuthenticated(true);
        navigate('/home');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Terms Modal */}
        {showTerms && (
          <div className="terms-modal">
            <div className="terms-content">
              <h2>Terms & Conditions</h2>
              <div className="terms-text">
                <p>By creating an account, you agree to our Terms and Conditions.</p>
                <p>• You must be at least 13 years old</p>
                <p>• You agree to provide accurate information</p>
                <p>• You will respect other users' privacy</p>
                <p>• You understand our content policies</p>
              </div>
              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label>I agree to the Terms & Conditions</label>
              </div>
              <div className="terms-buttons">
                <button 
                  onClick={() => setShowTerms(false)}
                  disabled={!agreeTerms}
                  className="continue-btn"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="signup-header">
          <h1>Create Account</h1>
        </div>

        {!showTerms && (
          <>
            {/* Method Selection */}
            <div className="method-selection">
              <button 
                className={`method-btn ${method === 'manual' ? 'active' : ''}`}
                onClick={() => setMethod('manual')}
              >
                Manual Create
              </button>
              <button 
                className={`method-btn ${method === 'google' ? 'active' : ''}`}
                onClick={() => setMethod('google')}
              >
                Google
              </button>
              <button 
                className={`method-btn ${method === 'facebook' ? 'active' : ''}`}
                onClick={() => setMethod('facebook')}
              >
                Facebook
              </button>
            </div>

            {/* Manual Signup Form */}
            {method === 'manual' && (
              <form onSubmit={handleManualSignup} className="signup-form">
                <div className="form-group">
                  <label>*Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>*Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>*Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>*Password</label>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>*Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'error' : ''}
                  />
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <span className="error-text">Passwords do not match</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="signup-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Google Signup */}
            {method === 'google' && (
              <div className="oauth-section">
                <button className="oauth-btn google-oauth">
                  Sign up with Google
                </button>
                <p>You'll need to provide additional information after Google login</p>
              </div>
            )}

            {/* Facebook Signup */}
            {method === 'facebook' && (
              <div className="oauth-section">
                <button className="oauth-btn facebook-oauth">
                  Sign up with Facebook
                </button>
                <p>You'll need to provide additional information after Facebook login</p>
              </div>
            )}

            {/* Login Link */}
            <div className="login-link-section">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SignupPage;
