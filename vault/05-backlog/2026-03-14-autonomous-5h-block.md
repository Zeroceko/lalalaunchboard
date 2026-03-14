# Autonomous 5-Hour Block

This note defines the next uninterrupted work block for Codex.

- [ ] CMS foundation and fallback content
  - strengthen `lib/contentful/client.ts`
  - add typed mappers for checklist and routine data
  - add local fallback content for zero-credential progress

- [ ] CMS API routes and cache behavior
  - `GET /api/cms/checklist-items`
  - `GET /api/cms/routine-tasks`
  - `POST /api/cms/revalidate`
  - ISR + safe fallback behavior

- [ ] Progress and countdown utilities
  - implement `lib/progress.ts`
  - reusable countdown and shaping helpers

- [ ] Checklist backend layer
  - `GET /api/apps/[id]/checklist`
  - `PATCH /api/apps/[id]/checklist/[itemId]`
  - CMS + DB merge logic

- [ ] First checklist UI pass
  - `components/checklist/ProgressBar.tsx`
  - `components/shared/CountdownBadge.tsx`
  - `components/checklist/ChecklistCategory.tsx`
  - `components/checklist/ChecklistItem.tsx`
  - `app/(app)/app/[id]/page.tsx`

- [ ] Verification and notes
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - update `specs/tasks.md`
  - update `HANDOFF.md`
  - update `vault/04-devlog`
