# Autonomous 5-Hour Block

This note defines the next uninterrupted work block for Codex.

- [ ] Landing acquisition clarity
  - tighten the value proposition for non-technical users
  - make the primary CTA into `/auth` unmistakable
  - validate the new explicit `Flow 0` against the landing copy and hierarchy

- [ ] Checklist interaction polish
  - refine `ChecklistItem`, `ItemDetailPanel`, and `DeliverableForm`
  - complete loading/empty/error/retry states
  - improve mobile detail-panel readability and control density

- [ ] Dashboard and app-shell consistency pass
  - align dashboard, checklist, export, and settings surfaces
  - tighten spacing and CTA hierarchy on mobile
  - improve blocker and empty-state messaging

- [ ] Remaining property-test backlog
  - cover auth properties (`3.2`, `3.3`, `3.5`, `3.6`, `3.7`, `3.8`)
  - cover app/CMS/checklist gaps (`2.3`, `5.2`, `5.3`, `6.3`, `7.4`, `7.6`)

- [ ] Hosted env and cutover prep
  - decide whether `.env.local` should target local or hosted Supabase next
  - keep `supabase link`, `db push`, and hosted smoke steps ready
  - verify every hosted blocker is explicit and user-friendly

- [ ] Verification and notes
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:properties`
  - `npm run supabase:status`
  - `npm run smoke:db:local`
  - update `specs/tasks.md`
  - update `specs/roadmap.md`
  - update `specs/flows.md`
  - update `HANDOFF.md`
  - update `vault/04-devlog`
