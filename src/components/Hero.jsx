import React, { useState, useEffect } from 'react';
import FaultyTerminal from '@/components/FaultyTerminal.jsx';
import ASCIIText from "@/components/ASCIIText.jsx";

/**
 * Header Component
 *
 * Displays a full-screen header with a glitchy terminal background and animated ASCII text.
 * The ASCII text adjusts its font size and layout based on screen width.
 *
 * Uses:
 * - FaultyTerminal: animated glitchy terminal background
 * - ASCIIText: animated text with wave effects
 */
const Header = () => {
    const [screenSize, setScreenSize] = useState('lg'); // sm, md, lg, xl, 2xl

    /**
     * Effect: Detect screen size on load and on resize.
     * Updates the `screenSize` state according to Tailwind-like breakpoints.
     */
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width < 768) setScreenSize('sm');       // Tailwind sm
            else if (width < 1024) setScreenSize('md'); // Tailwind md
            else if (width < 1280) setScreenSize('lg'); // Tailwind lg
            else if (width < 1536) setScreenSize('xl'); // Tailwind xl
            else setScreenSize('2xl');                  // Tailwind 2xl+
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // --- Responsive sizing for ASCII text ---
    let asciiFontSize, textFontSize, planeBaseHeight;

    switch (screenSize) {
        case 'sm':
            asciiFontSize = 6;
            textFontSize = 200;
            planeBaseHeight = 15;
            break;
        case 'md':
            asciiFontSize = 10;
            textFontSize = 80;
            planeBaseHeight = 5;
            break;
        case 'lg':
            asciiFontSize = 12;
            textFontSize = 90;
            planeBaseHeight = 6;
            break;
        case 'xl':
            asciiFontSize = 14;
            textFontSize = 100;
            planeBaseHeight = 7;
            break;
        case '2xl':
            asciiFontSize = 16;
            textFontSize = 120;
            planeBaseHeight = 8;
            break;
        default:
            asciiFontSize = 15;
            textFontSize = 100;
            planeBaseHeight = 8;
    }

    return (
        <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center">
            {/* --- Background glitchy terminal --- */}
            <FaultyTerminal
                style={{ position: 'absolute', top: 0, left: 0 }}
                scale={1.5}
                gridMul={[2, 1]}
                digitSize={1.5}
                timeScale={0.6}
                pause={false}
                scanlineIntensity={1}
                glitchAmount={1}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={0}
                dither={0}
                curvature={0.3}
                tint="#7c3abd"
                mouseReact={true}
                mouseStrength={0.5}
                pageLoadAnimation={true}
                brightness={0.6}
                bottomFade={1.0}
            />

            {/* --- Animated ASCII Text --- */}
            {screenSize === 'sm' ? (
                <>
                    {/* Split lines for small screens */}
                    <div className="absolute top-1/4 w-full h-1/4 flex justify-center items-center">
                        <ASCIIText
                            key="line1"
                            text="اهلا"
                            enableWaves={true}
                            textColor="#fdf9f3"
                            asciiFontSize={asciiFontSize}
                            textFontSize={textFontSize}
                            planeBaseHeight={planeBaseHeight}
                        />
                    </div>
                    <div className="absolute top-2/4 w-full h-1/4 flex justify-center items-center">
                        <ASCIIText
                            key="line2"
                            text="*وسهلا"
                            enableWaves={true}
                            textColor="#fdf9f3"
                            asciiFontSize={asciiFontSize}
                            textFontSize={textFontSize}
                            planeBaseHeight={planeBaseHeight}
                        />
                    </div>
                </>
            ) : (
                // Single line for larger screens
                <ASCIIText
                    key={screenSize}
                    text="*اهلا وسهلا"
                    enableWaves={true}
                    textColor="#fdf9f3"
                    asciiFontSize={asciiFontSize}
                    textFontSize={textFontSize}
                    planeBaseHeight={planeBaseHeight}
                    className="absolute inset-0"
                />
            )}

            {/* --- English greeting --- */}
            <p
                className="absolute w-full text-center text-[#fdf9f3] text-xl sm:text-2xl md:text-3xl"
                style={{ fontFamily: 'MundialBlack', bottom: '15%' }}
            >
                *Greetings, for my English speakers
            </p>
        </section>
    );
};

export default Header;
