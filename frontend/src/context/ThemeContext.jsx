import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    const savedFontSize = localStorage.getItem('appFontSize') || 'medium';
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';

    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setLanguage(savedLanguage);

    // Apply theme to body
    document.body.className = `theme-${savedTheme} font-${savedFontSize}`;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    document.body.className = `theme-${newTheme} font-${fontSize}`;
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('appFontSize', size);
    document.body.className = `theme-${theme} font-${size}`;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const getFontScale = () => {
    const scales = { small: 0.8, medium: 1.0, large: 1.3 };
    return scales[fontSize] || 1.0;
  };

  const value = {
    theme,
    fontSize,
    language,
    toggleTheme,
    changeFontSize,
    changeLanguage,
    getFontScale,
    isDark: theme === 'dark'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
