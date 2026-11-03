import { useSyncExternalStore } from 'react';

/**
 * The visitor's "fx" preference: motion, the custom cursor and the decorative
 * animations, all switched together.
 *
 * The source of truth is `data-fx` on <html>, which the inline script in index.html
 * (and public/404.html) sets before first paint from localStorage, defaulting to
 * "off" when the OS asks for reduced motion. CSS keys off the attribute directly;
 * components read it through useFx().
 */
export const FX_STORAGE_KEY = 'site_fx_v1';

const listeners = new Set();

export function isFxOn() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.fx !== 'off';
}

export function setFx(on) {
  document.documentElement.dataset.fx = on ? 'on' : 'off';
  try {
    localStorage.setItem(FX_STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Storage can throw in private mode; the choice still applies to this page.
  }
  listeners.forEach(listener => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFx() {
  return useSyncExternalStore(subscribe, isFxOn, () => false);
}
