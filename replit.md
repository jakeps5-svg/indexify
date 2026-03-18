# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Key Routes (fortune-design-funnel)

| Route | Page |
|---|---|
| `/` | Home |
| `/audit` | Free SEO Audit tool (25+ checks, screenshots, backlinks) |
| `/serp-checker` | Google SERP Rank Checker (domain + keyword → position in top 100) |
| `/cape-town` | City landing page — SEO & Google Ads, Western Cape |
| `/johannesburg` | City landing page — SEO & Google Ads, Gauteng |
| `/durban` | City landing page — SEO & Google Ads, KwaZulu-Natal |
| `/services/seo` | SEO service page |
| `/services/google-ads` | Google Ads service page |
| `/pricing` | Pricing packages |
| `/contact` | Contact form (Brevo email) |
| `/blog` | Blog listing |
| `/checkout` | Yoco payment checkout |

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

### `artifacts/fortune-design-funnel` (`@workspace/fortune-design-funnel`)

React + Vite frontend for the Fortune Design marketing agency funnel (fortunedesign.co.za). White/light theme.

**Pages:**
- `/` — Home (hero, stats, services, pricing with Yoco payment buttons, FAQ, CTA)
- `/audit` — Free SEO Audit tool
- `/ads-audit` — Free Google Ads Proposal generator (R500 Yoco inline unlock for full version)
- `/services/seo` — SEO service page
- `/services/google-ads` — Google Ads service page
- `/checkout` — Dedicated checkout page: client details form (name, email, phone, company) + Yoco popup + email confirmation
- `/payment-success` — Post-payment confirmation page
- `/payment-cancelled` — Cancelled/failed payment page

**Key features:**
- Multi-page website crawl for proposal generation (up to 7 pages)
- 14-country support with local currency/CPC rates
- Yoco v1 inline popup payment (`useYocoPopup` hook, `POST /api/charge`)
- Keyword blur/pixelation on locked proposal sections (first 5 visible, rest blurred)
- Unique `FD-XXXXXXXX` unlock tokens generated after payment, saved to DB, emailed to client
- Token validation via `GET /api/validate-token?token=FD-XXXXXXXX`
- WhatsApp floating button (27760597724)
- "Pay R500 with Yoco" → navigates to `/checkout` + "Pay via WhatsApp" + "Enter Code" on proposal unlock section
- Brevo SMTP email: confirmation + unlock token sent to client; internal notification to Fortune Design

**Payments (Yoco):**
- Frontend: `useYocoPopup` hook loads Yoco SDK v1, shows inline popup
- Checkout page: `/checkout?type=proposal|starter|leader&domain=xxx`
- Backend: `POST /api/charge` → charges Yoco → saves purchase to DB → generates `FD-XXXXXXXX` token → sends Brevo email
- R500 (50000 cents) — Full Google Ads Proposal unlock (token emailed)
- R5,500 (550000 cents) — Growth Starter package first month
- R12,500 (1250000 cents) — Market Leader package first month
- Secrets: `YOCO_SECRET_KEY` (server-side), `VITE_YOCO_PUBLIC_KEY` (frontend)

**Email (Brevo SMTP):**
- Provider: Brevo via smtp-relay.brevo.com:587
- Sender: support@indexify.co.za / Fortune Design
- Secrets: `BREVO_SMTP_KEY`
- NOTE: Resend integration was declined by user — Brevo is used instead. Do NOT use Resend.
- Email helper: `artifacts/api-server/src/lib/email.ts`

**Database:**
- `inquiries` table — contact form submissions
- `charges` table — all payment records (chargeId, unlockToken, service, amountInCents, name, email, phone, company, domain)

**WhatsApp number:** 27760597724
**Unlock code (manual):** FortuneD21!@
