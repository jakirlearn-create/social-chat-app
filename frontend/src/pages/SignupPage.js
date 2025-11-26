import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import './AuthPages.css';
import './SignupPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('manual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'Male',
    country: 'Bangladesh',
  });
  const [loading, setLoading] = useState(false);

  const countries = [
    { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '' },
    { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '' },
    { name: 'India', code: 'IN', dialCode: '+91', flag: '' },
    { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '' },
    { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '' },
  ];

  const handleBack = () => {
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error('Email or phone is required');
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
    if (!formData.country) {
      toast.error('Please select a country');
      return false;
    }
    return true;
  };

  const handleManualSignup = async (e) => {
    e.preventDefault();
    console.log(' Form submitted!');
    
    if (!validateForm()) {
      console.log(' Validation failed');
      return;
    }

    console.log(' Validation passed');
    setLoading(true);
    
    try {
      const selectedCountry = countries.find(c => c.name === formData.country);
      console.log(' Selected country:', selectedCountry);
      
      if (!selectedCountry) {
        toast.error('Please select a valid country');
        setLoading(false);
        return;
      }

      const signupData = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        password: formData.password,
        dob: formData.dob,
        gender: formData.gender,
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
      };

      console.log(' Sending signup data:', signupData);
      toast.loading('Creating account...', { id: 'signup-loading' });

      const response = await authService.signup(signupData);
      toast.dismiss('signup-loading');
      console.log(' Signup response:', response);

      if (response) {
        toast.success(
          `Account created! Your User ID: ${response.idNumber}`,
          { duration: 5000 }
        );
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error('Signup failed - no response');
      }
    } catch (error) {
      console.error(' Signup error:', error);
      const errorMessage = error.message || error.toString() || 'Unknown error';
      toast.error(`Signup failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google Sign Up coming soon');
  };

  const handleFacebookSignup = () => {
    toast.info('Facebook Sign Up coming soon');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-btn-auth" onClick={handleBack}> Back</button>
        <h1>Create Account</h1>

        <div className="method-tabs">
          <button
            className={`tab ${method === 'manual' ? 'active' : ''}`}
            onClick={() => setMethod('manual')}
          >
            Manual
          </button>
          <button
            className={`tab ${method === 'google' ? 'active' : ''}`}
            onClick={() => setMethod('google')}
          >
            Google
          </button>
          <button
            className={`tab ${method === 'facebook' ? 'active' : ''}`}
            onClick={() => setMethod('facebook')}
          >
            Facebook
          </button>
        </div>

        {method === 'manual' && (
          <form onSubmit={handleManualSignup} className="auth-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country *</label>
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleInputChange}
                className="country-select"
                required
              >
                {countries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
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
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {method === 'google' && (
          <div className="social-auth">
            <button className="btn-google" onClick={handleGoogleSignup}>
              Continue with Google
            </button>
            <p style={{marginTop: '15px', fontSize: '12px', color: '#666'}}>
              A unique user ID will be created for your account
            </p>
          </div>
        )}

        {method === 'facebook' && (
          <div className="social-auth">
            <button className="btn-facebook" onClick={handleFacebookSignup}>
              Continue with Facebook
            </button>
            <p style={{marginTop: '15px', fontSize: '12px', color: '#666'}}>
              A unique user ID will be created for your account
            </p>
          </div>
        )}

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

