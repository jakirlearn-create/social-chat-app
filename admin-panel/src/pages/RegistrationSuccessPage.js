import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistrationSuccess.css';

const RegistrationSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        
        <h1 className="success-title">Registration Submitted!</h1>
        <p className="success-message">
          Your admin registration has been successfully submitted.
        </p>

        <div className="info-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-text">
              <h3>Review Process</h3>
              <p>Super Admin will review your application</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-text">
              <h3>Approval</h3>
              <p>You'll receive an email if approved</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-text">
              <h3>Login Credentials</h3>
              <p>Email will contain your username & password</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/admin/login')}
          >
            Go to Login Page
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>

        <div className="contact-support">
          <p>Need help? Contact support</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
