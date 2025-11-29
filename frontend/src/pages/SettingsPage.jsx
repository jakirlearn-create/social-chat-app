import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './SettingsPage.css';

function SettingsPage() {
  const { language, changeLanguage, t } = useLanguage();

  const handleBack = () => {
    try {
      window.history.pushState({}, '', '/home');
      window.location.href = '/home';
    } catch (err) {
      window.location.href = '/home';
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <button className="back-btn" onClick={handleBack}>
          ← {t('back')}
        </button>

        <h1>{t('settings')}</h1>

        <div className="settings-section">
          <h2>{t('language')}</h2>
          <div className="language-options">
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              🇬🇧 {t('english')}
            </button>
            <button
              className={`lang-btn ${language === 'bn' ? 'active' : ''}`}
              onClick={() => changeLanguage('bn')}
            >
              🇧🇩 {t('bengali')}
            </button>
          </div>
        </div>

        <div className="settings-info">
          <p>Current Language: <strong>{language === 'en' ? 'English' : 'বাংলা'}</strong></p>
          <p>Your language preference has been saved.</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
