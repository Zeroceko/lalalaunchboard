# Product Roadmap

Last updated: 2026-03-14

## Executive Summary

Lalalaunchboard is moving from a manually operated launch board into an
AI-assisted launch operating system for indie app builders. In the current
workspace snapshot, the directly re-verified foundation is the local app,
local Supabase flow, protected dashboard/workspace routes, checklist,
deliverables, post-launch routine, and export. The next step is not rebuilding
the foundation, but upgrading the product in layers while finishing hosted
cutover and release hardening.

Version `v0` is the live MVP foundation. Version `v1` is the first complete
product vision: a user can upload app screenshots and app context, receive AI
generated launch copy and launch guidance, review/edit the outputs, publish them
into the workspace, and continue execution through checklist, routine, and
export flows. The roadmap below is designed so we can keep shipping features
without re-architecting the stack later.

## Yonetici Ozeti

Lalalaunchboard, indie gelistiriciler icin lansman surecini tek bir calisma
alaninda toplayan bir launch operating system'e donusuyor. Bu workspace
snapshot'inda dogrudan yeniden dogrulanan `v0` temeli; lokal uygulama,
lokal Supabase akisi, dashboard/checklist/deliverable/routine ve export
akislaridir. Bundan sonraki hedef zemini yeniden kurmak degil, bu temelin
ustune urunu katman katman buyutmek ve hosted cutover'u tamamlamaktir.

`v0`, canli MVP temelimiz. `v1` ise ilk tam urun vizyonu: kullanici uygulama
ekran goruntulerini ve urun baglamini verecek, sistem buna gore AI destekli
launch copy ve launch guidance uretecek, kullanici bu ciktilari duzenleyip
workspace'e publish edecek, sonra checklist, routine ve export akisiyla
uygulamayi gercekten yonetecek. Asagidaki roadmap bu gecisi sonradan mimariyi
bastan kurmak zorunda kalmadan yapabilmemiz icin hazirlandi.

## How To Use This File

- Keep this file in `specs/` as the product-level roadmap source of truth.
- Mark completed items with `[x]`.
- Leave not-started items as `[ ]`.
- Update the `Current Position` section when we finish a sprint or shift version.

## Bu Dosya Nasil Kullanilir

- Bu dosya `specs/` altinda urun seviyesindeki resmi roadmap kaydi olarak kalir.
- Tamamlanan maddeleri `[x]` ile isaretleriz.
- Baslamayan maddeleri `[ ]` olarak birakiriz.
- Her sprint sonunda veya surum seviyesi degistiginde `Current Position`
  bolumunu guncelleriz.

## Current Position

- Current version: `v0`
- Current sprint focus: `Sprint 1 - Live MVP stabilization, flow clarity, and release readiness`
- Current platform status:
  - [x] Local app routes, build, typecheck, property tests, and local Supabase smoke re-verified
  - [x] Checklist, deliverables, post-launch routine, export, settings helper, and portfolio management panel exist in the main repo
  - [x] UI sandbox outputs have been partially merged into the main app surfaces
  - [ ] Hosted Supabase cutover is configured in this workspace snapshot
  - [ ] Public launch env, hCaptcha, and external app URL are configured
  - [ ] Final UI sandbox cleanup and remaining polish pass are completed
  - [ ] Monitoring and post-launch QA pass completed

Current workspace note:

- This snapshot does not currently expose `.git`, so git history, CI, and remote deploy state should be confirmed from the original clone or remote repo before release decisions.

## Version Map

### v0 - Live MVP Foundation

Goal: Ship a stable launch board with real auth, real data, and working launch
execution flows.

- [x] Auth and route protection
- [x] Dashboard and workspace creation
- [x] Checklist, progress, deliverables, and storage
- [x] Post-launch routine tracking
- [x] Markdown and PDF export
- [x] Local verification and local Supabase foundation
- [ ] Hosted Supabase cutover and hosted smoke against the target project
- [ ] Final UI merge from sandbox
- [ ] Monitoring and release QA baseline

### v0.5 - Polished Manual Launch Board

Goal: Make the non-AI product feel production-ready and repeatable.

- [ ] Merge the new UI system and choose one default production theme
- [ ] Polish landing, auth, dashboard, new-app, checklist, export, and routine surfaces
- [ ] Expand the current settings surface into fuller profile/app/theme preferences
- [ ] Improve empty, blocker, and success states
- [ ] Add onboarding and first-workspace guidance
- [ ] Add analytics and error monitoring

### v0.8 - AI Beta

