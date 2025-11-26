import React, { createContext, useState, useEffect } from 'react';
import safeLocalStorage from '../utils/safeStorage';
import languageData from '../locales/language.json';

const LanguageContext = createContext();

const defaultValue = {
  language: 'en',
  changeLanguage: () => {},
  t: (key) => key,
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = safeLocalStorage.getItem('language');
      if (saved && (saved === 'en' || saved === 'bn' || saved === 'hi')) {
        setLanguage(saved);
      }
    } catch (err) {
      console.error('Error reading language from localStorage:', err);
    }
  }, []);

  const changeLanguage = (lang) => {
    try {
      setLanguage(lang);
      safeLocalStorage.setItem('language', lang);
      // Force re-render for all components
      window.dispatchEvent(new Event('languageChange'));
    } catch (err) {
      console.error('Error saving language to localStorage:', err);
    }
  };

  // Nested key support: t('posts.title') or t('common.back')
  const t = (key) => {
    const keys = key.split('.');
    let value = languageData[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = languageData['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value = { language, changeLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  return context || defaultValue;
}

