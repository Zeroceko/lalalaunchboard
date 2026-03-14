# Lalalaunchboard

Lalalaunchboard is a web application for indie builders who want a structured system for pre-launch execution, progress tracking, post-launch routines, and reporting.

Prep, launch, and grow — all on one board.

## Source of Truth

The official project specs live in [`specs/`](./specs):

- `specs/requirements.md`
- `specs/design.md`
- `specs/tasks.md`

These files are the source of truth for product scope, architecture, and implementation order.

## Current Status

The codebase currently includes:

- Next.js 14 App Router foundation
- Tailwind setup
- Supabase and Contentful client scaffolding
- Auth UI shell with register/login flows
- Auth API routes for sign-up, sign-in, and sign-out
- Supabase migrations for core app data and RLS
- Local Supabase smoke test for auth sync and ownership policies
- Protected app shell with dashboard and new app flows
- `apps` CRUD endpoints with plan-limit enforcement
- CMS fallback content plus Contentful-backed API routes
- First checklist screen with progress, countdown, and toggle flow
- Deliverable routes plus item detail panel for link, note, and file-first workflow
- Post-launch routine screen with weekly log tracking
- Markdown and PDF export flow for workspace reports
- Middleware-protected app routes and smarter auth redirects
- Global toast notifications plus workspace section navigation
- First visible frontend pass across landing, auth, dashboard, new-app, and workspace screens
- Property-based test foundation with `vitest` and `fast-check`
- Docker-based dev/test workflow

## Project Structure

- `app/` - Next.js routes and API handlers
- `components/` - UI building blocks
- `lib/` - shared helpers and integration clients
- `types/` - shared TypeScript types
- `specs/` - official project specifications
- `vault/` - Obsidian-friendly working memory, decisions, and dev notes
- `HANDOFF.md` - current project state and next recommended steps

## Local Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in the required environment variables
3. Install dependencies:

```bash
npm install
```

4. Start the app locally:

```bash
npm run dev
```

## Docker Workflow

Start the dev container:

```bash
docker compose up web
```

Run the containerized verification flow:

```bash
docker compose run --rm web-test
```

This test service runs:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Test Workflow

Run the property-based test suite:

```bash
npm run test:properties
```

Current property coverage includes:

- export filename formatting
- progress calculation correctness
- export content integrity
- deliverable URL validation
- deliverable file-size boundary enforcement
- deliverable-to-checklist merge integrity
- routine log to CMS task merge integrity

Current frontend coverage includes:

- landing page with product positioning
- auth experience with marketing/context panel
- dashboard and new-app setup flows
- workspace hero layouts for prep, routine, and export

## Go-Live Readiness

Check the current hosted/live blockers:

```bash
npm run go-live:check
```

Current go-live expectations:

- Hosted Supabase cutover needs `SUPABASE_ACCESS_TOKEN` or an authenticated `supabase login`
- Hosted smoke needs `SUPABASE_SERVICE_ROLE_KEY`
- Public signup needs `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` and `HCAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL` must be changed from localhost to the real deployed domain before public launch
- Contentful stays optional because the app can fall back to local CMS data

Recommended hosted cutover sequence:

```bash
npx supabase link --project-ref ivklsffslobgjiicziuj
npx supabase db push
SUPABASE_URL=... \
SUPABASE_PUBLISHABLE_KEY=... \
SUPABASE_SERVICE_ROLE_KEY=... \
npm run smoke:db:hosted
```

## Local Supabase Workflow

Start the local Supabase stack:

```bash
npm run supabase:start
```

Reapply the local database from migrations:

```bash
npx supabase db reset --local --yes
```

Run the local database smoke test:

```bash
SUPABASE_URL=http://127.0.0.1:54321 \
SUPABASE_PUBLISHABLE_KEY=... \
SUPABASE_SERVICE_ROLE_KEY=... \
npm run smoke:db:local
```

This smoke test verifies:

- auth signup creates a matching `public.users` row
- authenticated users can only read their own profile
- authenticated users cannot escalate their own `plan`
- app-owned tables enforce cross-user isolation
- routine logs reject duplicate entries for the same app, task, and week
- export and routine additions did not break the existing DB-backed app flow

## Required Env Vars For Real Auth Testing

These are needed when we want the auth flow to work against a real project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or a publishable key
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `HCAPTCHA_SECRET_KEY`

## Optional Env Vars For Live CMS

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_DELIVERY_TOKEN`
- `CONTENTFUL_PREVIEW_TOKEN`
- `CONTENTFUL_ENVIRONMENT`
- `CONTENTFUL_REVALIDATE_SECRET`

Without these, the app uses local fallback checklist and routine content so UI development can continue.

## Working Notes

- `specs/` stays authoritative
- `vault/` is for decisions, notes, handoff context, and working memory
- `HANDOFF.md` should always reflect where we last stopped
- hosted Supabase pushes require `SUPABASE_ACCESS_TOKEN` or a linked CLI session
- if `.env.local` still points to hosted Supabase, dashboard/app/routine/export routes need a remote `db push` before they can use the new schema
- Next manages `.next/types` automatically; the verified stable local flow is `npm run lint`, `npm run build`, then `npm run typecheck`
