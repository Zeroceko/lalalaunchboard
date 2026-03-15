# Lalalaunchboard

Startup'ların ürünlerini lansmana hazırlamasını ve büyütmesini sağlayan, ürün bazlı pre-launch checklist + growth routine platformu.

---

## Mimari Özet

```
User → Workspace → Products (N adet)
                       └── Pre-Launch Checklist (dinamik, sektör/platform/compliance'a göre)
                       └── Checklist (hazırlık listesi)
                       └── Growth Routine (haftalık görevler)
```

- **Backend:** Supabase (PostgreSQL + Auth + RLS + Storage)
- **Frontend:** Next.js 14 App Router — Server Components + Client Components
- **Stil:** Tailwind CSS, özel CSS token sistemi (`app/globals.css`, `app/themes.css`)
- **Deploy:** Vercel

---

## Klasör Yapısı

```
app/
  (app)/              → Authenticated app shell (sidebar layout)
    dashboard/        → Ana dashboard
    products/         → Ürün listesi, oluşturma, düzenleme, detay
      [id]/
        page.tsx      → Ürün detay sayfası (nav tiles + info grid)
        edit/         → Ürün düzenleme formu
        pre-launch/   → Ürüne özel pre-launch checklist
    boards/           → Legacy dashboard (mock KPI, cohort, funnel, revenue)
    settings/         → Kullanıcı & şirket profil ayarları
    onboarding/       → Yeni kullanıcı akışı
    pre-launch/       → (Eski workspace-level, kullanımdan kalkıyor)
  api/
    products/         → GET, POST /api/products | PATCH, DELETE /api/products/[id]
    workspaces/       → GET, POST /api/workspaces | PATCH /api/workspaces/[id]
    apps/             → Legacy (onboarding akışı hâlâ kullanıyor)
    users/profile/    → PATCH full_name, role_in_company

components/
  products/           → NewProductForm, EditProductForm
  pre-launch/         → PreLaunchClient (dinamik checklist, localStorage persist)
  settings/           → WorkspaceForm, ProfileForm
  shared/             → AppShell, AppShellNav (dinamik ürün listesi), ToastProvider
  dashboard/          → AppCard, AppList (legacy)

lib/
  products/           → service.ts, validation.ts, messages.ts
  workspaces/         → service.ts, validation.ts, options.ts, sectors.ts
  prelaunch/          → items.ts (dinamik checklist üreteci)
  apps/               → service.ts (legacy — onboarding mirror ile products'a yazıyor)
  auth/               → session.ts

supabase/
  migrations/         → Tüm DB migration'ları (sıralı)
  backups/            → Hosted DB snapshot'ları (.gitignore'da)
```

---

## Veritabanı

### Tablolar

| Tablo | Açıklama |
|-------|---------|
| `users` | Supabase Auth mirror + `full_name`, `role_in_company` |
| `workspaces` | Kullanıcı başına 1 workspace — şirket adı, aşama, takım büyüklüğü |
| `products` | Workspace'e bağlı N ürün — sektör, platform, compliance, UVP, rakipler |
| `apps` | Legacy tablo — onboarding akışı buraya yazıyor, products'a mirror'lanıyor |
| `checklist_item_statuses` | Checklist item durumları |
| `deliverables` | Ürün deliverable'ları |
| `routine_logs` | Growth routine kayıtları |

### Migrations (sıralı)

```
20260313233224_init_lalalaunchboard_schema.sql      → Temel şema
20260313233225_enable_lalalaunchboard_rls.sql       → RLS politikaları
20260314033000_create_deliverables_storage_bucket.sql
20260315000001_workspace_product_hierarchy.sql      → Workspace + Products tabloları
20260315000002_products_extended_fields.sql         → industry, compliance, uvp, vb.
```

---

## Kritik Tasarım Kararları

