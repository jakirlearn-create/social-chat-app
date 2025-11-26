import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalTaskbar from '../components/GlobalTaskbar';
import './BackgroundStore.css';
import safeLocalStorage from '../utils/safeStorage';
import { toast } from 'react-hot-toast';

function BackgroundStore() {
  const navigate = useNavigate();
  
  const getUserWallet = () => {
    try {
      const userStr = safeLocalStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.wallet?.goldCoins || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const [goldCoins, setGoldCoins] = useState(getUserWallet());

  const backgrounds = [
    { id: 1, name: 'Gradient Blue', url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', price: 0, type: 'gradient' },
    { id: 2, name: 'Sunset Orange', url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', price: 0, type: 'gradient' },
    { id: 3, name: 'Ocean Green', url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', price: 0, type: 'gradient' },
    { id: 4, name: 'Royal Purple', url: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', price: 100, type: 'gradient' },
    { id: 5, name: 'Golden Hour', url: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', price: 150, type: 'gradient' },
    { id: 6, name: 'Dark Night', url: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', price: 200, type: 'gradient' },
    { id: 7, name: 'Cherry Blossom', url: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', price: 250, type: 'gradient' },
    { id: 8, name: 'Deep Space', url: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', price: 300, type: 'gradient' },
  ];

  const handlePreview = (bg) => {
    navigate('/background-preview', { state: { background: bg, goldCoins } });
  };

  const handlePurchase = (bg) => {
    if (bg.price === 0) {
      applyBackground(bg);
    } else {
      if (goldCoins >= bg.price) {
        const newBalance = goldCoins - bg.price;
        setGoldCoins(newBalance);
        updateUserWallet(newBalance);
        applyBackground(bg);
        toast.success(`Purchased ${bg.name} for ${bg.price} gold coins!`);
      } else {
        toast.error('Not enough gold coins!');
      }
    }
  };

  const applyBackground = (bg) => {
    try {
      const userStr = safeLocalStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.profileBackground = bg.url;
        safeLocalStorage.setItem('user', JSON.stringify(user));
        toast.success('Background applied!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply background');
    }
  };

  const updateUserWallet = (newBalance) => {
    try {
      const userStr = safeLocalStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (!user.wallet) user.wallet = {};
        user.wallet.goldCoins = newBalance;
        safeLocalStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="background-store-page">
      <GlobalTaskbar />
      
      <div className="background-store-container">
        <div className="store-header">
          <h1>Background Store</h1>
          <div className="gold-balance">
            <span className="gold-icon"></span>
            <span className="gold-amount">{goldCoins}</span>
          </div>
        </div>

        <div className="store-section">
          <h2>Free Backgrounds</h2>
          <div className="background-grid">
            {backgrounds.filter(bg => bg.price === 0).map(bg => (
              <div key={bg.id} className="background-card">
                <div 
                  className="background-preview" 
                  style={{ background: bg.url }}
                ></div>
                <div className="background-info">
                  <h3>{bg.name}</h3>
                  <p className="price-tag">FREE</p>
                </div>
                <div className="background-actions">
                  <button onClick={() => handlePreview(bg)} className="btn-preview">
                    Preview
                  </button>
                  <button onClick={() => handlePurchase(bg)} className="btn-apply">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="store-section">
          <h2>Premium Backgrounds</h2>
          <div className="background-grid">
            {backgrounds.filter(bg => bg.price > 0).map(bg => (
              <div key={bg.id} className="background-card">
                <div 
                  className="background-preview" 
                  style={{ background: bg.url }}
                ></div>
                <div className="background-info">
                  <h3>{bg.name}</h3>
                  <p className="price-tag"> {bg.price}</p>
                </div>
                <div className="background-actions">
                  <button onClick={() => handlePreview(bg)} className="btn-preview">
                    Preview
                  </button>
                  <button onClick={() => handlePurchase(bg)} className="btn-purchase">
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackgroundStore;
