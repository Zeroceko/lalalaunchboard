# Product Flows and Team Model

Last updated: 2026-03-14

## Purpose

Bu dokumanin amaci:

- ekip rollerini netlestirmek
- urunun ana flowlarini tek bir product diliyle tanimlamak
- development, product ve design handoff kalitesini standartlastirmak

Bu dosya, `specs/requirements.md` ve `specs/design.md` ile uyumlu bir calisma katmanidir.

## Team Split

### 1) Development

Sahiplik:

- teknik mimari, API, veri modeli, performans, guvenlik
- test stratejisi, CI ve release guvenligi
- implementation feasibility ve teknik risk analizi

Teslim ettigi ciktilar:

- teknik task breakdown
- implementation plan + test plan
- release notes ve regression raporu

### 2) Product

Sahiplik:

- hangi problemi hangi sirayla cozecegimiz
- flow adimlari, karar noktalari, edge case davranislari
- KPI ve success criteria

Teslim ettigi ciktilar:

- flow definition (happy path + edge cases)
- acceptance criteria
- sprint onceliklendirme

### 3) Design (UI/UX)

Sahiplik:

- bilgi mimarisi (IA), ekran hiyerarsisi, interaction model
- wireflow, component davranisi, microcopy
- mobile ve desktop deneyim tutarliligi

Teslim ettigi ciktilar:

- wireflow / high-fidelity ekranlar
- component-level interaction specs
- UX QA checklist

## Handoff Contract

Flow tamamlandi sayilmasi icin:

1. Product: flow tanimi + acceptance criteria yazili olacak
2. Design: wireflow ve state'ler tanimli olacak (`default/loading/empty/error/success`)
3. Development: implementation ve test kapsami yazili olacak
4. QA: en az bir happy path ve bir edge case dogrulanmis olacak

## MVP User Flows (UX-Aligned Dev Handoff)

Bu bolum, `ux-flows/requirements.md`, `ux-flows/design.md` ve
`ux-flows/tasks.md` referans alinarak guncellenmis dev handoff katmanidir.

Notlar:

- Design klasorundeki UX spec'leri referans olarak kullaniriz; product ve dev source of truth bu repo icindeki `specs/` altindadir.
- Aktif kod gercegi `Development/` altindadir; `Design - UI:UX` klasoru bir sandbox/snapshot olarak ele alinmalidir.
- UX dokumaninda `auth/login` ve `auth/signup` ayri route gibi anlatilan alanlar, mevcut MVP implementasyonunda tek `/auth` ekraninda tab yapisi ile temsil edilir.
- `Settings` ve `Yonetici` ekranlari uygulamada vardir ancak cekirdek son-kullanici journey'sinin parcasi degildir; bu nedenle burada yardimci surface olarak dusunulur.

Aktif MVP sirasi:

1. Landing Acquisition
2. Onboarding ve Auth
3. Dashboard
4. Workspace Setup
5. Pre-launch Checklist
6. Item Detail ve Deliverables
7. Post-launch Routine
8. Export
9. Navigation, Error, Empty ve Sign-out davranislari

## Global Principles

Tum flow'larda gecerli:

- Kullanici giris yapmadiysa korumali route'larda `/auth?next=...` akisi kullanilir.
- Login sonrasi kullanici `next` parametresine geri dondurulur.
- Signed-in user `/auth` ekraninda tutulmaz; varsayilan olarak `/dashboard` veya gecerli `next` hedefine yonlendirilir.
- Tüm korumali yuzeylerde tutarli bir app header bulunur.
- Workspace icinde `Checklist`, `Post-launch` ve `Export` gecisleri gorunur ve URL hiyerarsisi bunu yansitir.
- Bos durumlar yalnizca "veri yok" demez; sonraki adima goturen CTA sunar.
- API ve mutation hatalari yalnizca hata vermekle kalmaz; `retry`, `dashboard'a don`, `tekrar dene` gibi recovery aksiyonlari sunar.
- Optimistic update kullanilan aksiyonlarda UI once guncellenir, sunucu reddederse rollback yapilir.
- Mobil hedef genislik `390px`, minimum dokunma hedefi `44px` olmalidir.

## Flow 0 - Landing Acquisition

User story:

As a first-time visitor, I want to understand what Lalalaunchboard does within seconds and see one clear next step into auth.

Primary route:

- `/`

Happy path:

1. Kullanici landing'e gelir.
2. Ilk fold icinde urunun ne yaptigini, kim icin oldugunu ve neden faydali oldugunu anlar.
3. Birincil CTA ile `/auth` ekranina gider.
4. Landing boyunca checklist/workspace preview ve kisa nasil-calisir anlatimi ile neyin baslayacagini gorur.
5. Auth ekranina gecince baglam kopmaz; kullanici neden burada oldugunu anlamaya devam eder.

