import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English'); // Default to 'English'
  const [darkMode, setDarkMode] = useState(false); // Default to light mode

  return (
    <LanguageContext.Provider value={{ language, setLanguage, darkMode, setDarkMode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);