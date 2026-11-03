// Starts a Netlify build so the bundled content snapshot catches up with Supabase.
// Admin-only: the caller's JWT is checked by the platform (verify_jwt) and admin
// membership is checked here through RLS, which limits `admins` to the caller's row.
// The build hook URL is a secret (NETLIFY_BUILD_HOOK_URL) and never reaches a browser.
import { createClient } from 'npm:@supabase/supabase-js@2';

const ALLOWED_ORIGINS = new Set(['https://kinan.maarrawi.com', 'http://localhost:5173']);

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://kinan.maarrawi.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin'
  };
}

Deno.serve(async req => {
  const headers = corsHeaders(req.headers.get('Origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers });

  const reply = (status: number, message: string) =>
    new Response(JSON.stringify({ message }), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    auth: { persistSession: false }
  });

  const { data: admin, error } = await client.from('admins').select('user_id').maybeSingle();
  if (error || !admin) return reply(403, 'Not allowed.');

  const hook = Deno.env.get('NETLIFY_BUILD_HOOK_URL');
  if (!hook) return reply(501, 'NETLIFY_BUILD_HOOK_URL is not set on the trigger-rebuild function.');

  const response = await fetch(hook, { method: 'POST' });
  if (!response.ok) return reply(502, `Netlify answered ${response.status}.`);
  return reply(200, 'Build started. The site updates in about a minute.');
});
