import { STORAGE_BUCKET, supabase } from '../lib/supabase.js';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Uploads to a UUID-keyed path under `prefix/` so re-uploading never collides. */
export async function uploadImage(prefix, file) {
  const extension = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${prefix}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false });

  if (error) throw error;
  return path;
}

/** Reorders by swapping sort_order between two rows, so gaps never matter. */
export async function swapOrder(table, a, b) {
  const [first, second] = await Promise.all([
    supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id),
    supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id)
  ]);
  return first.error || second.error || null;
}

/** The sort_order that places a new row after every existing one. */
export async function nextSortOrder(table) {
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? 0) + 10;
}
