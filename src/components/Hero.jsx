import { useEffect, useState } from 'react';

const BOOT_FLAG_KEY = 'hero_boot_sequence_done_v1';
const BOOT_TEXT = '> system.status: booting';

export default function Hero() {
  const [typedCount, setTypedCount] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [bootOnline, setBootOnline] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [revealContent, setRevealContent] = useState(false);

  useEffect(() => {
    // Run the boot sequence only once per browser session.
    const seenThisSession = sessionStorage.getItem(BOOT_FLAG_KEY) === '1';
    if (seenThisSession) {
      setTypedCount(BOOT_TEXT.length);
      setBootOnline(true);
      setShowPanel(true);
      setPanelExpanded(true);
      setRevealContent(true);
      return undefined;
    }

    const timers = [];
    let rafId = 0;

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
                sessionStorage.setItem(BOOT_FLAG_KEY, '1');
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
    <section className={`hero-shell min-h-screen ${showPanel ? 'hero-has-panel' : 'hero-boot-mode'}`}>
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
            <p className={`system-kicker hero-kicker hero-reveal-step hero-step-0 ${revealContent ? 'is-revealed' : ''}`}>&gt; system_boot</p>

            <div className="hero-panel">
              <div className="hero-panel-grid" aria-hidden="true" />

              <div className="hero-body">
                <div className="hero-left-column">
                  <h1 className={`hero-title hero-reveal-step hero-step-1 ${revealContent ? 'is-revealed' : ''}`}>أهلاً وسهلاً</h1>

                  <p className={`hero-subtitle hero-reveal-step hero-step-2 ${revealContent ? 'is-revealed' : ''}`}>
                    Greetings - for my non-Arab visitors.
                  </p>

                  <div className="hero-identity">
                    <p className={`hero-name hero-reveal-step hero-step-3 ${revealContent ? 'is-revealed' : ''}`}>Kinan Maarrawi</p>
                    <p className={`hero-role hero-reveal-step hero-step-4 ${revealContent ? 'is-revealed' : ''}`}>CS Student @ UoBD</p>
                  </div>
                </div>

                <div className={`hero-right-column hero-reveal-step hero-step-5 ${revealContent ? 'is-revealed' : ''}`}>
                  <a className="hero-btn hero-btn-stack" href="#about" onClick={scrollToSection('about')}>
                    About
                  </a>
                  <a className="hero-btn hero-btn-stack" href="#projects" onClick={scrollToSection('projects')}>
                    Projects
                  </a>
                  <a className="hero-btn hero-btn-stack" href="#contact" onClick={scrollToSection('contact')}>
                    Contact
                  </a>
                </div>
              </div>

              <p className={`hero-system hero-reveal-step hero-step-6 ${revealContent ? 'is-revealed' : ''}`}>&gt; system.status: online</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