Edge cases ve recovery:

- Signed-in kullanici icin dashboard'a donmeyi kolaylastiran ikincil yonlendirme sinyali bulunur
- Copy yogunlugu artsa bile ana CTA ilk bolumde kaybolmaz
- Mobilde hero alani, deger onermesi ve CTA tek ekranda okunabilir kalir

Acceptance criteria:

- Hero alaninda tek ve net bir birincil CTA vardir; `/auth` ekranina gider.
- Ilk ekran 10 saniye icinde urun amacini anlatir.
- Landing'de 3 adimli veya esdeger kisa bir nasil-calisir anlatimi vardir.
- Preview alanlari checklist/routine/export mantigini destekler.
- Mobilde CTA ve temel mesaj fold civarinda okunur kalir.

## Flow 1 - Onboarding ve Auth

User story:

As a new indie developer, I want to understand the product quickly, register, and start my first board without falling into a dead end.

Primary routes:

- `/auth`
- `/app/new`

Happy path:

1. Kullanici landing'e gelir ve ana deger onermesini gorur.
2. `Yeni workspace baslat` veya benzeri birincil CTA ile `/auth` ekranina gider.
3. `/auth` ekraninda varsayilan aktif sekme `Giris Yap` olur; kullanici `Kayit Ol` sekmesine gecer.
4. Email + password + confirm + CAPTCHA ile kayit tamamlanir.
5. Basarili kayit sonrasi kullanici dogrudan `/app/new` ekranina gider.
6. `/app/new` ekraninda onboarding baglami hissedilir ve ilk uygulamasini olusturur.
7. Basarili app create sonrasi ilgili workspace checklist ekranina (`/app/[id]`) gider.

Edge cases ve recovery:

- Protected route'a signed-out ulasim -> `/auth?next=...`
- CAPTCHA eksik -> kayit bloklanir
- Signed-in user `/auth` acarsa -> `/dashboard` veya `next`
- Onboarding boyunca kullanici "hangi adimdayim?" sorusuna baglamsal baslik veya adim sinyaliyle cevap bulur

Acceptance criteria:

- `/auth` ekraninda `Giris Yap` ve `Kayit Ol` tablari gorunur; varsayilan aktif tab `Giris Yap` olur.
- CAPTCHA tamamlanmadan kayit olmaz.
- Kayit basariliysa kullanici signed-in state'e gecer.
- Kayit sonrasi kullanici bos dashboard'a dusmez; dogrudan `/app/new` ekranina gider.
- `/app/new` ekraninda ilk kullanim baglami hissettiren yonlendirici metin gorunur.
- Basarili ilk app create sonrasi kullanici checklist workspace'ine yonlendirilir.

## Flow 2 - Dashboard

User story:

As a user, I want a dashboard that shows all my boards with enough context to know what deserves attention first.

Primary route:

- `/dashboard`

Data shown per board card:

- app name
- platform badge (`iOS`, `Android`, `Web`)
- launch date
- countdown (`days until launch`)
- overall progress (`%`)
- `Next move` veya `siradaki kritik adim`
- quick links: `Checklist`, `Post-launch`, `Export`
- actions: `Delete`

Happy path:

1. Kullanici dashboard'a gelir.
2. Uygulama kartlarini launch timing ve progress sinyalleriyle gorur.
3. Bir karta tiklayip ilgili checklist workspace'ine gecer.
4. `Yeni Uygulama Ekle` ile setup ekranina gecis yapar.

Edge cases ve recovery:

- `0 board` durumunda empty state + `Ilk uygulamani ekle` CTA
- Free plan + 1 active board durumunda create aksiyonu disable / blocker olarak davranir
- Delete aksiyonu dogrudan calismaz; modal onayi ister
- Dashboard verisi yuklenemezse hata durumu + tekrar dene mantigi olmalidir

Acceptance criteria:

- `0 board` durumunda yonlendirici empty state gorunur.
- `1+ board` durumunda kart listesi platform, tarih, progress ve next move ile gorunur.
- Kart tiklamasi kullaniciyi ilgili `/app/[id]` ekranina goturur.
- `Yeni Uygulama Ekle` aksiyonu `/app/new` ekranina gider.
- Free plan kapasitesi doldugunda create aksiyonu gorunur sekilde blocker/upgrade messaging sunar.
- Silme islemi confirm modal olmadan gerceklesmez.
- Plan bilgisi (`Free/Pro`) ve kalan kapasite dashboard'da okunur olur.

