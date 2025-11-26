import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import authService from '../services/authService';
import '../styles/RegistrationForm.css';

const AdminRegistrationPage = () => {
  const navigate = useNavigate();
  const { country } = useParams();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nid: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    education: '',
    experience: '',
    reason: '',
    referralCode: ''
  });
  
  const [loading, setLoading] = useState(false);

  const countryNames = {
    bd: 'Bangladesh',
    my: 'Malaysia',
    in: 'India',
    pk: 'Pakistan',
    np: 'Nepal'
  };

  const countryFlags = {
    bd: '🇧🇩',
    my: '🇲🇾',
    in: '🇮🇳',
    pk: '🇵🇰',
    np: '🇳🇵'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (country === 'bd') {
      // Bangladesh - Full validation
      if (!formData.fullName || !formData.email || !formData.phone || 
          !formData.nid || !formData.address || !formData.city || 
          !formData.district || !formData.dateOfBirth || !formData.gender || 
          !formData.reason) {
        toast.error('Please fill in all required fields');
        return false;
      }
      
      if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(formData.nid)) {
        toast.error('Invalid NID number (must be 10, 13, or 17 digits)');
        return false;
      }
      
      if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
        toast.error('Invalid phone number (must start with 01 and be 11 digits)');
        return false;
      }
    } else {
      // Other countries - Simplified validation
      if (!formData.fullName || !formData.email || !formData.phone || !formData.reason) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Invalid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        ...formData,
        country: countryNames[country]
      };

      const response = await authService.adminRegister(registrationData);
      
      if (response.success) {
        toast.success('Registration submitted successfully!');
        setTimeout(() => {
          navigate('/admin/registration-success');
        }, 2000);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderBangladeshForm = () => (
    <>
      {/* Personal Information */}
      <div className="form-section">
        <h3 className="section-title">Personal Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>NID Number *</label>
            <input
              type="text"
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              placeholder="10/13/17 digits"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="form-section">
        <h3 className="section-title">Address Information</h3>
        
        <div className="form-group">
          <label>Full Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="House/Flat no, Road, Area"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City/Upazila *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city/upazila"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>District *</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter district"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="XXXX"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="form-section">
        <h3 className="section-title">Professional Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Education</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Highest degree"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of experience"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Reason for Application *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Why do you want to become an admin?"
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Referral Code (Optional)</label>
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Enter referral code if any"
            disabled={loading}
          />
        </div>
      </div>
    </>
  );

  const renderSimplifiedForm = () => (
    <>
      <div className="form-section">
        <h3 className="section-title">Basic Information</h3>
        
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Reason for Application *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Why do you want to become an admin?"
            rows="5"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Referral Code (Optional)</label>
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Enter referral code if any"
            disabled={loading}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="registration-container">
      <Toaster position="top-center" />
      
      <div className="registration-card">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/admin/register/country')}>
          ← Back
        </button>

        {/* Header */}
        <div className="reg-header">
          <div className="country-flag-large">{countryFlags[country]}</div>
          <h1 className="reg-title">Admin Registration</h1>
          <p className="reg-subtitle">{countryNames[country]}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {country === 'bd' ? renderBangladeshForm() : renderSimplifiedForm()}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>

        {/* Notice */}
        <div className="approval-notice">
          <p>⏳ Your application will be reviewed by Super Admin</p>
          <p>You will receive login credentials via email once approved</p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationPage;