Goal: Introduce the first working AI workflow without breaking the manual
workspace model.

- [ ] Add asset upload flow for screenshots and references
- [ ] Add generation job model and status tracking
- [ ] Add worker/service boundary for long-running AI jobs
- [ ] Generate first-pass launch copy and screenshot text suggestions
- [ ] Add review, edit, and publish flow for AI outputs

### v1.0 - AI-Assisted Launch Operating System

Goal: A builder can go from raw app context to an actionable launch board with
AI-assisted copy, guidance, and execution.

- [ ] AI-generated app summary, positioning, and store copy
- [ ] AI-generated screenshot caption suggestions
- [ ] AI-generated launch checklist suggestions and launch-risk guidance
- [ ] AI-assisted creative brief and deliverable suggestions
- [ ] Versioned outputs, regeneration, and publish controls
- [ ] Usage limits, billing, and production hardening

## Turkce Yol Haritasi

Bu bolum, yukaridaki resmi roadmap'in daha rahat okunabilen Turkce ozetidir.
Asil takip listesi ve checkbox'lar yukaridaki Ingilizce bolumlerde kalir.

### Surum Haritasi

#### v0 - Canli MVP Temeli

Hedef: Gercek auth, gercek veri ve gercek deploy ile calisan bir launch board.

- Auth, route protection ve dashboard akislarini calisir halde tutmak
- Checklist, deliverable, routine ve export temellerini canlida korumak
- Hosted Supabase, GitHub CI ve Vercel zeminini saglamlastirmak
- UI sandbox merge'i ve son release QA katmanini tamamlamak

#### v0.5 - Cilali Manuel Launch Board

Hedef: AI olmadan da kendi basina deger ureten, daha temiz ve daha rehberli bir
urun deneyimi.

- Yeni UI sistemini guvenli sekilde merge etmek
- Landing, auth, dashboard, checklist, routine ve export yuzeylerini cilalamak
- Settings, onboarding, empty state ve blocker state kalitesini artirmak
- Analytics ve error monitoring tabanini eklemek

#### v0.8 - AI Beta

Hedef: Manuel urun modelini bozmadan ilk AI destekli akislari urune eklemek.

- Screenshot ve referans asset yukleme akisini eklemek
- Generation job/status modelini kurmak
- Uzun sureli isler icin worker sinirini acmak
- Ilk launch copy ve screenshot text onerilerini uretmek
- Review, edit ve publish akisini eklemek

#### v1.0 - AI-Assisted Launch Operating System

Hedef: Kullanici ham urun baglamindan aksiyon alinabilir bir launch board'a
AI destegiyle gecsin.

- AI ile app summary, positioning ve store copy uretmek
- AI ile screenshot caption ve launch guidance uretmek
- AI ile checklist, creative brief ve deliverable onerileri sunmak
- Versioning, regenerate ve publish kontrolu eklemek
- Billing, usage control ve hardening ile urunu yayinlanabilir hale getirmek

### Sprint Ozetleri

#### Sprint 1 - Live MVP Stabilization

Odak: UI merge, production theme secimi, regresyon onleme ve canli manuel
urun deneyimini tutarli hale getirme.

#### Sprint 2 - Productized MVP

Odak: Onboarding, settings, checklist UX ve export deneyimini urunlesmis
seviyeye cekme.

#### Sprint 3 - AI Infrastructure

Odak: Asset, job, output ve feedback veri modelleri ile worker omurgasini
kurma.

#### Sprint 4 - AI Copy Beta

Odak: App description + screenshot input'undan ilk faydali launch copy
taslaklarini uretme.

#### Sprint 5 - AI Launch Kit Beta

Odak: AI ciktilarini workspace'i dolduran checklist, risk, deliverable ve
creative brief onerilerine cevirme.

#### Sprint 6 - Editing, Versioning, and Publish Control

Odak: AI ciktilarini versiyonlanabilir, karsilastirilabilir ve kontrollu
publish edilebilir hale getirme.

#### Sprint 7 - Monetization and Usage Controls

Odak: Billing, quota, usage tracking ve upgrade akislarini urune ekleme.

#### Sprint 8 - v1 Hardening and Release

Odak: Retry, abuse protection, monitoring, destek dokumani ve final release QA.

## Sprint Roadmap

### Sprint 1 - Live MVP Stabilization

Status: `in progress`

Goal: Merge the UI pass safely and make the live manual workflow feel coherent.

