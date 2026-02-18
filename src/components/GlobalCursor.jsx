import { useEffect, useRef } from 'react';

export default function GlobalCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsFinePointer || !cursorRef.current) return undefined;

    const cursor = cursorRef.current;

    const onPointerMove = event => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const onPointerLeave = () => {
      cursor.style.opacity = '0';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <div ref={cursorRef} className="app-cursor" aria-hidden="true" />;
}
