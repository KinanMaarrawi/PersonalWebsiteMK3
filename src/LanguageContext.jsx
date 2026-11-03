import { useCallback, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY, content } from './i18n.js';
import { LanguageContext } from './languageStore.js';
import { runLanguageWipe } from './languageWipe.js';

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  let storedLanguage = null;
  try {
    storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    // Storage blocked: fall through to the browser language.
  }
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
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Private mode: the choice still applies for this visit.
    }
  }, [language, languageMeta.dir]);

  const toggleLanguage = useCallback(() => {
    const next = language === 'ar' ? 'en' : 'ar';
    const nextDir = LANGUAGES[next].dir;
    runLanguageWipe(nextDir, () => {
      // The wipe snapshots the page after this returns, so the new language (and
      // its direction) must be in the DOM synchronously.
      flushSync(() => setLanguage(next));
      document.documentElement.lang = next;
      document.documentElement.dir = nextDir;
    });
  }, [language]);

  const value = useMemo(
    () => ({
      content: content[language] || content[DEFAULT_LANGUAGE],
      direction: languageMeta.dir,
      language,
      languageMeta,
      setLanguage,
      toggleLanguage
    }),
    [language, languageMeta, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
