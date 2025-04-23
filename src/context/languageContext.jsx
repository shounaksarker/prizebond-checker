'use client';
import { createContext, useState, useContext, useEffect } from 'react';
import en from '@lib/translation/en.json';
import bn from '@lib/translation/bn.json';

const translations = { en, bn };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('bn');
  const [dict, setDict] = useState(translations.bn);

  useEffect(() => {
    setDict(translations[lang]);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
