import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [supportInfo, setSupportInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!email || !name || !dob) {
        toast.error('Please fill in all fields');
        return;
      }

      setLoading(true);
      try {
        const response = await authService.forgotPassword({
          email_or_phone: email,
          name: name,
          dob: dob
        });

        if (response.data.success) {
          setSupportInfo({
            phone: response.data.support_phone,
            whatsapp: response.data.whatsapp
          });
          setStep(2);
          toast.success('Verification details sent!');
        }
      } catch (error) {
        console.error('Forgot password error:', error);
        toast.error(error.response?.data?.message || 'Failed to process request');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Header */}
        <div className="forgot-header">
          <h1>Reset Your Password</h1>
          <p>We'll help you get back into your account</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label>Email or Phone Number</label>
              <input
                type="text"
                placeholder="Enter your email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="verification-section">
            <div className="success-icon">✓</div>
            <h2>Contact Support</h2>
            <p>Please contact our customer service to reset your password:</p>
            
            <div className="support-info">
              <div className="support-item">
                <h3>📞 Customer Service</h3>
                <a href={`tel:${supportInfo?.phone}`}>{supportInfo?.phone}</a>
              </div>
              
              <div className="support-item">
                <h3>💬 WhatsApp</h3>
                <a href={`https://wa.me/${supportInfo?.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  {supportInfo?.whatsapp}
                </a>
              </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="back-btn"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Back to Login */}
        <div className="back-to-login">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
