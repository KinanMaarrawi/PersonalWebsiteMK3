import { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import Footer from './components/Footer.jsx';
import GlobalCursor from './components/GlobalCursor.jsx';
import GlobalStarfield from './components/GlobalStarfield.jsx';
import FloatingSystemNav from './components/FloatingSystemNav.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import FxToggle from './components/FxToggle.jsx';
import { useLanguage } from './useLanguage.js';

export function App() {
  const heroSectionRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateMatch = event => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateMatch);
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  const { content } = useLanguage();

  return (
    <div className="site-shell">
      <a className="skip-link" href="#about">
        {content.skipLink}
      </a>
      <GlobalStarfield />
      <GlobalCursor />
      <div className="site-controls" dir="ltr">
        <FxToggle />
        <LanguageToggle />
      </div>
      {isDesktop ? <FloatingSystemNav heroRef={heroSectionRef} /> : null}
      <main>
        <section id="hero" ref={heroSectionRef}>
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="experience">
          <Experience />
        </section>
        <section id="projects">
          <Projects />
        </section>
      </main>
      <footer id="contact">
        <Footer />
      </footer>
    </div>
  );
}
