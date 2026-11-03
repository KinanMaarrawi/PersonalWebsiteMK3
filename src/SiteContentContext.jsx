import { useEffect, useMemo, useState } from 'react';
import { SiteContentContext } from './siteContentStore.js';
import snapshot from './content/snapshot.json';
import { CV_OBJECT_PATH, fetchPublicContent } from './content/queries.js';
import { isSupabaseConfigured, supabase, STORAGE_BUCKET } from './lib/supabase.js';

/** Give up on the network and keep the bundled snapshot after this long. */
const FETCH_TIMEOUT_MS = 3000;

/** The CV committed to public/, used only if no CV has ever been uploaded. */
const COMMITTED_CV_URL = '/CV.pdf';

/**
 * Live CV link. `cv_updated_at` is a cache-buster so a replaced file shows up
 * immediately despite the CDN caching the unchanged URL.
 */
function liveCvUrl(cvUpdatedAt) {
  if (!cvUpdatedAt) return COMMITTED_CV_URL;
  const base = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${CV_OBJECT_PATH}`;
  return `${base}?v=${new Date(cvUpdatedAt).getTime()}`;
}

/**
 * The snapshot's rows reference storage paths; swap those for the copies the build
 * downloaded into public/snapshot/, so nothing in the initial render depends on
 * Supabase being up.
 */
const localiseRows = rows =>
  rows.map(row => (snapshot.assets[row.image_path] ? { ...row, image_path: snapshot.assets[row.image_path] } : row));

const INITIAL = {
  projects: localiseRows(snapshot.projects),
  about: localiseRows(snapshot.about),
  experience: snapshot.experience || [],
  settings: {
    ...snapshot.settings,
    cv_url: snapshot.assets[CV_OBJECT_PATH] || (snapshot.settings.cv_updated_at ? liveCvUrl(snapshot.settings.cv_updated_at) : COMMITTED_CV_URL)
  }
};

const sameAs = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function SiteContentProvider({ children }) {
  const [projects, setProjects] = useState(INITIAL.projects);
  const [about, setAbout] = useState(INITIAL.about);
  const [experience, setExperience] = useState(INITIAL.experience);
  const [settings, setSettings] = useState(INITIAL.settings);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let cancelled = false;

    fetchPublicContent(supabase, query => query.abortSignal(controller.signal))
      .then(live => {
        if (cancelled) return;

        // Each part degrades on its own, and only replaces the snapshot when the
        // content actually changed since the last build. Identical content keeps the
        // locally served copies and avoids re-rendering (and re-typing) anything.
        if (!live.projects.error && !sameAs(live.projects.data, snapshot.projects)) setProjects(live.projects.data);
        if (!live.about.error && !sameAs(live.about.data, snapshot.about)) setAbout(live.about.data);
        if (!live.experience.error && !sameAs(live.experience.data, INITIAL.experience)) setExperience(live.experience.data);
        if (!live.settings.error && live.settings.data && !sameAs(live.settings.data, snapshot.settings)) {
          setSettings({ ...live.settings.data, cv_url: liveCvUrl(live.settings.data.cv_updated_at) });
        }
      })
      .catch(() => {
        // Network failure, abort, or a paused project: the snapshot already in state
        // is a correct, complete page, so there is nothing to do.
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const value = useMemo(
    () => ({ projects, about, experience, settings }),
    [projects, about, experience, settings]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}