### 1. `apps` tablosu legacy — `products` asıl tablo
Onboarding akışı hâlâ `apps` tablosuna yazıyor (eski form). `createAppForUser` içinde yeni kayıt aynı UUID ile `products` tablosuna mirror'lanıyor. Bu sayede child tablolar (checklist, deliverables, routine_logs) UUID eşleşmesiyle çalışmaya devam ediyor.

**Yapılacak (Phase 4):** `apps` tablosu kaldırılacak, onboarding doğrudan `/api/products`'a yazacak.

### 2. Ürün bazlı profil alanları
Sektör, platform, iş modeli, compliance, UVP, rakipler → **her ürünün kendi edit sayfasında.**
Şirket profili (Settings) sadece şirket adı, aşama, takım büyüklüğü, büyüme kanalı, website tutuyor.

### 3. Pre-Launch Checklist — dinamik üretim
`lib/prelaunch/items.ts` → `generatePreLaunchItems({ industry, platforms, compliance, company_stage })` fonksiyonu ürünün profiline göre checklist üretiyor.
State: Supabase (`checklist_item_statuses` tablosu) üzerinden persist ediliyor.
Hydration hatası önlemi: `useState(new Set())` + `useEffect` ile yükleme.

### 4. Sidebar dinamik ürün listesi
`app/(app)/layout.tsx` → `getProductSnapshot(supabase, user.id)` ile ürünleri server'da çekiyor.
`AppShell → AppShellNav` props zinciriyle geçiyor.
"Ürünler" grubu altında, sol border ile girintili listeleniyor.

---

## Lokal Kurulum

```bash
# 1. Bağımlılıklar
npm install

# 2. Supabase local başlat
npx supabase start

# 3. Migration'ları uygula
npx supabase migration up

# 4. .env.local oluştur (örnek aşağıda)
cp .env.local.example .env.local

# 5. Uygulamayı başlat
npm run dev
```

### .env.local (local)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Hosted Supabase

- **Proje:** `lalalaunch` — `oymaadegumqzxxwdlwtq`
- **Bölge:** Northeast Asia (Seoul)
- **URL:** `https://ivklsffslobgjiicziuj.supabase.co`
- Hosted credentials `.env.local` içinde comment'te mevcut

Hosted'a migration push:
```bash
npx supabase link --project-ref oymaadegumqzxxwdlwtq
npx supabase db push
```

---

## Sayfalar & Rotalar

| URL | Açıklama |
|-----|---------|
| `/` | Landing page |
| `/auth` | Giriş / Kayıt |
| `/pricing` | Fiyatlandırma |
| `/dashboard` | Ana dashboard |
| `/products` | Ürün listesi |
| `/products/new` | Yeni ürün oluştur |
| `/products/[id]` | Ürün detay (nav tiles) |
| `/products/[id]/edit` | Ürün düzenle / sil |
| `/products/[id]/pre-launch` | Ürüne özel pre-launch checklist |
| `/boards` | Legacy dashboard (mock KPI, cohort, funnel) |
| `/settings` | Kullanıcı & şirket profili |
| `/onboarding` | Yeni kullanıcı akışı |

---

## Sonraki Adımlar (Roadmap)

### Kısa vade
- [ ] Onboarding akışını `apps` tablosundan çıkar, doğrudan `/api/products`'a yaz
- [ ] `apps` legacy tablosunu kaldır (Phase 4 migration)
- [ ] Pre-launch checklist state'ini localStorage'dan Supabase'e taşı

### Orta vade
- [ ] Checklist & Growth Routine sayfalarını `/products/[id]/` altına taşı
- [ ] `/products/[id]/export` — PDF rapor
- [ ] PostHog / Stripe entegrasyonu (boards'daki mock data'nın gerçek veri ile beslenmesi)
- [ ] App Store metadata sayfası (`app_store_metadata` tablosu hazır)

### Uzun vade
- [ ] AI öneri motoru (sektör + compliance'a göre)
- [ ] Takım daveti & çok kullanıcılı workspace

---

## Kalite

```bash
npm run lint        # 0 hata
npx tsc --noEmit    # 0 hata
```
