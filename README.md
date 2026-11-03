# Kinan Maarrawi - Personal Portfolio Website (MK3)
*A terminal-inspired personal portfolio built with React and Vite.*

---

## Overview
The goal of this iteration was to simplify the stack, reduce visual noise, and prioritize structure and responsiveness over animation-heavy effects.

The UI is intentionally minimal:
- Boot-style Hero intro
- Terminal command style About section
- Focused Projects grid
- Simple Contact section with direct links (email, LinkedIn, GitHub, CV)

Projects, the CV, and contact links are stored in Supabase and edited from a private `/admin`
page, so adding a project no longer requires a commit. The rest of the site's content stays in
the source. The page always ships with a bundled copy of that content, so it renders correctly
even if the backend is unreachable.

---

## Live Site
[https://kinan.maarrawi.com](https://kinan.maarrawi.com)

---

## Tech Stack
- React 19
- Vite 7
- Hand-written CSS (`src/index.css`) plus styled-components for component-scoped styles
- Supabase (Postgres + Auth + Storage) for editable content
- ESLint 9

Runtime dependencies are deliberately limited to `react`, `react-dom`,
`styled-components`, and `@supabase/supabase-js`.

---

## Project Structure
```text
.
|- public/
|  |- CV.pdf
|  |- 404.html               (static error page, no framework)
|  |- og-image.jpg           (link-preview card)
|  |- robots.txt, sitemap.xml
|  |- project images and profile images (WebP)
|  |- favicons and web manifest
|- admin.html                 (second Vite entry point, served at /admin)
|- netlify.toml
|- scripts/snapshot-content.mjs  (prebuild: bundles a copy of all content + files)
|- supabase/
|  |- migrations/             (schema + RLS policies)
|  |- functions/trigger-rebuild/  (admin "Publish site" -> Netlify build hook)
|- src/
|  |- App.jsx
|  |- main.jsx
|  |- index.css
|  |- SiteContentContext.jsx  (renders the snapshot, then swaps in newer live content)
|  |- content/queries.js      (public reads, shared by the browser and the snapshot script)
|  |- content/snapshot.json   (generated; committed so offline builds still work)
|  |- lib/supabase.js
|  |- admin/                  (admin app, never loaded by the public page)
|  |- assets/fonts/
|  |  |- MundialBlack.otf
|  |- components/
|     |- Hero.jsx
|     |- About.jsx
|     |- Projects.jsx
|     |- ProjectCard.jsx
|     |- Footer.jsx
|     |- GlobalStarfield.jsx
|     |- GlobalCursor.jsx
|     |- FloatingSystemNav.jsx
|- vite.config.js
|- eslint.config.js
|- package.json
```

---

## Architecture / Design Notes
- `App.jsx` composes the page as four sections: `hero`, `about`, `projects`, `contact`.
- Hero runs a one-time session boot sequence (`sessionStorage`) before revealing content.
- `GlobalStarfield` draws a full-page starfield using a single canvas, with frame capping and resize handling.
- Navigation is section-based using anchor scrolling, with a floating nav shown after the hero on desktop.
- Contact is direct: `mailto:` and outbound profile links, with the addresses stored in Supabase.
- All content (projects, About tabs, hero role/tagline, stack, contact links, CV) lives in
  Supabase. `npm run build` first runs `scripts/snapshot-content.mjs`, which writes
  `src/content/snapshot.json` and downloads storage images and the CV into `public/snapshot/`.
- `SiteContentProvider` renders the snapshot immediately, then fetches live content and only
  re-renders the parts that changed since the build. Every failure mode — no credentials,
  network error, 3s timeout, a paused project — leaves the snapshot in place, images included,
  so the backend can never break the site. If Supabase is unreachable at build time the script
  keeps the committed snapshot and the build still succeeds.
- Writes are gated entirely by Postgres Row Level Security, not by application code. The
  publishable key in the bundle is safe by design; `private.is_admin()` is the only gate.
- The admin app is a separate Vite entry point rather than a route, so none of its code is
  downloaded by visitors.

---

## Responsive Strategy
- Layouts use fluid widths, clamp-based sizing, and section-level breakpoints.
- Desktop gets floating section navigation; mobile keeps interaction simpler.
- Motion is reduced where possible with `prefers-reduced-motion` handling, applied
  site-wide rather than per-component.

---

## Accessibility Notes
- A skip link is the first tab stop, bypassing the hero boot sequence.
- Sections live inside `<main>`; contact is the page `<footer>`.
- The about-section command switcher implements the WAI-ARIA tabs pattern, including
  roving tabindex and arrow-key navigation that mirrors correctly under RTL.
- The typing animation is hidden from assistive tech (`aria-hidden`) with the completed
  text exposed once, so screen readers are not re-interrupted on every character.
- Every interactive element has a `:focus-visible` ring.
- Project cards are real links, so they are keyboard-reachable and open in a new tab.

---

## Running Locally
```bash
npm install
cp .env.example .env   # fill in the Supabase project URL and publishable key
npm run dev
```

Without a `.env` the site still runs — it renders the committed snapshot, and `/admin`
reports that it is unconfigured.

---

## Editing Content
Go to `/admin` and sign in with GitHub. The account must have a row in the `admins` table;
everything else is rejected by Row Level Security. From there you can add, edit, reorder,
publish/unpublish and delete projects and About tabs, replace the CV, and change the contact
links, hero role/tagline and tech stack. Changes are live on the next page load — no commit,
no deploy.

**Publish site** (in Site settings) starts a Netlify build so the bundled snapshot catches up
too; until then, a Supabase outage would show the content as of the last build. It needs a
Netlify build hook stored as the `NETLIFY_BUILD_HOOK_URL` secret on the `trigger-rebuild`
Edge Function (Netlify → Site configuration → Build hooks; Supabase → Edge Functions → Secrets).