- [x] Review UI sandbox handoff and separate sandbox-only notes from main-repo truth
- [x] Merge the first production-ready UI surfaces into the main repo
- [x] Re-run `lint`, `build`, `typecheck`, `test:properties`
- [ ] Select and document one default production theme for the remaining polish pass
- [ ] Run a mobile and desktop QA pass on landing, auth, dashboard, and workspace
- [ ] Add a short release checkpoint update to `HANDOFF.md` after hosted-env decisions are made

Exit criteria:
- The live app feels visually coherent and safe to demo.
- No auth, dashboard, checklist, routine, or export regression remains.

### Sprint 2 - Productized MVP

Status: `planned`

Goal: Make the manual product self-explanatory and easier to adopt.

- [ ] Add onboarding and first-workspace setup guidance
- [ ] Improve checklist detail flow and deliverable UX
- [ ] Improve export readability and usefulness
- [ ] Expand the current settings helper into a fuller settings surface
- [ ] Add product analytics baseline
- [ ] Add error monitoring baseline

Exit criteria:
- A new user can sign up, create a workspace, understand the flow, and finish
  a useful manual session without extra help.

### Sprint 3 - AI Infrastructure

Status: `planned`

Goal: Add the technical backbone for asynchronous AI features.

- [ ] Define `app_assets` data model
- [ ] Define `generation_jobs` data model
- [ ] Define `generation_outputs` data model
- [ ] Define `generation_feedback` data model
- [ ] Add storage buckets and upload flow for AI inputs
- [ ] Add provider abstraction for AI calls
- [ ] Add prompt versioning and output schema versioning
- [ ] Add worker service skeleton for long-running generation jobs

Exit criteria:
- The web app can enqueue a generation job and a worker can process it without
  blocking the request cycle.

### Sprint 4 - AI Copy Beta

Status: `planned`

Goal: Generate the first useful AI drafts from app context and screenshots.

- [ ] Accept app description and screenshot inputs
- [ ] Generate app summary and positioning draft
- [ ] Generate title/tagline/subtitle candidates
- [ ] Generate short and long description drafts
- [ ] Generate screenshot caption suggestions
- [ ] Add review/edit/publish flow for generated copy

Exit criteria:
- A user can create and publish a first-pass AI launch copy draft.

### Sprint 5 - AI Launch Kit Beta

Status: `planned`

Goal: Turn AI output into an actual launch workspace accelerator.

- [ ] Generate launch checklist suggestions
- [ ] Generate launch-risk notes and missing-input guidance
- [ ] Generate deliverable recommendations
- [ ] Generate a creative brief draft
- [ ] Prefill parts of the workspace from published AI output

Exit criteria:
- A new workspace can start from AI-assisted guidance instead of a blank board.

### Sprint 6 - Editing, Versioning, and Publish Control

Status: `planned`

Goal: Make AI output trustworthy, controllable, and easy to refine.

- [ ] Add output versions and history
- [ ] Add section-level regeneration
- [ ] Add compare/replace flow between old and new drafts
- [ ] Add accept/reject/revise actions
- [ ] Preserve draft vs published state clearly

Exit criteria:
- AI output is editable and versioned instead of replacing product data blindly.

### Sprint 7 - Monetization and Usage Controls

Status: `planned`

Goal: Prepare the product for paid AI usage.

- [ ] Add billing model and plans
- [ ] Add generation quotas and usage tracking
- [ ] Add plan-aware access control for AI features
- [ ] Add upgrade flow and paywall surfaces
- [ ] Add cost visibility for generation-heavy actions

Exit criteria:
- AI features can be released with sustainable usage controls.

### Sprint 8 - v1 Hardening and Release

Status: `planned`

Goal: Release the first full AI-assisted product version confidently.

- [ ] Add retry and failure recovery for generation jobs
- [ ] Add abuse protection and rate limiting
- [ ] Finalize support/help documentation
- [ ] Finalize monitoring, alerting, and QA checklist
- [ ] Run v1 release candidate testing

Exit criteria:
- `v1.0` is stable enough for external launch and repeatable demos.

## Deferred Until After v1

- [ ] Team collaboration and multi-user workspace roles
- [ ] App Store / Play Store publishing integrations
- [ ] Native mobile client
- [ ] Advanced creative/image generation studio
- [ ] Broad multi-theme experimentation as a core feature

## Success Metrics To Track

- [ ] Signup -> first workspace conversion
- [ ] Workspace creation -> first checklist completion
- [ ] Export usage rate
- [ ] AI generation -> publish conversion
- [ ] Weekly retained active workspaces
- [ ] Paid conversion once billing is live
