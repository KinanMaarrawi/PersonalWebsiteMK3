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

This version is frontend-only, with lightweight interactions and no server-side dependencies.

---

## Live Site
[https://kinan.maarrawi.com](https://kinan.maarrawi.com)

---

## Tech Stack
- React 19
- Vite 7
- Tailwind CSS (via `@tailwindcss/vite`) plus custom CSS
- styled-components (for component-scoped styling in some sections)
- ESLint 9

---

## Project Structure
```text
.
|- public/
|  |- CV.pdf
|  |- project images and profile images
|  |- favicons and web manifest
|- src/
|  |- App.jsx
|  |- main.jsx
|  |- index.css
|  |- assets/fonts/
|  |  |- MundialBlack.otf
|  |- components/
|     |- Hero.jsx
|     |- About.jsx
|     |- Projects.jsx
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
- Contact is static and direct: `mailto:` and outbound profile links. No API or server-side form handling.

---

## Responsive Strategy
- Layouts use fluid widths, clamp-based sizing, and section-level breakpoints.
- Desktop gets floating section navigation; mobile keeps interaction simpler.
- Motion is reduced where possible with `prefers-reduced-motion` handling.

---

## Running Locally
```bash
npm install
npm run dev
```