## Flow 3 - Workspace Setup

User story:

As a user, I want to create a new workspace with app name, platform, and launch date so I can immediately start the checklist.

Primary route:

- `/app/new`

Happy path:

1. Kullanici dashboard veya landing uzerinden `/app/new` ekranina gelir.
2. `name`, `platform`, `launch date` alanlarini doldurur.
3. Form validasyonunu gecer.
4. Sistem app kaydini olusturur.
5. Kullanici checklist workspace'ine yonlendirilir.

Edge cases ve recovery:

- Required alanlar eksikse submit bloklanir
- Free plan limiti doluysa create yerine upgrade / blocker messaging gosterilir
- Schema veya profile sync eksikse kullanici duvara toslamaz; aciklayici notice gorur
- Onboarding'den gelen kullanici burada "ilk adim" baglamini korur

Acceptance criteria:

- `name`, `platform`, `launch date` required'dir.
- Form tek ekranda net hiyerarsi ile okunur.
- Free plan kullanicisi aktif limiti asamaz.
- Basarili create sonrasi kullanici `/app/[id]` ekranina gider.
- Basarili create sonrasi yeni board dashboard tarafinda da gorunur.

## Flow 4 - Pre-launch Checklist

User story:

As a user, I want a categorized checklist with clear progress signals, fast completion toggles, and recovery when something fails.

Primary route:

- `/app/[id]`

Happy path:

1. Kullanici workspace checklist ekranina gelir.
2. Hero alaninda app name, platform, overall progress ve countdown gorur.
3. Checklist item'larini `Store Prep`, `ASO`, `Creative`, `Legal` bloklari halinde gorur.
4. Bir item checkbox'ini tiklayinca UI optimistic update ile aninda degisir.
5. Progress genel ve kategori bazinda aninda guncellenir.
6. `Siradaki en kritik is` sinyali tamamlanmamis item'lar icinden oncelige gore belirlenir.

Edge cases ve recovery:

- Veri yuklenirken hero ve kategori bloklari skeleton gosterir
- Sunucu toggle istegini reddederse rollback yapilir
- Hata durumunda `Guncelleme basarisiz, tekrar dene` toast'u gorunur
- Checklist verisi genel olarak yuklenemezse sayfa duzeyinde error state + `Yeniden Dene`
- CMS tarafinda sorun varsa cache/fallback + bilgi notice kullanilir

Acceptance criteria:

- Hero alaninda app name, platform, progress, countdown gorunur.
- Kategori bloklari tamamlanan/toplam sayisini gosterir.
- Toggle aksiyonu optimistic update kullanir.
- Basarili toggle sonrasi `Kaydedildi` toast'u gorunur.
- Basarisiz toggle sonrasi rollback calisir.
- `Siradaki en kritik is` sinyali gorunur.
- Loading aninda skeleton, fatal hata aninda retry state vardir.

## Flow 5 - Item Detail ve Deliverables

User story:

As a user, I want to open an item detail surface, read guidance, and attach link/note/file deliverables without losing checklist context.

Primary surface:

- Checklist icindeki item detail paneli

Happy path:

1. Kullanici checkbox disindaki item satirina tiklar.
2. Desktop'ta slide-over, mobilde bottom sheet acilir.
3. Panel icinde item basligi, durumu, CMS guide text ve tool links gorulur.
4. Kullanici `Link`, `Not`, `Dosya` sekmelerinden biriyle deliverable ekler.
5. Gecerli deliverable aninda liste basina eklenir.
6. Panel kapaninca checklist item satirindaki deliverable sayisi guncel kalir.

Edge cases ve recovery:

- URL gecersizse alan altinda yardim metni gorunur ve kaydetme aksiyonu disable olur
- Dosya `10MB` ustundeyse secim aninda hata gosterilir ve upload baslamaz
- Delete aksiyonu satir duzeyinde confirm ister
- Form validasyon hatalari submit'te degil, alan seviyesinde zamanli sekilde gorunur

Acceptance criteria:

- Detail panel route degistirmeden acilir / kapanir.
- Desktop'ta slide-over, mobilde bottom sheet davranisi vardir.
- `Link`, `Not`, `Dosya` sekmeli form vardir.
- Basarili kayit deliverable listesini aninda gunceller ve `Kaydedildi` toast'u verir.
- Gecersiz URL icin yardim metni gorunur.
- `10MB` ustu dosya yuklenmez.
- Deliverable silme confirm ister.
- Panel kapandiginda item uzerindeki deliverable count gunceldir.

## Flow 6 - Post-launch Routine

User story:

