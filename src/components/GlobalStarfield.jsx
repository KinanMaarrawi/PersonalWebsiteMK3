import { useEffect, useRef } from 'react';

function createStars(width, height) {
  const area = width * height;
  const targetCount = Math.min(380, Math.max(220, Math.round(area / 13000)));
  const stars = [];

  for (let i = 0; i < targetCount; i += 1) {
    const mix = Math.random();
    let radius;
    if (mix < 0.72) radius = 0.65 + Math.random() * 0.55;
    else if (mix < 0.95) radius = 1.2 + Math.random() * 0.7;
    else radius = 2 + Math.random() * 0.82;

    const purple = Math.random() < 0.28;
    const baseAlpha = purple ? 0.28 + Math.random() * 0.28 : 0.32 + Math.random() * 0.3;
    const twinkleAmp = 0.08 + Math.random() * 0.16;

    stars.push({
      orbitRadius: Math.sqrt(Math.random()) * Math.hypot(width, height) * 0.62,
      angle: Math.random() * Math.PI * 2,
      speed: 0.000025 + Math.random() * 0.00006,
      radius,
      purple,
      baseAlpha,
      twinkleAmp,
      twinkleSpeed: 0.001 + Math.random() * 0.0018,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }
  return stars;
}

function drawStars(ctx, width, height, stars, now) {
  const centerX = width / 2;
  const centerY = height / 2;
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    star.angle += star.speed * (1000 / 60);
    const x = centerX + Math.cos(star.angle) * star.orbitRadius;
    const y = centerY + Math.sin(star.angle) * star.orbitRadius;
    const twinkle = (Math.sin(now * star.twinkleSpeed + star.twinklePhase) + 1) * 0.5;
    const alpha = Math.min(star.baseAlpha + twinkle * star.twinkleAmp, 0.82);

    ctx.fillStyle = star.purple ? `rgba(185, 149, 236, ${alpha})` : `rgba(248, 246, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function getDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    window.innerHeight
  );
}

export default function GlobalStarfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = { width: 0, height: 0, dpr: 1, ctx: null, stars: [] };
    let animationId = 0;
    let resizeRafId = 0;
    let lastFrameTime = 0;
    // Cap redraws to reduce CPU usage while keeping motion smooth.
    const frameInterval = 1000 / 30;
    let resizeObserver;

    const setupScene = () => {
      scene.width = Math.max(1, window.innerWidth);
      scene.height = Math.max(1, getDocumentHeight());
      scene.dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(scene.width * scene.dpr);
      canvas.height = Math.floor(scene.height * scene.dpr);
      canvas.style.width = `${scene.width}px`;
      canvas.style.height = `${scene.height}px`;

      scene.ctx = canvas.getContext('2d');
      if (!scene.ctx) return;
      scene.ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
      scene.stars = createStars(scene.width, scene.height);
      drawStars(scene.ctx, scene.width, scene.height, scene.stars, performance.now());
    };

    const animate = now => {
      animationId = requestAnimationFrame(animate);
      if (!scene.ctx) return;
      if (now - lastFrameTime < frameInterval) return;
      lastFrameTime = now;
      drawStars(scene.ctx, scene.width, scene.height, scene.stars, reducedMotion ? 0 : now);
    };

    const queueResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(setupScene);
    };

    setupScene();
    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', queueResize, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(queueResize);
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(resizeRafId);
      window.removeEventListener('resize', queueResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="site-starfield-canvas" aria-hidden="true" />;
}
