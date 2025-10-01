// src/Background.jsx
import React from 'react';
import FaultyTerminal from '@/components/FaultyTerminal.jsx';

const Background = ({
                        width = '100%',
                        height = '600px',
                        scale = 1.5,
                        gridMul = [2, 1],
                        digitSize = 1.5,
                        timeScale = 0.6,
                        pause = false,
                        scanlineIntensity = 1,
                        glitchAmount = 1,
                        flickerAmount = 1,
                        noiseAmp = 1,
                        chromaticAberration = 0,
                        dither = 0,
                        curvature = 0.3,
                        tint = '#7c3abd',
                        mouseReact = true,
                        mouseStrength = 0.5,
                        pageLoadAnimation = true,
                        brightness = 0.6,
                    }) => {
    return (
        <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
            <FaultyTerminal
                scale={scale}
                gridMul={gridMul}
                digitSize={digitSize}
                timeScale={timeScale}
                pause={pause}
                scanlineIntensity={scanlineIntensity}
                glitchAmount={glitchAmount}
                flickerAmount={flickerAmount}
                noiseAmp={noiseAmp}
                chromaticAberration={chromaticAberration}
                dither={dither}
                curvature={curvature}
                tint={tint}
                mouseReact={mouseReact}
                mouseStrength={mouseStrength}
                pageLoadAnimation={pageLoadAnimation}
                brightness={brightness}
            />
        </div>
    );
};

export default Background;
