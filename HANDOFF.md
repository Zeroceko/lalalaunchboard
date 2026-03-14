# Handoff

Last updated: 2026-03-14

## Current State

We have a clean project foundation with:

- Next.js 14 app scaffold
- Tailwind and shared utility setup
- Supabase and Contentful integration scaffolding
- Auth page with login/register tabs
- Auth API routes for sign-in, sign-up, and sign-out
- Supabase migrations for `users`, `apps`, `checklist_item_statuses`, `deliverables`, and `routine_logs`
- RLS policies and auth-to-profile sync triggers
- Local smoke test that validates auth sync, plan lock-down, and cross-user ownership
- App shell layout with protected dashboard routes
- `apps` CRUD API routes with Zod validation and free-vs-pro limit checks
- Dashboard list, delete flow, sign-out flow, and new app form
- Contentful-backed CMS layer with local fallback checklist/routine content
- CMS API routes and revalidation hook
- Checklist merge layer, progress helpers, checkbox toggle route, and first `/app/[id]` screen
- Deliverable CRUD routes, item detail slide-over, and first file-upload storage bucket migration
- Post-launch routine routes, weekly log flow, and `/app/[id]/post-launch`
- Markdown/PDF export utilities, export API route, and `/app/[id]/export`
- Middleware-based route protection and auth redirect flow
- Global toast layer, fallback notices, and workspace section navigation
- Property-based test foundation with `vitest` + `fast-check`
- First visible frontend pass across landing, auth, dashboard, new-app, and workspace screens
- Checklist interaction polish started: item cards, detail panel, deliverable form, and app-shell header now follow the new visual language
- Checklist workspace surfaces now align further with the LaunchKit design language (`WorkspaceHero`, lane summary cards, category wrappers, and checklist item row styling)
- Property coverage now also includes deliverable validation/merge, routine merge, and export content integrity
- Shared blocker/empty states now use a common `WorkspaceNotice` pattern across dashboard and workspace pages
- Docker test flow that passes lint, typecheck, and build

Current product name:

- `Lalalaunchboard`
- slogan: `Prep, launch, and grow - all on one board.`

## Source Of Truth

- Official specs: `specs/`
- Working memory and notes: `vault/`

Do not duplicate spec content into `vault/`. Link to the spec files instead.

## What Was Verified

The following passed locally:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:properties`
- `npx supabase db reset --local --yes`
- `npx supabase db lint --local`
- `npm run smoke:db:local` against local Supabase

The following also passed in Docker:

- `docker compose build web-test`
- `docker compose run --rm web-test`

Latest visual/frontend pass also re-verified:

- `npm run lint`
- `npm run build`
- `npm run typecheck`

Note:

- `npm run smoke:db:local` in this exact session did not run because local Supabase env vars were not loaded into the shell
- the local smoke flow itself had already passed earlier against local Supabase and remains the expected DB verification path

## What Still Needs Real Credentials

Auth can be wired to the real backend as soon as these are provided:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or a publishable key
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `HCAPTCHA_SECRET_KEY`

Contentful credentials are still optional for the current milestone because the app now has local fallback CMS data.

Hosted Supabase migration push is currently blocked by one missing capability:

- `SUPABASE_ACCESS_TOKEN` for the CLI, or an already logged-in `supabase` CLI session

Important runtime note:

- The repo currently points to the hosted Supabase URL in `.env.local`
- Because hosted DB migrations are not pushed yet, `/dashboard`, `/app/new`, `/app/[id]`, `/app/[id]/post-launch`, and `/app/[id]/export` will show schema/setup blockers until `db push` is done, or until env vars are switched to local Supabase

## Recommended Next Step

There are now three sensible tracks:

1. Frontend track: continue the current visible MVP pass by polishing checklist interactions, item detail panels, deliverable forms, and app-shell consistency
2. Infra track: obtain `SUPABASE_ACCESS_TOKEN`, then run `npx supabase link --project-ref ivklsffslobgjiicziuj` and `npx supabase db push`
3. Hardening track: expand the property-test suite (`10.2`, `11.4`, `8.2`, `8.3`, `8.4`) and then perform a hosted runtime QA pass

## Autonomous Multi-Block Queue

This is the next self-directed queue to continue without waiting for user confirmation.

1. Workspace interaction polish — `90-120 min` — in progress
   - refine `ChecklistItem`, `ItemDetailPanel`, and `DeliverableForm`
   - reduce visual noise while keeping all current behaviors
   - make the checklist workspace feel closer to a real product than a first-pass tool

2. App-shell consistency pass — `60-90 min`
   - align dashboard, workspace, and export surfaces
   - tighten mobile spacing and CTA hierarchy
   - improve empty/blocker states where they still feel placeholder-like

3. Property-test expansion — `90-120 min`
   - completed: RoutineLog round-trip property test (`10.2`)
   - completed: export content integrity test (`11.4`)
   - completed: deliverable validation and round-trip tests (`8.2`, `8.3`, `8.4`)

4. Hosted Supabase live cutover prep — `45-60 min`
   - keep remote push commands ready
   - document the exact hosted smoke sequence
   - verify every hosted schema blocker is explicit and user-friendly

5. Live integration pass — `45-90 min`
   - wire real Contentful credentials when available
   - verify auth and CMS behavior against hosted runtime
   - confirm fallback-vs-live copy still reads clearly

6. MVP QA and release-prep pass — `45-75 min`
   - bug-bash happy path and obvious edge cases
   - final copy cleanup
   - update `README.md`, `HANDOFF.md`, `specs/tasks.md`, and dev log again

Target outcome after this queue:

- the app should look and feel like a coherent first MVP, not just a backend-connected scaffold
- remaining work should skew toward hardening and live environment cutover
- frontend work can continue immediately without waiting for backend foundation changes

## Important Decisions Already Made

- `specs/` is the source of truth
- `vault/` exists for Obsidian-based working notes
- Docker is part of the default verification flow
- Typed route strictness is currently not enabled to keep the early workflow stable
- `users.plan` is server-managed and not writable by authenticated clients
- `routine_logs` are unique per `app_id + cms_task_id + week_number`
- Dashboard/new-app pages fail gracefully when the remote schema is not available yet
- Checklist page also fails gracefully when hosted schema is missing and can render with fallback CMS content
- Deliverable file uploads now expect a `deliverables` storage bucket/policies from the latest local migration
- Post-launch routine and export screens also fail gracefully when hosted schema is missing
- Export file generation now depends on `@react-pdf/renderer`
- Middleware now protects `/dashboard`, `/app/*`, and redirects `/auth` away for signed-in users
- Toast notifications are available app-wide from the root layout

## Notes For Future Me

- Auth routes intentionally return clear config-related messages when env vars are missing
- hCaptcha is integrated as a real client/server slot, not a fake placeholder
- Supabase CLI can run locally, but hosted project commands currently fail without an access token
- App CRUD is implemented locally and verified at build/lint/type level, but hosted runtime still needs `db push`
- Checklist/CMS first pass is in place and now connected to deliverables, routine, and export screens
- A property-based test foundation now exists via `vitest` + `fast-check`
- Next manages `.next/types` automatically; the currently verified stable verification order is `npm run lint`, `npm run build`, then `npm run typecheck`
- If another agent is working in the same repo, avoid editing the same files at the same time
- Frontend work has now moved beyond placeholders: landing, auth, dashboard, new-app, and workspace hero surfaces all have a first-pass product UI
