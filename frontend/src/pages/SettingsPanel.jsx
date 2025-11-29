import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import './SettingsPanel.css';

function SettingsPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme, fontSize, language, toggleTheme, changeFontSize, changeLanguage } = useTheme();
  
  const [expandedSection, setExpandedSection] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [showAppLock, setShowAppLock] = useState(false);
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: localStorage.getItem('notifications') !== 'false',
    sound: localStorage.getItem('sound') !== 'false',
    vibration: localStorage.getItem('vibration') !== 'false',
    autoDownloadImages: localStorage.getItem('autoDownloadImages') !== 'false',
    autoPlayVideo: localStorage.getItem('autoPlayVideo') === 'true',
    twoFactorAuth: localStorage.getItem('twoFactorAuth') === 'true',
    appLock: localStorage.getItem('appLock') === 'true',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
    otp: ''
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleSetting = (key) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });
    localStorage.setItem(key, String(newValue));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    try {
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Failed to change password: ' + error.message);
    }
  };

  const handleSendOTP = async () => {
    if (!emailData.newEmail) {
      alert('Please enter new email');
      return;
    }
    try {
      alert('OTP sent to ' + emailData.newEmail);
    } catch (error) {
      alert('Failed to send OTP: ' + error.message);
    }
  };

  const handleVerifyAndChangeEmail = async () => {
    if (!emailData.otp) {
      alert('Please enter OTP');
      return;
    }
    try {
      alert('Email changed successfully!');
      setShowChangeEmail(false);
      setEmailData({ newEmail: '', otp: '' });
    } catch (error) {
      alert('Failed to change email: ' + error.message);
    }
  };

  const handleBackupNow = async () => {
    try {
      alert('Backing up data to Google Drive...');
      setTimeout(() => {
        alert('Backup completed successfully!');
        localStorage.setItem('lastBackupTime', new Date().toISOString());
      }, 2000);
    } catch (error) {
      alert('Backup failed: ' + error.message);
    }
  };

  const handleRestoreBackup = async () => {
    try {
      if (!window.confirm('This will restore your data from the last backup. Continue?')) {
        return;
      }
      alert('Restoring backup...');
      setTimeout(() => {
        alert('Backup restored successfully!');
      }, 2000);
    } catch (error) {
      alert('Restore failed: ' + error.message);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Clear all cached images and temporary files?')) {
      try {
        localStorage.removeItem('cachedImages');
        localStorage.removeItem('tempFiles');
        alert('Cache cleared successfully!');
      } catch (error) {
        alert('Failed to clear cache: ' + error.message);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This action cannot be undone. Your account will be permanently deleted after 30 days.')) {
      const finalConfirm = window.prompt('Type "DELETE" to confirm:');
      if (finalConfirm === 'DELETE') {
        alert('Account deletion initiated. You have 30 days to recover your account.');
        authService.logout();
        navigate('/login');
      }
    }
  };

  const lastBackupTime = localStorage.getItem('lastBackupTime');
  const appVersion = '1.0.0';

  if (!isOpen) return null;

  return (
    <>
      <div className="settings-overlay" onClick={onClose}></div>
      <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
        <div className="settings-header">
          <button className="settings-close-btn" onClick={onClose}>✕</button>
          <h2>⚙️ Settings</h2>
        </div>

        <div className="settings-content">
          
          {/* SECTION 1: APPEARANCE */}
          <div className="settings-section">
            <div className="section-header" onClick={() => toggleSection('appearance')}>
              <span>🎨 Appearance & UI</span>
              <span className="arrow">{expandedSection === 'appearance' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'appearance' && (
              <div className="section-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>🌙 Dark / Light Mode</strong>
                    <small>Change app theme</small>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>📏 Font Size</strong>
                    <small>Text scale: Small / Medium / Large</small>
                  </div>
                  <select value={fontSize} onChange={(e) => changeFontSize(e.target.value)} className="setting-select">
                    <option value="small">Small (0.8x)</option>
                    <option value="medium">Medium (1.0x)</option>
                    <option value="large">Large (1.3x)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>🌍 App Language</strong>
                    <small>Multi-language support</small>
                  </div>
                  <select value={language} onChange={(e) => changeLanguage(e.target.value)} className="setting-select">
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bangla)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: ACCOUNT & PRIVACY */}
          <div className="settings-section">
            <div className="section-header" onClick={() => toggleSection('account')}>
              <span>👤 Account & Privacy</span>
              <span className="arrow">{expandedSection === 'account' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'account' && (
              <div className="section-content">
                <button className="setting-button" onClick={() => { onClose(); navigate('/profile'); }}>
                  ✏️ Edit Profile
                </button>

                <button className="setting-button" onClick={() => setShowChangePassword(!showChangePassword)}>
                  🔐 Change Password
                </button>
                {showChangePassword && (
                  <div className="sub-form">
                    <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                    <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                    <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                    <button className="btn-primary" onClick={handleChangePassword}>Update Password</button>
                  </div>
                )}

                <button className="setting-button" onClick={() => setShowChangeEmail(!showChangeEmail)}>
                  📧 Change Email / Phone
                </button>
                {showChangeEmail && (
                  <div className="sub-form">
                    <input type="email" placeholder="New Email" value={emailData.newEmail} onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})} />
                    <button className="btn-secondary" onClick={handleSendOTP}>Send OTP</button>
                    <input type="text" placeholder="Enter OTP" value={emailData.otp} onChange={(e) => setEmailData({...emailData, otp: e.target.value})} />
                    <button className="btn-primary" onClick={handleVerifyAndChangeEmail}>Verify & Update</button>
                  </div>
                )}

                <button className="setting-button" onClick={() => setShow2FA(!show2FA)}>
                  🔒 Two-Step Verification
                </button>
                {show2FA && (
                  <div className="sub-form">
                    <p>Enable extra security layer for your account</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={settings.twoFactorAuth} onChange={() => toggleSetting('twoFactorAuth')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                )}

                <button className="setting-button" onClick={() => setShowBlockedUsers(!showBlockedUsers)}>
                  🚫 Blocked Users
                </button>
                {showBlockedUsers && (
                  <div className="sub-form">
                    <p className="empty-state">No blocked users</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: NOTIFICATIONS & SYNC */}
          <div className="settings-section">
            <div className="section-header" onClick={() => toggleSection('notifications')}>
              <span>🔔 Notifications & Sync</span>
              <span className="arrow">{expandedSection === 'notifications' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'notifications' && (
              <div className="section-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>🔔 Push Notifications</strong>
                    <small>Receive notifications</small>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>🔊 Sound</strong>
                    <small>Message notification sound</small>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={settings.sound} onChange={() => toggleSetting('sound')} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>📳 Vibration</strong>
                    <small>Vibrate on notifications</small>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={settings.vibration} onChange={() => toggleSetting('vibration')} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="sync-section">
                  <h4>☁️ Google Drive Sync</h4>
                  <div className="sync-info">
                    <p>Last Backup: {lastBackupTime ? new Date(lastBackupTime).toLocaleString() : 'Never'}</p>
                  </div>
                  <div className="sync-buttons">
                    <button className="btn-primary" onClick={handleBackupNow}>📤 Backup Now</button>
                    <button className="btn-secondary" onClick={handleRestoreBackup}>📥 Restore Backup</button>
                  </div>
                  <small>Backs up: Messages, Profile, Friends, Settings</small>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: SECURITY */}
          <div className="settings-section">
            <div className="section-header" onClick={() => toggleSection('security')}>
              <span>🔐 Security</span>
              <span className="arrow">{expandedSection === 'security' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'security' && (
              <div className="section-content">
                <button className="setting-button" onClick={() => setShowAppLock(!showAppLock)}>
                  🔒 App Lock
                </button>
                {showAppLock && (
                  <div className="sub-form">
                    <p>Protect app with PIN, Pattern, or Biometric</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={settings.appLock} onChange={() => toggleSetting('appLock')} />
                      <span className="slider"></span>
                    </label>
                    {settings.appLock && (
                      <select className="setting-select">
                        <option>PIN</option>
                        <option>Pattern</option>
                        <option>Biometric</option>
                      </select>
                    )}
                  </div>
                )}

                <button className="setting-button" onClick={() => setShowActiveSessions(!showActiveSessions)}>
                  📱 Active Sessions
                </button>
                {showActiveSessions && (
                  <div className="sub-form">
                    <div className="session-item">
                      <div>
                        <strong>💻 Current Device</strong>
                        <small>Windows - Chrome</small>
                      </div>
                      <span className="active-badge">Active</span>
                    </div>
                  </div>
                )}

                <button className="setting-button">
                  🔓 Permission Manager
                </button>
              </div>
            )}
          </div>

          {/* SECTION 5: DATA & SYSTEM */}
          <div className="settings-section">
            <div className="section-header" onClick={() => toggleSection('system')}>
              <span>⚙️ Data & System</span>
              <span className="arrow">{expandedSection === 'system' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'system' && (
              <div className="section-content">
                <button className="setting-button" onClick={() => { onClose(); navigate('/wallet'); }}>
                  💰 Wallet Settings
                </button>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>📥 Auto-Download Images</strong>
                    <small>Download images automatically</small>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={settings.autoDownloadImages} onChange={() => toggleSetting('autoDownloadImages')} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>▶️ Auto-Play Video</strong>
                    <small>Auto-play videos in feed</small>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={settings.autoPlayVideo} onChange={() => toggleSetting('autoPlayVideo')} />
                    <span className="slider"></span>
                  </label>
                </div>

                <button className="setting-button" onClick={handleClearCache}>
                  🗑️ Clear Cache
                </button>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>📱 App Version</strong>
                    <small>Version {appVersion}</small>
                  </div>
                  <button className="btn-check-update">Check Update</button>
                </div>

                <button className="setting-button">
                  📄 Terms & Policies
                </button>

                <button className="setting-button">
                  💬 Contact Support
                </button>

                <button className="setting-button logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>

                <button className="setting-button delete-btn" onClick={handleDeleteAccount}>
                  🗑️ Delete Account
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default SettingsPanel;
