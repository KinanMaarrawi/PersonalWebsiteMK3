import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { id: 'hero', label: 'hero' },
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' }
];

export default function FloatingSystemNav({ heroRef }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      const heroHeight = heroRef?.current?.offsetHeight || window.innerHeight;
      const nextVisible = window.scrollY > heroHeight;
      setIsVisible(prev => (prev === nextVisible ? prev : nextVisible));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateVisibility);
    };

    const onResize = () => updateVisibility();

    updateVisibility();
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
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`floating-system-nav ${isVisible ? 'is-visible' : 'is-hidden'}`} aria-label="Section navigation">
      <p className="floating-system-nav-kicker">
        &gt; <span>nav</span>
      </p>
      <div className="floating-system-nav-links">
        {NAV_ITEMS.map(item => (
          <a key={item.id} href={`#${item.id}`} onClick={scrollToSection(item.id)} className="floating-system-nav-link">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