As a user, I want a weekly routine board that helps me continue growth work after launch with the same clarity as the checklist.

Primary route:

- `/app/[id]/post-launch`

Happy path:

1. Kullanici post-launch ekranina gelir.
2. Varsayilan olarak mevcut hafta gorunur.
3. Hafta numarasi, tamamlanan gorev sayisi ve toplam sayi gorulur.
4. Kullanici bir gorevi tamamlar; UI optimistic update ile aninda degisir.
5. Haftalik completion ozeti guncellenir.
6. Kullanici week selector ile gecmis haftalara gider.

Edge cases ve recovery:

- Week secimi degistiginde yalniz secilen haftanin log'lari gosterilir
- Toggle idempotent davranir
- Routine verisi yuklenemezse hata + `Yeniden Dene`
- Checklist'e geri donus linki gorunur

Acceptance criteria:

- Mevcut hafta varsayilan olarak acilir.
- Hafta bazli durum ayri okunur.
- Toggle optimistic update ile calisir.
- `This week completion` veya esdeger haftalik ozet gorunur.
- Gecmis haftalara gecis mumkundur.
- Checklist'e geri donus aksiyonu gorunur.

## Flow 7 - Export

User story:

As a user, I want to export my workspace status as a report so I can share it with teammates or investors.

Primary route:

- `/app/[id]/export`

Happy path:

1. Kullanici export ekranina gelir.
2. `PDF` ve `Markdown` format kartlarini gorur.
3. Formatlardan birini secer.
4. `Export Et` aksiyonunu kullanir.
5. Sistem loading durumu gosterir ve butonu disable eder.
6. Basarili durumda dosya indirmesi baslar ve success toast gorunur.

Edge cases ve recovery:

- Export sirasinda hata olursa hata mesaji + butonun yeniden aktiflesmesi gerekir
- Ekranda workspace summary preview gorunur
- Checklist'e geri donus linki gorunur

Acceptance criteria:

- Export ekraninda format kartlari ve her formatin ozet icerigi gorunur.
- Export loading state acikca hissedilir.
- Basarili export indirmeyi baslatir ve basari toast'u verir.
- Hata durumunda kullanici `tekrar dene` mantigini anlayabilir.
- Dosya adlandirma standardi korunur: `{slug}-pre-launch-raporu.{pdf|md}`.
- Workspace summary preview gorunur.

## Flow 8 - Navigation, Error, Empty ve Sign-out Davranislari

User story:

As a user, I want the app to stay navigable and recoverable even when data is missing, loading, or broken.

Kapsam:

- app header
- workspace nav
- empty states
- error states
- sign out

Acceptance criteria:

- Tum korumali ekranlarda tutarli bir ust navigasyon bulunur.
- Workspace icinde `Checklist`, `Post-launch`, `Export` gecisleri gorunur.
- Tarayici geri butonu ekranlar arasi gecisi bozmadan destekler.
- Sign out sonrasi kullanici auth ekranina doner ve protected route'lara erisemez.
- Tum empty state'lerde yonlendirici CTA bulunur.
- API veya sayfa duzeyi hata durumlarinda aciklayici mesaj + recovery aksiyonu vardir.
- Sayfa duzeyi hata ekranlarinda en az bir `Dashboard'a Don` veya esdeger emniyet cikisi bulunur.

## UX Quality Bar

Her flow release oncesi su kontrollerden gecmeli:

- 3-click rule: ana hedefe 3 aksiyonda varis
- copy clarity: her ekranda birincil aksiyon net
- state completeness: loading, empty, error, success durumlari var
- mobile viability: `390px` genislikte temel gorev tamamlanabiliyor
- consistency: ayni niyet ayni buton diliyle temsil ediliyor

## Product Ritual (Weekly)

Her hafta sabit ritim:

1. Monday: Flow review (Product + Design + Dev)
2. Tuesday-Wednesday: Build
3. Thursday: UX QA + bugfix
4. Friday: release decision + retrospective

## Immediate Next Step

Bu handoff'a gore en kritik acik odaklar:

1. Flow 0 icin landing comprehension, CTA hiyerarsisi ve kisa nasil-calisir anlatimini sertlestirmek
2. Flow 1 ve Flow 3 icin kesintisiz `landing -> /auth -> /app/new -> /app/[id]` zincirini sertlestirmek
3. Flow 2, Flow 4 ve Flow 5 icin dashboard `next move`, checklist optimistic update, skeleton/error recovery ve mobile detail-panel davranislarini tamamlamak
4. Flow 8 kapsaminda ortak empty/error/retry pattern'lerini tum kritik yuzeylerde standartlastirmak
