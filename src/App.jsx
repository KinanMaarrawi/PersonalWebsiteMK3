import { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero.jsx';
import About from "@/components/About.jsx";
import Projects from "@/components/Projects.jsx";
import ContactForm from "@/components/ContactForm.jsx";

export function App() {
    const [visibleSection, setVisibleSection] = useState('hero');
    const heroRef = useRef(null);
    const aboutRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5, // Section is considered "in view" when 50% visible
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
        <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh'}}>
            <section
                ref={heroRef}
                className="transition-opacity duration-700 ease-in-out"
                style={{
                    opacity: visibleSection === 'hero' ? 1 : 0,
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                <Hero/> {/* always mounted */}
            </section>

            <section
                ref={aboutRef}
                className="transition-opacity duration-700 ease-in-out"
                style={{
                    opacity: visibleSection === 'about' ? 1 : 0,
                    minHeight: '100vh',
                    background: 'transparent'
                }}
            >
                {visibleSection === 'about' && <About/>}
            </section>

            <Projects/>

            <ContactForm />

        </div>
    );
}