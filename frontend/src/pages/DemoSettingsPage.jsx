import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import safeLocalStorage from "../utils/safeStorage";

function DemoSettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Persist dark mode setting using safeLocalStorage to avoid unused-var ESLint warning
    try {
      safeLocalStorage.setItem('demo_darkMode', darkMode ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={"profile-page " + (darkMode ? "dark" : "light")}>
      <div className={"settings-drawer " + (showSettings ? "open" : "")}>
        <div className="drawer-header">
          <h2>Settings</h2>
          <button className="btn-close" onClick={() => setShowSettings(false)}>
            
          </button>
        </div>

        <div className="drawer-content">
          <div className="settings-section">
            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-icon">
                  {darkMode ? "" : ""}
                </span>
                <span>Dark Mode</span>
              </div>
              <button
                className={"toggle-switch " + (darkMode ? "on" : "off")}
                onClick={handleToggleDarkMode}
              >
                <div className="toggle-knob"></div>
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-title">Notifications</div>
            <button className="setting-item">
              <span className="setting-icon"></span>
              <span>System Notification Settings</span>
            </button>
          </div>

          <div className="settings-section">
            <div className="section-title">Sync & Backup</div>
            <button className="setting-item" onClick={() => navigate("/sync-google")}>
              <span className="setting-icon"></span>
              <span>Google Drive Sync</span>
            </button>
          </div>

          <div className="settings-section">
            <div className="section-title">Account & Security</div>
            <button className="setting-item" onClick={() => navigate("/change-email")}>
              <span className="setting-icon"></span>
              <span>Change Email</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/change-phone")}>
              <span className="setting-icon"></span>
              <span>Change Phone Number</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/change-password")}>
              <span className="setting-icon"></span>
              <span>Change Password</span>
            </button>
          </div>

          <div className="settings-section">
            <button className="setting-item" onClick={() => navigate("/privacy")}>
              <span className="setting-icon"></span>
              <span>Privacy & Security</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/blocked-users")}>
              <span className="setting-icon"></span>
              <span>Blocked Users</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/activity-log")}>
              <span className="setting-icon"></span>
              <span>Activity Log</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/language")}>
              <span className="setting-icon"></span>
              <span>Language</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/help")}>
              <span className="setting-icon"></span>
              <span>Help & Support</span>
            </button>
            <button className="setting-item" onClick={() => navigate("/about")}>
              <span className="setting-icon">ℹ</span>
              <span>About App</span>
            </button>
          </div>

          <div className="settings-section">
            <button className="setting-item logout" onClick={() => navigate("/login")}>
              <span className="setting-icon"></span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {showSettings && (
          <div
            className="drawer-overlay"
            onClick={() => setShowSettings(false)}
          ></div>
        )}
      </div>

      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Settings Drawer Demo</h1>
        <p> See the Settings Drawer on the right side</p>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          {showSettings ? "Close Drawer" : "Open Drawer"}
        </button>
      </div>
    </div>
  );
}

export default DemoSettingsPage;
