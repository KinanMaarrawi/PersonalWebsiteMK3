import { LANGUAGES } from '../i18n.js';
import { useLanguage } from '../useLanguage.js';

export default function LanguageToggle() {
  const { content, language, toggleLanguage } = useLanguage();
  const nextLanguage = language === 'ar' ? LANGUAGES.en : LANGUAGES.ar;

  return (
    <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label={content.languageToggle.ariaLabel}>
      <span className="language-toggle-current">{LANGUAGES[language].shortLabel}</span>
      <span className="language-toggle-divider" aria-hidden="true" />
      <span className="language-toggle-next">{nextLanguage.label}</span>
    </button>
  );
}
