import { useEffect, useState } from 'react';
import { useLanguage } from '../useLanguage.js';

const NAV_ITEMS = [
  { id: 'hero', label: 'hero' },
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' }
];

export default function FloatingSystemNav({ heroRef }) {
  const { content } = useLanguage();
  const navContent = content.nav;
  const [isVisible, setIsVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('hero');

  useEffect(() => {
    let ticking = false;

    const updateNavState = () => {
      const heroBottom = heroRef?.current?.getBoundingClientRect().bottom ?? window.innerHeight;
      const nextVisible = window.scrollY > 24 && heroBottom <= 96;
      const sectionProbeY = Math.min(window.innerHeight * 0.38, 360);
      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const lastSectionId = NAV_ITEMS[NAV_ITEMS.length - 1].id;
      const lastSection = document.getElementById(lastSectionId);
      const lastSectionRect = lastSection?.getBoundingClientRect();
      const isAtPageEnd = viewportBottom >= documentHeight - 120;
      const isLastSectionInView =
        lastSectionRect && lastSectionRect.top < window.innerHeight * 0.82 && lastSectionRect.bottom > window.innerHeight * 0.18;
      let nextActiveSection = 'hero';

      if (isAtPageEnd || isLastSectionInView) {
        nextActiveSection = lastSectionId;
      } else {
        for (const item of NAV_ITEMS) {
          const section = document.getElementById(item.id);
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          if (rect.top <= sectionProbeY && rect.bottom > sectionProbeY) {
            nextActiveSection = item.id;
          }
        }
      }

      setIsVisible(prev => (prev === nextVisible ? prev : nextVisible));
      setActiveSectionId(prev => (prev === nextActiveSection ? prev : nextActiveSection));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateNavState);
    };

    const onResize = () => updateNavState();

    updateNavState();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [heroRef]);

  const scrollToSection = sectionId => event => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;
    setActiveSectionId(sectionId);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`floating-system-nav ${isVisible ? 'is-visible' : 'is-hidden'}`} aria-label={navContent.ariaLabel}>
      <p className="floating-system-nav-kicker">
        &gt; <span>{navContent.kicker}</span>
      </p>
      <div className="floating-system-nav-links">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={scrollToSection(item.id)}
            className={`floating-system-nav-link ${activeSectionId === item.id ? 'is-active' : ''}`}
            aria-current={activeSectionId === item.id ? 'true' : undefined}
          >
            {navContent.items[item.id] || item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
