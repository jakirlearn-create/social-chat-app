import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalTaskbar from '../components/GlobalTaskbar';
import toast from 'react-hot-toast';
import './CustomerSupportPage.css';

function CustomerSupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'technical',
    subject: '',
    message: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'technical', name: 'Technical Issue', icon: '🔧' },
    { id: 'account', name: 'Account Problem', icon: '👤' },
    { id: 'payment', name: 'Payment & Wallet', icon: '💳' },
    { id: 'content', name: 'Content Report', icon: '⚠️' },
    { id: 'feature', name: 'Feature Request', icon: '💡' },
    { id: 'other', name: 'Other', icon: '📋' }
  ];

  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Login page and click "Forgot Password". Enter your email or phone number to receive a reset link.'
    },
    {
      question: 'How long does withdrawal take?',
      answer: 'Withdrawal requests are typically processed within 1-3 business days after admin approval.'
    },
    {
      question: 'Why was my post removed?',
      answer: 'Posts may be removed if they violate our community guidelines. Check your notifications for specific reasons.'
    },
    {
      question: 'How can I earn more coins?',
      answer: 'You can earn coins by posting quality content, getting reactions, playing games, and participating in community activities.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 20) {
      toast.error('Please provide a detailed message (at least 20 characters)');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email for follow-up');
      return;
    }

    try {
      setSubmitting(true);
      
      // For now, just show success message
      // In production, this would send to support API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Support ticket submitted successfully!');
      toast.info('We will respond to your email within 24-48 hours');
      
      // Reset form
      setFormData({
        category: 'technical',
        subject: '',
        message: '',
        email: ''
      });
      
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="customer-support-page">
      <GlobalTaskbar />
      
      <div className="support-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
        <h1>Customer Support</h1>
        <p>We're here to help! Contact us or browse FAQs</p>
      </div>

      <div className="support-container">
        <div className="support-form-card">
          <h2>Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="support-form">
            <div className="form-section">
              <label>Category</label>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-btn ${formData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-name">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={handleChange}
                required
                className="text-input"
              />
            </div>

            <div className="form-section">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your email for follow-up"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-input"
              />
            </div>

            <div className="form-section">
              <label>Detailed Message</label>
              <textarea
                name="message"
                placeholder="Please describe your issue in detail..."
                value={formData.message}
                onChange={handleChange}
                required
                className="textarea-input"
                rows="6"
              />
              <p className="input-hint">{formData.message.length} characters (min: 20)</p>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>

        <div className="faq-section">
          <h2>📚 Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="contact-info">
            <h3>Other Ways to Reach Us</h3>
            <div className="contact-methods">
              <div className="contact-method">
                <span className="contact-icon">📧</span>
                <span>support@fwpsocial.com</span>
              </div>
              <div className="contact-method">
                <span className="contact-icon">📱</span>
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="contact-method">
                <span className="contact-icon">⏰</span>
                <span>Mon-Fri, 9AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSupportPage;
