/**
 * Framework-free starfield on a viewport-sized, fixed canvas.
 *
 * Earlier versions sized the canvas to the whole document (at up to 2x DPR) and
 * redrew it 30 times a second, off-screen parts included. Now only the viewport is
 * drawn, and scrolling shifts the field (wrapping around) so the stars still move
 * with the page. The field slowly rotates about the viewport centre as before.
 *
 * public/404.html carries a small standalone copy of this logic because files in
 * public/ are not processed by the build; keep the two visually in step.
 */

/** Stars per px² of the rotating disc; ~28 visible on a 1400×900 viewport. */
const DENSITY = 2.2e-5;
const MIN_STARS = 60;
const MAX_STARS = 260;
/** How far the field moves per px scrolled. 1 would pin stars to the content. */
const PARALLAX = 0.6;
const FRAME_INTERVAL = 1000 / 30;

function createStars(radius) {
  const count = Math.min(MAX_STARS, Math.max(MIN_STARS, Math.round(Math.PI * radius * radius * DENSITY)));
  const stars = [];

  for (let i = 0; i < count; i += 1) {
    const mix = Math.random();
    let size;
    if (mix < 0.72) size = 0.65 + Math.random() * 0.55;
    else if (mix < 0.95) size = 1.2 + Math.random() * 0.7;
    else size = 2 + Math.random() * 0.82;

    const purple = Math.random() < 0.28;
    stars.push({
      // sqrt keeps the disc uniformly filled rather than bunched at the centre.
      orbit: Math.sqrt(Math.random()) * radius,
      angle: Math.random() * Math.PI * 2,
      speed: 0.000025 + Math.random() * 0.00006,
      size,
      purple,
      baseAlpha: purple ? 0.28 + Math.random() * 0.28 : 0.32 + Math.random() * 0.3,
      twinkleAmp: 0.08 + Math.random() * 0.16,
      twinkleSpeed: 0.001 + Math.random() * 0.0018,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }
  return stars;
}

/**
 * Starts drawing into `canvas`. `isAnimated()` is read every frame; call `refresh()`
 * after it changes to restart the loop. Returns `{ stop, refresh }`.
 */
export function startStarfield(canvas, { isAnimated = () => true } = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop() {}, refresh() {} };

  const scene = { width: 0, height: 0, radius: 0, stars: [] };
  let frameId = 0;
  let lastFrame = 0;
  let lastWidth = -1;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    scene.width = Math.max(1, window.innerWidth);
    scene.height = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(scene.width * dpr);
    canvas.height = Math.floor(scene.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Mobile browsers resize the viewport height as the URL bar slides; only a
    // width change (rotation, window resize) reshuffles the field.
    if (scene.width !== lastWidth) {
      lastWidth = scene.width;
      scene.radius = Math.hypot(scene.width, scene.height) * 0.75;
      scene.stars = createStars(scene.radius);
    }
  };

  const draw = (now, advance) => {
    const { width, height, radius } = scene;
    const cx = width / 2;
    const cy = height / 2;
    const span = radius * 2;
    const shift = (window.scrollY * PARALLAX) % span;
    ctx.clearRect(0, 0, width, height);

    for (const star of scene.stars) {
      if (advance) star.angle += star.speed * (1000 / 60);
      const x = cx + Math.cos(star.angle) * star.orbit;
      // Wrap within the disc's bounding band so scrolling never empties the sky.
      let y = cy + Math.sin(star.angle) * star.orbit - shift;
      if (y < cy - radius) y += span;
      if (x < -4 || x > width + 4 || y < -4 || y > height + 4) continue;

      const twinkle = advance ? (Math.sin(now * star.twinkleSpeed + star.twinklePhase) + 1) * 0.5 : 0.5;
      const alpha = Math.min(star.baseAlpha + twinkle * star.twinkleAmp, 0.82);
      ctx.fillStyle = star.purple ? `rgba(185, 149, 236, ${alpha})` : `rgba(248, 246, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = now => {
    frameId = 0;
    if (document.hidden || !isAnimated()) return;
    frameId = requestAnimationFrame(loop);
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;
    draw(now, true);
  };

  /** Draws once, and (re)starts the loop if motion is on. */
  const refresh = () => {
    draw(performance.now(), false);
    if (!frameId && isAnimated() && !document.hidden) frameId = requestAnimationFrame(loop);
  };

  let scrollQueued = false;
  const onScroll = () => {
    // While animating, the loop already picks up the new scroll position.
    if (frameId || scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      scrollQueued = false;
      draw(performance.now(), false);
    });
  };

  const onResize = () => {
    resize();
    refresh();
  };

  resize();
  refresh();
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', refresh);

  const stop = () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', refresh);
  };

  return { stop, refresh };
}
