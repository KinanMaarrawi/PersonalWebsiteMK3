/**
 * Build-time content snapshot (runs as `prebuild`).
 *
 * Pulls every published row from Supabase and writes src/content/snapshot.json,
 * which the site renders first and falls back to whenever Supabase is unreachable.
 * Storage images and the CV are downloaded into public/snapshot/ so a paused project
 * cannot break those either.
 *
 * This script never fails the build. If Supabase cannot be reached, or any download
 * fails, it leaves the previously committed snapshot untouched and logs a warning.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { CV_OBJECT_PATH, fetchPublicContent } from '../src/content/queries.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT_JSON = path.join(ROOT, 'src/content/snapshot.json');
const ASSET_DIR = path.join(ROOT, 'public/snapshot');
const STORAGE_BUCKET = 'public-assets';
const TIMEOUT_MS = 15000;

/** Netlify provides real env vars; locally fall back to reading .env. */
async function loadEnv() {
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) return;
  try {
    const raw = await fs.readFile(path.join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    // No .env: handled below as "not configured".
  }
}

const isStoragePath = value => Boolean(value) && !value.startsWith('/') && !value.startsWith('http');

async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  await loadEnv();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('[snapshot] Supabase not configured; keeping the committed snapshot.');
    return;
  }

  const client = createClient(url, key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) }) }
  });

  const { projects, about, experience, settings } = await fetchPublicContent(client);
  const failure = projects.error || about.error || experience.error || settings.error;
  if (failure) throw new Error(failure.message);
  if (!settings.data) throw new Error('site_settings row is missing');

  // Fetch everything into memory first, so a failed download leaves the old
  // snapshot intact rather than half-replaced.
  const publicUrl = objectPath => `${url}/storage/v1/object/public/${STORAGE_BUCKET}/${objectPath}`;
  const imagePaths = [...projects.data, ...about.data].map(row => row.image_path).filter(isStoragePath);
  const files = new Map();
  for (const objectPath of new Set(imagePaths)) files.set(objectPath, await download(publicUrl(objectPath)));
  if (settings.data.cv_updated_at) files.set(CV_OBJECT_PATH, await download(publicUrl(CV_OBJECT_PATH)));

  await fs.rm(ASSET_DIR, { recursive: true, force: true });
  const assets = {};
  for (const [objectPath, buffer] of files) {
    const target = path.join(ASSET_DIR, objectPath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, buffer);
    assets[objectPath] = `/snapshot/${objectPath}`;
  }

  const snapshot = {
    projects: projects.data,
    about: about.data,
    experience: experience.data,
    settings: settings.data,
    assets
  };
  await fs.writeFile(SNAPSHOT_JSON, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `[snapshot] ${projects.data.length} projects, ${about.data.length} about sections, ` +
      `${experience.data.length} experience entries, ${files.size} files.`
  );
}

main().catch(error => {
  console.warn(`[snapshot] Could not refresh (${error.message}); keeping the committed snapshot.`);
});
