import { useEffect, useState } from 'react';
import { useLanguage } from '../useLanguage.js';
import { useSiteContent } from '../useSiteContent.js';
import { isFxOn } from '../preferences.js';

const BOOT_FLAG_KEY = 'hero_boot_sequence_done_v1';
const BOOT_TEXT = '> system.status: booting';

const readBootFlag = () => {
  try {
    return sessionStorage.getItem(BOOT_FLAG_KEY) === '1';
  } catch {
    return false;
  }
};

const writeBootFlag = () => {
  try {
    sessionStorage.setItem(BOOT_FLAG_KEY, '1');
  } catch {
    // Without storage the boot simply plays again next visit.
  }
};

/** The boot plays once per session, and never with fx off. */
const shouldSkipBoot = () => {
  if (typeof window === 'undefined') return true;
  return readBootFlag() || !isFxOn();
};

export default function Hero() {
  const { content, language } = useLanguage();
  const { settings } = useSiteContent();
  const heroContent = content.hero;
  const role = settings[`hero_role_${language}`];
  const tagline = settings[`hero_tagline_${language}`];
  const [typedCount, setTypedCount] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [bootOnline, setBootOnline] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [revealContent, setRevealContent] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(() => !shouldSkipBoot());

  useEffect(() => {
    if (!scrollLocked) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyTouchAction = body.style.touchAction;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
    };
  }, [scrollLocked]);

  useEffect(() => {
    const timers = [];
    let rafId = 0;
    let finished = false;

    // Jumps straight to the finished state. Used when the boot should not play at
    // all, and when the visitor presses a key, clicks, or tries to scroll mid-boot,
    // so the scroll lock can never trap anyone.
    const finish = () => {
      if (finished) return;
      finished = true;
      for (const timer of timers) window.clearTimeout(timer);
      cancelAnimationFrame(rafId);
      removeSkipListeners();
      setTypedCount(BOOT_TEXT.length);
      setBootOnline(true);
      setShowPanel(true);
      setPanelExpanded(true);
      setRevealContent(true);
      writeBootFlag();
      setScrollLocked(false);
    };

    const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'];
    const removeSkipListeners = () => SKIP_EVENTS.forEach(type => window.removeEventListener(type, finish));

    if (shouldSkipBoot()) {
      finish();
      return undefined;
    }

    SKIP_EVENTS.forEach(type => window.addEventListener(type, finish, { passive: true }));

    const typeText = index => {
      setTypedCount(index);
      if (index < BOOT_TEXT.length) {
        timers.push(window.setTimeout(() => typeText(index + 1), 24));
        return;
      }
      runDots(0, 0);
    };

    const runDots = (step, loopCount) => {
      const nextStep = (step % 3) + 1;
      const nextLoopCount = nextStep === 3 ? loopCount + 1 : loopCount;
      setDotCount(nextStep);

      if (nextLoopCount >= 3) {
        setBootOnline(true);
        timers.push(
          window.setTimeout(() => {
            setShowPanel(true);
            rafId = requestAnimationFrame(() => setPanelExpanded(true));
            timers.push(
              window.setTimeout(() => {
                setRevealContent(true);
                writeBootFlag();
                setScrollLocked(false);
                removeSkipListeners();
                finished = true;
              }, 720)
            );
          }, 480)
        );
        return;
      }

      timers.push(window.setTimeout(() => runDots(nextStep, nextLoopCount), 90));
    };

    typeText(0);

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
      cancelAnimationFrame(rafId);
      removeSkipListeners();
    };
  }, []);

  const scrollToSection = sectionId => event => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bootingLine = `${BOOT_TEXT.slice(0, typedCount)}${typedCount >= BOOT_TEXT.length ? '.'.repeat(dotCount) : ''}`;

  return (
    <section className={`hero-shell ${showPanel ? 'hero-has-panel' : 'hero-boot-mode'}`}>
      <div className="hero-glow" aria-hidden="true" />

      {!showPanel ? (
        <div className="hero-boot-screen">
          <p className="hero-boot-status" aria-live="polite">
            <span className={`hero-boot-line ${bootOnline ? 'is-hidden' : 'is-visible'}`}>{bootingLine}</span>
            <span className={`hero-boot-line ${bootOnline ? 'is-visible' : 'is-hidden'}`}>&gt; system.status: online</span>
          </p>
        </div>
      ) : null}

      <div className="hero-layout">
        {showPanel ? (
          <div className={`hero-panel-shell ${panelExpanded ? 'is-expanded' : ''}`}>
            <p className={`system-kicker hero-kicker hero-reveal-step hero-step-0 ${revealContent ? 'is-revealed' : ''}`}>{heroContent.kicker}</p>

            <div className="hero-panel">
              <div className="hero-panel-grid" aria-hidden="true" />

              <div className="hero-body">
                <div className="hero-left-column">
                  <h1 className={`hero-title hero-reveal-step hero-step-1 ${revealContent ? 'is-revealed' : ''}`}>{heroContent.title}</h1>

                  <p className={`hero-subtitle hero-reveal-step hero-step-2 ${revealContent ? 'is-revealed' : ''}`}>
                    {heroContent.subtitle}
                  </p>

                  <div className="hero-identity">
                    <p className={`hero-name hero-reveal-step hero-step-3 ${revealContent ? 'is-revealed' : ''}`}>{heroContent.name}</p>
                    {role ? (
                      <p className={`hero-role hero-reveal-step hero-step-4 ${revealContent ? 'is-revealed' : ''}`}>{role}</p>
                    ) : null}
                    {tagline ? (
                      <p className={`hero-tagline hero-reveal-step hero-step-4 ${revealContent ? 'is-revealed' : ''}`}>{tagline}</p>
                    ) : null}
                  </div>
                </div>

                <div className={`hero-right-column hero-reveal-step hero-step-5 ${revealContent ? 'is-revealed' : ''}`}>
                  <a className="hero-btn hero-btn-stack" href="#about" onClick={scrollToSection('about')}>
                    {heroContent.buttons.about}
                  </a>
                  <a className="hero-btn hero-btn-stack" href="#experience" onClick={scrollToSection('experience')}>
                    {heroContent.buttons.experience}
                  </a>
                  <a className="hero-btn hero-btn-stack" href="#projects" onClick={scrollToSection('projects')}>
                    {heroContent.buttons.projects}
                  </a>
                  <a className="hero-btn hero-btn-stack" href="#contact" onClick={scrollToSection('contact')}>
                    {heroContent.buttons.contact}
                  </a>
                </div>
              </div>

              <p className={`hero-system hero-reveal-step hero-step-6 ${revealContent ? 'is-revealed' : ''}`}>{heroContent.systemStatus}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
