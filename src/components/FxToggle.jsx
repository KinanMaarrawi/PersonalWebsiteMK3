import { setFx, useFx } from '../preferences.js';
import { useLanguage } from '../useLanguage.js';

export default function FxToggle() {
  const { content } = useLanguage();
  const fxOn = useFx();

  return (
    <button
      type="button"
      className="site-control fx-toggle"
      onClick={() => setFx(!fxOn)}
      aria-pressed={fxOn}
      aria-label={content.fxToggle.ariaLabel}
      title={content.fxToggle.title}
    >
      <span className="site-control-key">fx</span>
      <span className="language-toggle-divider" aria-hidden="true" />
      <span className={fxOn ? 'fx-state is-on' : 'fx-state'}>{fxOn ? 'on' : 'off'}</span>
    </button>
  );
}
