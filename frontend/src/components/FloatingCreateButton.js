import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './FloatingCreateButton.css';

const FloatingCreateButton = () => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const quickActions = [
    {
      id: 'upload',
      label: 'Upload',
      icon: '📤',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      action: () => handleAction('upload')
    },
    {
      id: 'record',
      label: 'Record',
      icon: '🎥',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      action: () => handleAction('record')
    },
    {
      id: 'go_live',
      label: 'Go Live',
      icon: '📡',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      action: () => handleAction('go_live')
    },
    {
      id: 'game_live',
      label: 'Game Live',
      icon: '🎮',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      action: () => handleAction('game_live')
    }
  ];

  const handleAction = (actionId) => {
    console.log(`Quick Action: ${actionId}`);
    setShowMenu(false);
    // Navigate to respective creation flow
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={`floating-create-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      {/* Quick Menu */}
      {showMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="quick-menu">
            {quickActions.map((action, index) => (
              <div
                key={action.id}
                className="quick-menu-item"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  background: action.gradient
                }}
                onClick={action.action}
              >
                <span className="menu-icon">{action.icon}</span>
                <span className="menu-label">{action.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Main Floating Button */}
      <button
        className={`floating-create-btn ${showMenu ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <span className="plus-icon">+</span>
      </button>
    </div>
  );
};

export default FloatingCreateButton;
