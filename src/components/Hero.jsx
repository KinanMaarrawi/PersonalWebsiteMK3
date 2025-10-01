// src/components/Header.jsx
import React from 'react';
import FaultyTerminal from '@/components/FaultyTerminal.jsx';
import ASCIIText from "@/components/ASCIIText.jsx";

const Header = () => (
    <section className="relative w-full h-screen overflow-hidden">
        <FaultyTerminal
            style={{ position: 'absolute', top: 0, left: 0 }}
            scale={1.5}
            gridMul={[2,1]}
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
        />
        <div className="absolute inset-0 flex items-center justify-center z-10 h-full w-full">
            <ASCIIText
            text="Hala!"
            enableWaves={true}
            textColor="#fdf9f3"
            asciiFontSize={12}
            textFontSize={200}
            planeBaseHeight={8}
        />
        </div>

    </section>
);

export default Header;
