import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BackgroundPreview.css';
import safeLocalStorage from '../utils/safeStorage';
import { toast } from 'react-hot-toast';

function BackgroundPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { background, goldCoins } = location.state || {};

  if (!background) {
    navigate('/background-store');
    return null;
  }

  const handleApply = () => {
    if (background.price > 0 && goldCoins < background.price) {
      toast.error('Not enough gold coins!');
      return;
    }

    try {
      const userStr = safeLocalStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.profileBackground = background.url;
        
        if (background.price > 0) {
          if (!user.wallet) user.wallet = {};
          user.wallet.goldCoins = (user.wallet.goldCoins || 0) - background.price;
        }
        
        safeLocalStorage.setItem('user', JSON.stringify(user));
        toast.success('Background applied successfully!');
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply background');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="background-preview-page" style={{ background: background.url }}>
      <div className="preview-overlay">
        <div className="preview-card">
          <h1>Preview Background</h1>
          <div className="preview-info">
            <h2>{background.name}</h2>
            <p className="preview-price">
              {background.price === 0 ? 'FREE' : ` ${background.price} Gold Coins`}
            </p>
          </div>
          
          <div className="preview-sample">
            <div className="sample-profile-card">
              <div className="sample-avatar">U</div>
              <h3>Your Profile</h3>
              <p>This is how your profile will look</p>
            </div>
          </div>

          <div className="preview-actions">
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button onClick={handleApply} className="btn-apply-preview">
              {background.price > 0 ? `Purchase & Apply` : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackgroundPreview;
