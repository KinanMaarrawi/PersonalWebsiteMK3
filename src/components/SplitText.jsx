import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
                       text,
                       className = '',
                       style = {},
                       delay = 100,
                       duration = 0.6,
                       ease = 'power3.out',
                       splitType = 'chars',
                       from = { opacity: 0, y: 40 },
                       to = { opacity: 1, y: 0 },
                       threshold = 0.1,
                       rootMargin = '-100px',
                       textAlign = 'center',
                       tag = 'p',
                       onLetterAnimationComplete
                   }) => {
    const ref = useRef(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        if (document.fonts.status === 'loaded') {
            setFontsLoaded(true);
        } else {
            document.fonts.ready.then(() => setFontsLoaded(true));
        }
    }, []);

    useGSAP(() => {
        if (!ref.current || !text || !fontsLoaded) return;
        const el = ref.current;

        if (el._rbsplitInstance) {
            try { el._rbsplitInstance.revert(); } catch (_) {}
            el._rbsplitInstance = null;
        }

        let targets;
        const splitInstance = new GSAPSplitText(el, {
            type: splitType,
            smartWrap: true,
            autoSplit: splitType === 'lines',
            linesClass: 'split-line',
            wordsClass: 'split-word',
            charsClass: 'split-char',
            reduceWhiteSpace: false,
            onSplit: self => {
                if (splitType.includes('chars') && self.chars.length) targets = self.chars;
                else if (splitType.includes('words') && self.words.length) targets = self.words;
                else if (splitType.includes('lines') && self.lines.length) targets = self.lines;
                else targets = self.chars || self.words || self.lines;

                return gsap.fromTo(targets, { ...from }, {
                    ...to,
                    duration,
                    ease,
                    stagger: delay / 1000,
                    scrollTrigger: {
                        trigger: el,
                        start: `top ${(1 - threshold) * 100}%${rootMargin}`,
                        once: true,
                        fastScrollEnd: true
                    },
                    onComplete: onLetterAnimationComplete,
                    willChange: 'transform, opacity',
                    force3D: true
                });
            }
        });

        el._rbsplitInstance = splitInstance;

        return () => {
            ScrollTrigger.getAll().forEach(st => { if (st.trigger === el) st.kill(); });
            try { splitInstance.revert(); } catch (_) {}
            el._rbsplitInstance = null;
        };
    }, {
        dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded, onLetterAnimationComplete],
        scope: ref
    });

    const combinedStyle = { ...style, textAlign, wordWrap: 'break-word', willChange: 'transform, opacity' };

    const renderTag = () => {
        switch(tag) {
            case 'h1': return <h1 ref={ref} style={combinedStyle} className={className}>{text}</h1>;
            case 'h2': return <h2 ref={ref} style={combinedStyle} className={className}>{text}</h2>;
            case 'h3': return <h3 ref={ref} style={combinedStyle} className={className}>{text}</h3>;
            case 'h4': return <h4 ref={ref} style={combinedStyle} className={className}>{text}</h4>;
            case 'h5': return <h5 ref={ref} style={combinedStyle} className={className}>{text}</h5>;
            case 'h6': return <h6 ref={ref} style={combinedStyle} className={className}>{text}</h6>;
            default: return <p ref={ref} style={combinedStyle} className={className}>{text}</p>;
        }
    };

    return renderTag();
};

export default SplitText;
