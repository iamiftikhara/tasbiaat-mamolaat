"use client";

import { useState, useEffect, useContext, createContext } from 'react';
import multilingualConfig from '../config/multilingual.json';

// Create context for multilingual support
const MultilingualContext = createContext();

// Provider component
export const MultilingualProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(multilingualConfig.defaultLanguage);
  const [translations, setTranslations] = useState(multilingualConfig.translations[multilingualConfig.defaultLanguage]);
  const [isRTL, setIsRTL] = useState(multilingualConfig.rtlLanguages.includes(multilingualConfig.defaultLanguage));

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && multilingualConfig.supportedLanguages.includes(savedLanguage)) {
      changeLanguage(savedLanguage);
    }
  }, []);

  // Change language function
  const changeLanguage = (languageCode) => {
    if (!multilingualConfig.supportedLanguages.includes(languageCode)) {
      console.warn(`Language ${languageCode} is not supported`);
      return;
    }

    setCurrentLanguage(languageCode);
    setTranslations(multilingualConfig.translations[languageCode]);
    setIsRTL(multilingualConfig.rtlLanguages.includes(languageCode));
    
    // Save to localStorage
    localStorage.setItem('app-language', languageCode);
    
    // Update document direction and language
    document.documentElement.dir = multilingualConfig.rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  };

  // Get translation function with nested key support
  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof value === 'string' ? value : defaultValue || key;
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return multilingualConfig.languages[currentLanguage];
  };

  // Get font for current language
  const getCurrentFont = (type = 'primary') => {
    return multilingualConfig.fonts[currentLanguage]?.[type] || multilingualConfig.fonts.en[type];
  };

  // Get date format for current language
  const formatDate = (date, format = 'short') => {
    const dateFormat = multilingualConfig.dateFormats[currentLanguage]?.[format] || 
                      multilingualConfig.dateFormats.en[format];
    
    // Simple date formatting - in a real app, you'd use a library like date-fns or moment.js
    const d = new Date(date);
    
    if (format === 'time') {
      return d.toLocaleTimeString(currentLanguage === 'en' ? 'en-US' : 'ur-PK');
    }
    
    return d.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ur-PK');
  };

  // Get number format for current language
  const formatNumber = (number, type = 'decimal') => {
    const numberFormat = multilingualConfig.numberFormats[currentLanguage] || 
                        multilingualConfig.numberFormats.en;
    
    if (type === 'currency') {
      return `${numberFormat.currency}${number.toLocaleString()}`;
    }
    
    return number.toLocaleString();
  };

  const value = {
    currentLanguage,
    translations,
    isRTL,
    supportedLanguages: multilingualConfig.supportedLanguages,
    languages: multilingualConfig.languages,
    colors: multilingualConfig.colors,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    getCurrentFont,
    formatDate,
    formatNumber
  };

  return (
    <MultilingualContext.Provider value={value}>
      {children}
    </MultilingualContext.Provider>
  );
};

// Hook to use multilingual context
export const useMultilingual = () => {
  const context = useContext(MultilingualContext);
  if (!context) {
    throw new Error('useMultilingual must be used within a MultilingualProvider');
  }
  return context;
};

// Higher-order component for class components
export const withMultilingual = (Component) => {
  return function WrappedComponent(props) {
    const multilingual = useMultilingual();
    return <Component {...props} multilingual={multilingual} />;
  };
};

export default useMultilingual;