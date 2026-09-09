import { useEffect, useMemo, useState } from 'react';
import { SiteContentContext } from './siteContentStore.js';
import { FALLBACK_PROJECTS, FALLBACK_SETTINGS } from './content/fallback.js';
import { isSupabaseConfigured, supabase, STORAGE_BUCKET } from './lib/supabase.js';

/** Give up on the network and render bundled content after this long. */
const FETCH_TIMEOUT_MS = 3000;

/** Fixed storage path for the CV, uploaded with upsert so the URL never changes. */
const CV_OBJECT_PATH = 'cv/CV.pdf';

/**
 * Builds the public CV link. Falls back to the committed PDF when nothing has been
 * uploaded yet. `cv_updated_at` is appended as a cache-buster so replacing the file
 * is visible immediately despite the CDN caching the unchanged URL.
 */
function buildCvUrl(cvUpdatedAt) {
  if (!cvUpdatedAt) return FALLBACK_SETTINGS.cv_url;

  const base = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${CV_OBJECT_PATH}`;
  return `${base}?v=${new Date(cvUpdatedAt).getTime()}`;
}

export function SiteContentProvider({ children }) {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'fallback');

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let cancelled = false;

    async function loadContent() {
      const [projectsResult, settingsResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id, sort_order, published, title, github_url, tech, image_path, description_en, description_ar')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .abortSignal(controller.signal),
        supabase
          .from('site_settings')
          .select('email, linkedin_url, github_url, cv_updated_at')
          .eq('id', 1)
          .maybeSingle()
          .abortSignal(controller.signal)
      ]);

      if (cancelled) return;

      // Each half degrades on its own: a failed settings read should not discard
      // projects that loaded fine.
      if (projectsResult.data?.length) setProjects(projectsResult.data);
      if (settingsResult.data) {
        setSettings({ ...settingsResult.data, cv_url: buildCvUrl(settingsResult.data.cv_updated_at) });
      }

      const anyFailure = projectsResult.error || settingsResult.error;
      setStatus(anyFailure ? 'fallback' : 'live');
    }

    loadContent()
      .catch(() => {
        // Network failure, abort, or an unreachable project: the bundled content
        // already in state is a correct page, so this is not surfaced to visitors.
        if (!cancelled) setStatus('fallback');
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const value = useMemo(() => ({ projects, settings, status }), [projects, settings, status]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}
