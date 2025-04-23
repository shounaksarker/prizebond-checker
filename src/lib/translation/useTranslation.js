'use client';
import { useLanguage } from '../../context/languageContext';
export const useTranslation = () => {
  const { dict } = useLanguage();

  const t = (key) => {
    return dict[key] || key;
  };

  return { t };
};
