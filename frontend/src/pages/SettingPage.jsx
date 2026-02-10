import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SettingPage({ title = 'Settings' }) {
  const navigate = useNavigate();
  
  // Redirect to the proper settings page (SettingsPanel)
  useEffect(() => {
    navigate('/demo-settings');
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <p>Redirecting to settings...</p>
    </div>
  );
}

export default SettingPage;
