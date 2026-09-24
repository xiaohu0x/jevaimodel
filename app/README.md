# JEV AI Model app

Use Node.js 24 or later and `npm ci` to install the locked dependencies.

- `npm run dev`: Vite UI development, without API routes.
- `npm run cf:dev`: build static pages and run Cloudflare Pages Functions with local D1.
- `npm run verify`: production build, Functions type check, lint, Node tests, and DOM interaction tests.
- `npm run preview`: inspect the production frontend at the URL Vite prints.

Copy `.dev.vars.example` to `.dev.vars` and fill in local credentials for authentication and real classification. The Google callback must be registered for `http://localhost:8788/api/auth/callback`. Run `npm run db:local` before using the local account endpoints. Never commit credentials.

Classification calls `/api/classify`, which validates input, reserves server-side allowance, and calls TypeSafe. Shared request and answer checks live in `shared/classification.ts`. Failed or cancelled requests may already have reached the paid upstream, so the client refreshes server allowance after cancellation instead of inventing a refund.

Drafts and the latest result use per-tab session storage. Clear resets persisted work. Authentication status and usage come from the server; stored drafts never grant allowance.

## Content

Route metadata lives in `src/lib/seo.ts`; blog metadata in `src/lib/blog.ts`; article bodies in `src/pages/Blog.tsx`. The prerender step emits complete HTML, sitemap entries, and canonical redirects from the route registry. Blog content loads in a separate client chunk. `indexable` controls article sitemap inclusion and robots metadata. Research, sources, and review limitations are recorded in `../docs/seo-research.md`.

Run `npm run verify` after content or routing changes. Deployment commands run the same checks before publishing. The CI workflow only verifies; it does not deploy.
