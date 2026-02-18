import { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';
import GlobalCursor from './components/GlobalCursor.jsx';
import GlobalStarfield from './components/GlobalStarfield.jsx';
import FloatingSystemNav from './components/FloatingSystemNav.jsx';

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

  return (
    <div className="site-shell">
      <GlobalStarfield />
      <GlobalCursor />
      {isDesktop ? <FloatingSystemNav heroRef={heroSectionRef} /> : null}
      <section id="hero" ref={heroSectionRef}>
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
}
