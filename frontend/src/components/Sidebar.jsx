import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { t } from '../i18n';
import safeLocalStorage from '../utils/safeStorage';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(safeLocalStorage.getItem('user') || '{}');

  const menuItems = [
    { icon: '', label: 'Profile', path: '/profile' },
    { icon: '', label: t('wallet_label'), path: '/wallet' },
    { icon: '', label: 'Posts', path: '/posts' },
    { icon: '', label: 'Messenger', path: '/messenger' },
    { icon: '', label: 'Customer Support', path: '/support' },
  ];

  // Only show hamburger button on home page
  const showHamburger = location.pathname === '/home';

  return (
    <>
      {showHamburger && !isOpen && (
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          <span /><span /><span />
        </button>
      )}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-user-info">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="sidebar-user-pic" />
          ) : (
            <div className="sidebar-user-pic" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '24px' }}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="sidebar-user-details">
            <h3>{user.name || 'User'}</h3>
            <p>ID: {user.idNumber || '---'}</p>
          </div>
        </div>
        <div className="sidebar-divider" />
        <nav className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <div key={idx} className="menu-item">
              <button className="menu-btn" onClick={() => { navigate(item.path); setIsOpen(false); }}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-whitebox">
          <div className="vh-stack">
            <button className={`vh-item ${openSection === 'videos' ? 'active' : ''}`} onClick={() => setOpenSection(prev => prev === 'videos' ? null : 'videos')}>
              <div className="vh-title">Videos</div>
            </button>
            <button className={`vh-item ${openSection === 'honors' ? 'active' : ''}`} onClick={() => setOpenSection(prev => prev === 'honors' ? null : 'honors')}>
              <div className="vh-title">Honors</div>
            </button>
          </div>
          <div className="vh-content">
            {openSection === 'videos' && (
              <div className="vh-panel">
                <h4>Videos</h4>
                <p className="muted">Update Coming Soon</p>
                <button className="link-btn" onClick={() => { navigate('/posts'); setIsOpen(false); }}>Go to Videos</button>
              </div>
            )}
            {openSection === 'honors' && (
              <div className="vh-panel">
                <h4>Honors</h4>
                <p className="muted">Update Coming Soon</p>
                <button className="link-btn" onClick={() => { navigate('/honors'); setIsOpen(false); }}>Go to Honors</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
