/**
 * The public content reads, shared by the browser (SiteContentProvider) and the
 * build-time snapshot script. Both must select exactly the same columns in the same
 * order, because the browser compares the live result to the snapshot to decide
 * whether anything changed. Plain JS with no Vite-specific imports so Node can load it.
 */

export const PROJECT_COLUMNS =
  'id, slug, sort_order, title, github_url, live_url, tech, period, image_path, description_en, description_ar, ' +
  'long_description_en, long_description_ar, highlights_en, highlights_ar';

export const ABOUT_COLUMNS =
  'id, slug, sort_order, image_path, image_alt_en, image_alt_ar, body_en, body_ar';

export const EXPERIENCE_COLUMNS =
  'id, kind, branch, ref, title_en, title_ar, org_en, org_ar, start_date, end_date, summary_en, summary_ar, ' +
  'did_en, did_ar, learned_en, learned_ar, tech, project_id';

export const SETTINGS_COLUMNS =
  'email, linkedin_url, github_url, cv_updated_at, stack_items, hero_role_en, hero_role_ar, hero_tagline_en, hero_tagline_ar';

/** Fixed storage path for the CV, uploaded with upsert so its URL never changes. */
export const CV_OBJECT_PATH = 'cv/CV.pdf';

/**
 * Runs every public read. `withSignal` lets the browser attach an AbortSignal;
 * Node passes the query through untouched.
 */
export function fetchPublicContent(client, withSignal = query => query) {
  return Promise.all([
    withSignal(
      client.from('projects').select(PROJECT_COLUMNS).eq('published', true).order('sort_order', { ascending: true })
    ),
    withSignal(
      client.from('about_sections').select(ABOUT_COLUMNS).eq('published', true).order('sort_order', { ascending: true })
    ),
    withSignal(
      client
        .from('experience')
        .select(EXPERIENCE_COLUMNS)
        .eq('published', true)
        .order('start_date', { ascending: false })
        .order('id', { ascending: true })
    ),
    withSignal(client.from('site_settings').select(SETTINGS_COLUMNS).eq('id', 1).maybeSingle())
  ]).then(([projects, about, experience, settings]) => ({ projects, about, experience, settings }));
}
