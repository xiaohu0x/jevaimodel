# JEV AI Model

Source repository for **[jevaimodel.app](https://jevaimodel.app)**.

A free, browser-based AI classifier playground: describe a situation as JSON **state**, ask a
**typed** question, and get a grounded answer with a confidence value.

| | |
| --- | --- |
| **Live** | https://jevaimodel.app |
| **App** | [`app/`](./app) — Vite + React + Tailwind |
| **Icon** | [`icon.svg`](./icon.svg) · [`icon-512.png`](./icon-512.png) |
| **Cloudflare account** | Wisehackerlarry (`4fdf839cced1a2d3b3ed1c046c7b6c87`) |
| **Pages project** | `jev-ai-model` → `jev-ai-model-cpn.pages.dev` |
| **Edge Worker** | `jev-edge` → binds the custom domain (see below) |
| **D1 database** | `jev-ai-model-db` (`d390bc6b-ebf5-41fd-8d4d-3d75fd5fe31f`) |

---

## Architecture

```
                      ┌──────────────────────────────┐
jevaimodel.app  ─────▶│  Worker  jev-edge            │
www.jevaimodel.app    │  (route: zone/*)             │
                      │   HTTP/www → 301 HTTPS apex  │
                      └───────────────┬──────────────┘
                                      │ proxy
                                      ▼
                      ┌──────────────────────────────┐
                      │  Pages  jev-ai-model         │
                      │  prerendered React + API     │
                      └───────────────┬──────────────┘
                                      │ binding DB
                                      ▼
                      ┌──────────────────────────────┐
                      │  D1  jev-ai-model-db         │
                      │  users · sessions · usage    │
                      └──────────────────────────────┘
```

**Why the edge Worker?** The registry that holds `jevaimodel.app` and the Pages project are in the
same Cloudflare account, but the zone already had a DNS record pointing at an older deployment.
Wrangler's OAuth login does not include DNS permissions, so the domain is bound with a **Worker
route** instead — Cloudflare routes `jevaimodel.app/*` to `jev-edge` before the origin is
contacted, so no DNS change is required. It also canonicalizes HTTP, `www`, and public trailing-slash
URLs before proxying the request to Pages.

---

## Local development

```bash
cd app
npm install
npm run dev          # http://localhost:3000 — UI only, no /api routes
```

To exercise the real `/api/auth/*` routes locally:

```bash
cd app
cp .dev.vars.example .dev.vars     # fill in the Google credentials
npm run db:local                   # create D1 tables in the local database
npm run cf:dev                     # http://localhost:8788 — UI + functions + local D1
```

---

## Deploying

Apply the idempotent D1 schema before deploying code that depends on it:

```bash
cd app
npm run db:remote
npm run deploy        # = build + `wrangler pages deploy` + `wrangler deploy --config edge/`
```

Or separately:

```bash
npm run cf:deploy     # app only (Pages)
npm run edge:deploy   # edge router only (Worker + domain routes)
```

> `wrangler.toml` cannot contain `account_id` for Pages projects. If wrangler picks the wrong
> account, export `CLOUDFLARE_ACCOUNT_ID=4fdf839cced1a2d3b3ed1c046c7b6c87` first.

---

## Google sign-in

Auth is **Google-only**, implemented as Pages Functions:

| Route | File |
| --- | --- |
| `GET /api/auth/google` | `functions/api/auth/google.ts` |
| `GET /api/auth/callback` | `functions/api/auth/callback.ts` |
| `GET /api/auth/me` | `functions/api/auth/me.ts` |
| `POST /api/auth/logout` | `functions/api/auth/logout.ts` |
| `DELETE /api/auth/account` | `functions/api/auth/account.ts` |

Users live in D1 (`users`), sessions in D1 (`sessions`, 30-day `HttpOnly` cookie `jev_sid`).
The authorization-code flow uses PKCE in addition to a short-lived state cookie. Account deletion
removes the user row and every active session in one D1 batch.
`PUBLIC_ORIGIN` (set in `wrangler.toml` → `[vars]`) is used to build the OAuth `redirect_uri`, so
the callback always targets `https://jevaimodel.app` regardless of which host served the request.

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set as Pages secrets. Registered redirect URIs
in Google Cloud Console:

```
https://jevaimodel.app/api/auth/callback
http://localhost:8788/api/auth/callback
```

Rotating the credentials:

```bash
cd app
npx wrangler pages secret put GOOGLE_CLIENT_ID     --project-name=jev-ai-model
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=jev-ai-model
npm run cf:deploy
```

> The OAuth consent screen must be **published** (or the signing-in account added as a test user),
> otherwise Google returns `access_denied` and the app shows the sign-in error banner.

The public OAuth trust pages are available at `/privacy` and `/terms`; both are linked directly from
the sign-in dialog. Security reports use `/.well-known/security.txt`.

---

## Playground usage limits

Limits are enforced in `POST /api/classify` before the paid TypeSafe request is sent:

- Guests receive 3 total runs, tracked by a random `HttpOnly` cookie and a hashed D1 actor key.
- Signed-in users receive 30 runs per UTC day.
- Every actor must wait 10 seconds between accepted requests.

The browser displays the allowance returned by the server; deleting local UI state does not reset
the D1 counter. The implementation intentionally stays lightweight and does not fingerprint devices
or store raw IP addresses.

---

## SEO

- `npm run build` creates the client bundle, an SSR bundle, and prerendered HTML for `/`, `/docs`,
  `/use-cases`, `/examples`, `/privacy`, and `/terms`.
- Route metadata and JSON-LD live in `app/src/lib/seo.ts`; the same source drives prerendering and
  client-side navigation updates.
- A top-level prerendered `404.html` makes unknown Pages routes return a real HTTP 404 instead of the
  SPA homepage fallback.
- Canonical host/scheme/path redirects are enforced by both the Pages middleware and edge Worker.
- `app/public/robots.txt`, `app/public/sitemap.xml`, `app/public/_headers`, and the 1200x630 social
  image are copied into every production build.
- `npm run test:seo` rebuilds and checks route HTML, canonical URLs, structured data, sitemap,
  robots directives, social-image dimensions, 404 behavior, and edge redirects.


## Verification and content maintenance

Use Node.js 24+ and run `cd app && npm run verify` before release. CI runs the same build, type, lint, API-contract, SEO, and DOM-interaction checks. Deployment commands also require these checks to pass.

Current work survives navigation and OAuth in per-tab session storage; Clear resets the saved draft and latest result. Google authentication and TypeSafe classification continue to use Pages Functions and D1. Loopback development callbacks stay on the local origin.

The English blog lives at `/blog`. Article metadata, indexability, and bodies are in `app/src/lib/blog.ts` and `app/src/pages/Blog.tsx`. The build generates static HTML, sitemap entries, and redirects from route metadata. See `docs/seo-research.md` for the source ledger and editorial review provenance.
