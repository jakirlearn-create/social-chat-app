import React, { useState } from 'react';
import GlobalTaskbar from '../components/GlobalTaskbar';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CreateLivePage.css';

function CreateLivePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'music',
    privacy: 'public'
  });

  const categories = [
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'chat', name: 'Just Chatting', icon: '💬' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'art', name: 'Art & Creative', icon: '🎨' },
    { id: 'other', name: 'Other', icon: '📡' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    // For now, show coming soon message
    toast.info('Live streaming feature coming soon!');
    toast.info('Your setup will be saved for when the feature launches');
  };

  return (
    <div className="create-live-page">
      <GlobalTaskbar />
      
      <div className="live-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h1>🎥 Create Live Session</h1>
        <p>Go live with audio or video</p>
      </div>

      <div className="live-container">
        <form onSubmit={handleSubmit} className="live-form">
          <div className="form-section">
            <label>Session Title</label>
            <input
              type="text"
              name="title"
              placeholder="What's your live session about?"
              value={formData.title}
              onChange={handleChange}
              required
              className="text-input"
            />
          </div>

          <div className="form-section">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Tell viewers what to expect..."
              value={formData.description}
              onChange={handleChange}
              className="textarea-input"
              rows="4"
            />
          </div>

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
            <label>Privacy</label>
            <div className="privacy-options">
              <button
                type="button"
                className={`privacy-btn ${formData.privacy === 'public' ? 'selected' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, privacy: 'public' }))}
              >
                <span className="privacy-icon">🌍</span>
                <div>
                  <div className="privacy-name">Public</div>
                  <div className="privacy-desc">Anyone can join</div>
                </div>
              </button>
              <button
                type="button"
                className={`privacy-btn ${formData.privacy === 'private' ? 'selected' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, privacy: 'private' }))}
              >
                <span className="privacy-icon">🔒</span>
                <div>
                  <div className="privacy-name">Private</div>
                  <div className="privacy-desc">Only invited people</div>
                </div>
              </button>
            </div>
          </div>

          <div className="info-box">
            <p className="info-title">📢 Coming Soon!</p>
            <p className="info-text">
              Live streaming feature is currently under development. We're working hard to bring you the best live experience with audio and video chat capabilities.
            </p>
          </div>

          <button type="submit" className="submit-btn">
            Save Settings (Preview)
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateLivePage;

