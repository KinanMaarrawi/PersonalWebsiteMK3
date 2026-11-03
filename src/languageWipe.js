import { isFxOn } from './preferences.js';

const BAND = 42;

/**
 * Runs `update` (which must apply the new language synchronously) under a
 * directional wipe: a purple scanline sweeps across in the new language's reading
 * direction, and the new page is revealed exactly behind it.
 *
 * Built on the View Transitions API. The root snapshot of the new page is clipped
 * open from one edge (see `html[data-wipe]` in index.css), and a temporary line
 * element gets its own view-transition-name, so the browser animates it from the
 * start edge to the end edge in step with the clip. Without View Transitions, or
 * with fx off, the language simply switches.
 */
export function runLanguageWipe(direction, update) {
  if (!isFxOn() || typeof document.startViewTransition !== 'function') {
    update();
    return;
  }

  const root = document.documentElement;
  const width = window.innerWidth;
  const ltr = direction === 'ltr';

  const line = document.createElement('div');
  line.className = `language-wipe-line is-${direction}`;
  line.setAttribute('aria-hidden', 'true');
  // Leading 1px edge starts on the edge the new language reads from…
  line.style.left = `${ltr ? -(BAND - 1) : width - 1}px`;
  document.body.appendChild(line);
  root.dataset.wipe = direction;

  const transition = document.startViewTransition(() => {
    update();
    // …and ends on the opposite edge.
    line.style.left = `${ltr ? width - (BAND - 1) : -1}px`;
  });

  transition.finished.finally(() => {
    line.remove();
    delete root.dataset.wipe;
  });
}
