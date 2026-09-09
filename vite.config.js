import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Serves public/404.html for unmatched paths during `vite dev`, mirroring what
 * Netlify does in production.
 *
 * Without this the dev server's history fallback answers every unknown URL with
 * index.html, so the real 404 page can only be seen after deploying — which means
 * it can never be checked while working on it.
 */
function devNotFoundPage() {
  const NOT_FOUND_PAGE = path.resolve(__dirname, 'public/404.html')

  /** The HTML files Vite itself would serve for a given request path. */
  const candidatesFor = pathname => {
    if (pathname === '/') return ['index.html']
    const clean = pathname.replace(/^\/+/, '')
    if (clean.endsWith('.html')) return [clean]
    return [`${clean}.html`, `${clean}/index.html`]
  }

  return {
    name: 'dev-404-page',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (!req.headers.accept?.includes('text/html')) return next()
          if (!fs.existsSync(NOT_FOUND_PAGE)) return next()

          // Vite adds its HTML middlewares *after* plugin post-hooks, so this runs
          // before index.html would have been served. Defer to Vite whenever the
          // request maps to a real document, and only answer for the rest.
          const pathname = (req.url || '/').split('?')[0]
          const resolvable = candidatesFor(pathname).some(
            candidate =>
              fs.existsSync(path.resolve(__dirname, candidate)) ||
              fs.existsSync(path.resolve(__dirname, 'public', candidate))
          )
          if (resolvable) return next()

          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html')
          res.end(fs.readFileSync(NOT_FOUND_PAGE, 'utf-8'))
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // The site is genuinely multi-page (index + admin) with no client-side router,
  // so the SPA history fallback would only mask missing routes.
  appType: 'mpa',
  plugins: [
      react(),
      devNotFoundPage(),
  ],
    resolve: {
      alias: {
          '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        // Two independent entry points. The admin app is a separate document rather
        // than a route, so none of its code reaches the public bundle.
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        },
      },
    },
})
