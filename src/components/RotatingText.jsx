'use client';

import { forwardRef, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const RotatingText = forwardRef((props, ref) => {
    const {
        texts,
        rotationInterval = 3000,
        staggerDuration = 0.05,
        loop = true,
        auto = true,
        mainClassName,
        boxColor = '#7e3ebe',
        boxPadding = 16,
        textSize = '6em',
        boxHeightMultiplier = 1.2,
        borderRadius = '1em',
        onWidthChange,
    } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [boxWidth, setBoxWidth] = useState(0);
    const measureRef = useRef(null);

    const nextWord = () => {
        const newIndex = (currentIndex + 1) % texts.length;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        if (!auto) return;
        const interval = setInterval(nextWord, rotationInterval);
        return () => clearInterval(interval);
    }, [currentIndex, auto, rotationInterval]);

    // Measure current word width
    useEffect(() => {
        if (measureRef.current) {
            const newWidth = measureRef.current.offsetWidth + boxPadding * 2;
            setBoxWidth(newWidth);
            if (onWidthChange) onWidthChange(newWidth);
        }
    }, [currentIndex, boxPadding, onWidthChange]);

    const currentWord = texts[currentIndex];

    return (
        <div
            className="relative flex items-center justify-start"
            style={{
                height: `calc(${textSize} * ${boxHeightMultiplier})`,
                whiteSpace: 'nowrap',
            }}
        >
            {/* Smooth box growing only to the right */}
            <motion.div
                className="absolute left-0 top-0 z-0"
                style={{
                    height: `calc(${textSize} * ${boxHeightMultiplier})`,
                    backgroundColor: boxColor,
                    borderRadius: borderRadius,
                }}
                animate={{ width: boxWidth }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            {/* Hidden span for measuring word width */}
            <span
                ref={measureRef}
                className="absolute invisible font-bold"
                style={{ fontSize: textSize }}
            >
        {currentWord}
      </span>

            {/* Letters inside the box with smooth position changes */}
            <motion.div
                layout
                className="relative z-10 flex items-center justify-start h-full"
                style={{ width: boxWidth, paddingLeft: boxPadding }}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentIndex}
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-120%' }}
                        className={mainClassName}
                        style={{ fontSize: textSize }}
                    >
                        {currentWord.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: '100%' }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: '-120%' }}
                                transition={{ delay: i * staggerDuration }}
                                className="inline-block"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.span>
                </AnimatePresence>
            </motion.div>
        </div>
    );
});

export default RotatingText;
