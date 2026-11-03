import { useEffect, useRef } from 'react';
import { startStarfield } from '../lib/starfield.js';
import { isFxOn, useFx } from '../preferences.js';

export default function GlobalStarfield() {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  const fxOn = useFx();

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    fieldRef.current = startStarfield(canvasRef.current, { isAnimated: isFxOn });
    return () => fieldRef.current.stop();
  }, []);

  // Toggling fx freezes the field on its current frame or sets it moving again.
  useEffect(() => {
    fieldRef.current?.refresh();
  }, [fxOn]);

  return <canvas ref={canvasRef} className="site-starfield-canvas" aria-hidden="true" />;
}
