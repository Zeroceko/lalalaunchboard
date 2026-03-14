# Lalalaunchboard: B2B SaaS Büyüme & Operasyon Masası

Lalalaunchboard, bir uygulamanın pazara çıkışından (launch) büyümesine (growth) kadarki tüm safhalarını yönettiğiniz, **Y-Combinator kalite standartlarında** (Vercel, Linear esintili) kodlanmış premium bir **Control Desk** (Kontrol Masası) projesidir.

## Projenin Amacı ve Mimari Vizyon

Bu repo, basit bir veri listeleme (CRUD) uygulamasından çıkıp, **gerçek bir B2B SaaS** deneyimine yükseltilmiştir:
- **Pazardan önce ve pazarda tek yardımcın** (Launch prep, marketing, growth tek board)
- Verilerin, startup standartlarına göre "insights" oluşturacak şekilde sunulması (DAU, MAU, Retention, Funnel, MRR).
- B2B güveni aşılayan, aurora, shine, dot-grid ve glow card bazlı "Trust" odaklı önyüz.

## Güncel UI / UX Durumu

**Ürün "Productized MVP" ve "World-class Redesign" evrelerini tamamlamıştır:**
1. **Landing Page (`/`)**: Büyüleyici bir hero section, feature grid, social proof ve dark CTA ile donatılmış harika bir vitrin sayfası.
2. **Auth (`/auth`)**: Premium split-screen (sol tarafta değer önerisi, sağ tarafta form) giriş / kayıt akışı.
3. **Pricing (`/pricing`)**: 3 paketli (Starter, Pro, Enterprise), 28 satırlık detaylı özellik karşılaştırma tablolu, dark hero "Pro" kartlı Fiyatlandırma sayfası.
4. **Dashboard (`/dashboard`)**: Veri dolu bir komuta merkezi. İçinde **inline SVG sparkline grafikler**, mini barlar, Retention Heatmap, Aktivasyon Funnel'ı, Mrr dalga grafiği ve 100 günlük Gantt stili Launch Timeline mevcuttur.

## Dosya Yapısı ve Kaynak Göstergeleri

- **`app/`**: Tüm ana sayfa rotaları (auth, dashboard, pricing, vb).
- **`app/globals.css` & `app/themes.css`**: Aurora spotlight, glass-panel, glow-card ve renk token matematiğinin olduğu kritik tasarım dosyaları.
- **`components/ui/LaunchKit.tsx`**: Projenin buton, panel (card) ve badge varyasyonlarının bulunduğu UI kiti.
- **`lib/`**: Auth Session (Supabase) ve i18n sistem servisleri.
- **`HANDOFF.md`**: Projeyi devralan kişi için detaylı "nerede kaldık, nereye gidiyoruz" dokümanı.

## Lokal Kurulum & Çalıştırma

1. `.env.local.example` kopyalanıp `.env.local` oluşturulmalı (Supabase URL ve Anon Key vb. girilerek).
2. Bağımlılıklar yüklenir:
   ```bash
   npm install
   ```
3. Uygulama başlatılır:
   ```bash
   npm run dev
   ```

## Kalite Güvencesi

Projenin mevcut commit'i itibarıyla:
- `npm run lint` -> **0 Hata**
- `npm run typecheck` -> **0 Hata**
tasarımsal ve fonksiyonel kırık bileşen bulunmamaktadır.

## Sonraki Adımlar (Roadmap Kısa Özeti)

Dashboard üzerindeki tüm karmaşık startup verileri (Cohort, Funnel, SVG charts) şu an harika bir UI ile kodlandı ancak hardcoded "sample data" ile render edilmektedir. Bir sonraki fazda PostHog / Stripe api bağlantılarının yazılıp bu veri yapısına beslenmesi gereklidir. İletişim, roadmap detayları ve teknik spec vizyonu için `HANDOFF.md` dosyasını inceleyin.
