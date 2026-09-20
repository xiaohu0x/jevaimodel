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
                      │   www → 301 apex             │
                      └───────────────┬──────────────┘
                                      │ proxy
                                      ▼
                      ┌──────────────────────────────┐
                      │  Pages  jev-ai-model         │
                      │  static SPA + /api/auth/*    │
                      └───────────────┬──────────────┘
                                      │ binding DB
                                      ▼
                      ┌──────────────────────────────┐
                      │  D1  jev-ai-model-db         │
                      │  users · sessions            │
                      └──────────────────────────────┘
```

**Why the edge Worker?** The registry that holds `jevaimodel.app` and the Pages project are in the
same Cloudflare account, but the zone already had a DNS record pointing at an older deployment.
Wrangler's OAuth login does not include DNS permissions, so the domain is bound with a **Worker
route** instead — Cloudflare routes `jevaimodel.app/*` to `jev-edge` before the origin is
contacted, so no DNS change is required. It also folds `www` into the apex with a 301.

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

```bash
cd app
npm run deploy        # = build + `wrangler pages deploy` + `wrangler deploy --config edge/`
```

Or separately:

```bash
npm run cf:deploy     # app only (Pages)
npm run edge:deploy   # edge router only (Worker + domain routes)
```

Apply the D1 schema (once, or after editing `schema.sql`):

```bash
npm run db:remote
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

## SEO

- Static meta (title / description / canonical / OG / Twitter) + JSON-LD (`WebSite`,
  `SoftwareApplication`, `FAQPage`) in `app/index.html`.
- Long-form on-page content (~1.4k words) in `app/src/sections/Content.tsx`.
- `app/public/robots.txt`, `app/public/sitemap.xml`, `app/public/site.webmanifest`.
