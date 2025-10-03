// src/components/Header.jsx
import React from 'react';
import FaultyTerminal from '@/components/FaultyTerminal.jsx';
import ASCIIText from "@/components/ASCIIText.jsx";

const Header = () => (
    <section className="relative w-full h-screen overflow-hidden">
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

        {/* ASCIIText takes full hero space */}
        <ASCIIText
            text="*اهلا وسهلا"
            enableWaves={true}
            textColor="#fdf9f3"
            asciiFontSize={15}
            textFontSize={100}
            planeBaseHeight={8}
            className="absolute inset-0"
        />

        {/* English text below ASCIIText, positioned absolutely */}
        <p
            className="absolute w-full text-center text-[#fdf9f3] text-3xl"
            style={{ fontFamily: 'MundialBlack', bottom: '15%' }}
        >
            *Greetings, for my English speakers
        </p>
    </section>
);

export default Header;
