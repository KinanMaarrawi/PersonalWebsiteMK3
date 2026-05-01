import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY, content } from './i18n.js';
import { LanguageContext } from './languageStore.js';

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && LANGUAGES[storedLanguage]) return storedLanguage;

  const browserLanguage = window.navigator.language?.toLowerCase() || '';
  return browserLanguage.startsWith('ar') ? 'ar' : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const languageMeta = LANGUAGES[language] || LANGUAGES[DEFAULT_LANGUAGE];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = languageMeta.dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, languageMeta.dir]);

  const value = useMemo(
    () => ({
      content: content[language] || content[DEFAULT_LANGUAGE],
      direction: languageMeta.dir,
      language,
      languageMeta,
      setLanguage,
      toggleLanguage: () => setLanguage(current => (current === 'ar' ? 'en' : 'ar'))
    }),
    [language, languageMeta]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
