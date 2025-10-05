import { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero.jsx';
import About from "@/components/About.jsx";
import Projects from "@/components/Projects.jsx";
import Footer from "@/components/Footer.jsx";

/**
 * App Component
 *
 * Main container for the portfolio website.
 * Handles:
 * - Section visibility tracking via IntersectionObserver
 * - Smooth opacity transitions between sections
 * - Always mounts Hero for animation, lazy-mounts About
 * - Renders Projects and Footer
 */
export function App() {
    const [visibleSection, setVisibleSection] = useState('hero'); // Tracks which section is currently visible
    const heroRef = useRef(null);
    const aboutRef = useRef(null);

    /**
     * IntersectionObserver tracks which section is in view.
     * Threshold 0.5: section is considered visible when 50% in viewport
     */
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === heroRef.current) {
                        setVisibleSection('hero');
                    } else if (entry.target === aboutRef.current) {
                        setVisibleSection('about');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (heroRef.current) observer.observe(heroRef.current);
        if (aboutRef.current) observer.observe(aboutRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
            {/* Hero Section: always mounted for animation continuity */}
            <section
                ref={heroRef}
                className="transition-opacity duration-700 ease-in-out"
                style={{
                    opacity: visibleSection === 'hero' ? 1 : 0,
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                <Hero />
            </section>

            {/* About Section: lazy mounts for performance */}
            <section
                ref={aboutRef}
                className="transition-opacity duration-700 ease-in-out"
                style={{
                    opacity: visibleSection === 'about' ? 1 : 0,
                    minHeight: '100vh',
                    background: 'transparent'
                }}
            >
                {visibleSection === 'about' && <About />}
            </section>

            {/* Projects Section: always mounted */}
            <Projects />

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
