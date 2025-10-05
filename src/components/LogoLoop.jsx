import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const ANIMATION_CONFIG = {
    SMOOTH_TAU: 0.25,
    MIN_COPIES: 2,
    COPY_HEADROOM: 2
};

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));
const cx = (...parts) => parts.filter(Boolean).join(' ');

// --- Hook to animate the carousel ---
const useAnimationLoop = (trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover, isPaused) => {
    const rafRef = useRef(null);
    const lastTimestampRef = useRef(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const animate = timestamp => {
            if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
            const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            // Smooth pause/resume
            const target = (pauseOnHover && isHovered) || isPaused ? 0 : targetVelocity;
            const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
            velocityRef.current += (target - velocityRef.current) * easingFactor;

            if (seqWidth > 0) {
                let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
                nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
                offsetRef.current = nextOffset;
                track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastTimestampRef.current = null;
        };
    }, [targetVelocity, seqWidth, isHovered, pauseOnHover, isPaused, trackRef]);
};

// --- LogoLoop Component ---
export const LogoLoop = memo(({
                                  logos,
                                  speed = 120,
                                  direction = 'left',
                                  width = '100%',
                                  logoHeight = 28,
                                  gap = 32,
                                  pauseOnHover = true,
                                  isPaused = false,
                                  fadeOut = false,
                                  scaleOnHover = false,
                                  className,
                                  style,
                                  ariaLabel = 'Partner logos',
                              }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const targetVelocity = useMemo(() => {
        const dir = direction === 'left' ? 1 : -1;
        return speed * dir;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const sequenceWidth = seqRef.current?.getBoundingClientRect()?.width ?? 0;
        if (sequenceWidth > 0) {
            setSeqWidth(Math.ceil(sequenceWidth));
            const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
            setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
    }, []);

    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [updateDimensions, logos, gap, logoHeight]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover, isPaused);

    const logoLists = useMemo(() => {
        return Array.from({ length: copyCount }, (_, copyIndex) => (
            <ul
                key={`copy-${copyIndex}`}
                ref={copyIndex === 0 ? seqRef : undefined}
                className="flex items-center"
                role="list"
                aria-hidden={copyIndex > 0}
            >
                {logos.map((item, itemIndex) => (
                    <li
                        key={`${copyIndex}-${itemIndex}`}
                        className="flex-none mr-[var(--logoloop-gap)]"
                    >
                        {item.node ? item.node : <img src={item.src} alt={item.alt} />}
                    </li>
                ))}
            </ul>
        ));
    }, [copyCount, logos]);

    const handleMouseEnter = useCallback(() => pauseOnHover && setIsHovered(true), [pauseOnHover]);
    const handleMouseLeave = useCallback(() => pauseOnHover && setIsHovered(false), [pauseOnHover]);

    return (
        <div
            ref={containerRef}
            className={cx('relative overflow-x-hidden group', className)}
            style={{ width, '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px`, ...style }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="region"
            aria-label={ariaLabel}
        >
            {fadeOut && (
                <>
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[clamp(24px,8%,120px)] bg-gradient-to-r from-black to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[clamp(24px,8%,120px)] bg-gradient-to-l from-black to-transparent" />
                </>
            )}
            <div className="flex w-max will-change-transform" ref={trackRef}>
                {logoLists}
            </div>
        </div>
    );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;
