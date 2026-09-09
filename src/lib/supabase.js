import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True when the app has credentials to reach Supabase at all. The public site is
 * designed to render correctly without them, falling back to bundled content, so
 * a missing .env is a supported state rather than an error.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        // Only the admin entry point signs in. Keeping session persistence off by
        // default would break the OAuth return trip, so it stays on, but the public
        // bundle never imports the auth methods.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

const STORAGE_BUCKET = 'public-assets';

/**
 * Resolves a project's `image_path` to something an <img> can load.
 *
 * Paths beginning with "/" are bundled assets in public/ and are returned as-is;
 * this is how the originally committed project images keep working. Anything else
 * is treated as an object path inside the public storage bucket.
 */
export function resolveAssetUrl(path) {
  if (!path) return null;
  if (path.startsWith('/') || path.startsWith('http')) return path;
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

export { STORAGE_BUCKET };
