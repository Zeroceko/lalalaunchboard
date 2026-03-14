# Handoff

Last updated: 2026-03-15

## Bu sprintte ne oldu?

Bu repo artik yalnizca bir teknik iskelet degil; urunun ilk anlasilir MVP akisi olusmus durumda.

Bu turda tamamlanan ana isler:

- [x] Landing sayfasi pazarlama odakli hale getirildi
- [x] Hero copy ve CTA hiyerarsisi yeniden kuruldu
- [x] `Sign in` / `Sign up` akisi netlestirildi
- [x] Login olmayan kullanici icin dashboard aksiyonlari landing'den kaldirildi
- [x] Login olan kullanici icin `/` -> `/dashboard` yonlendirmesi eklendi
- [x] Auth sayfasi sadeletildi; yalnizca giris/kayit deneyimine indirildi
- [x] Login altina `Uye degil misin? Uye ol`, register altina ters gecis eklendi
- [x] Turkce copy duzeltildi; Turkce karakter ve yazim kurallari uygulandi
- [x] TR / EN dil secici landing ve auth akisina eklendi
- [x] Auth form kopyalari ve API hata mesajlari locale-aware hale getirildi
- [x] Dashboard iki moda ayrildi:
  - uygulama varsa `control desk` + mevcut urun ozeti
  - uygulama yoksa onboarding + `Simdi basla`
- [x] Dashboard kart dili, yalnizca launch prep degil marketing + growth takibini de kapsayacak sekilde guncellendi
- [x] Internal `ops` / control tower route'u ana repo icinde korunmaya devam etti
- [x] Control tower'da tamamlanan lane'ler yer kaplamasin diye detaylar hover/focus ile acilir hale getirildi
- [x] Dashboard AppCard uzerinden "platform / client varyanti ekle" aksiyonlari eklendi
- [x] `/app/new` sayfasi query param ile prefill destekler hale getirildi (`templateName`, `platform`, `mode`, `sourceAppId`)
- [x] Free plan kapasitesi dolu durumlarina "Planlari gor / Ust pakete gec" CTA'si eklendi
- [x] `/pricing` sayfasi eklendi (Starter / Pro / Enterprise plan tanitimi, TR/EN uyumlu)

## Urun vizyonu su anda nasil kilitlendi?

Lalalaunchboard su anda:

- yazilim gelistiricisinin urununu pazara hazirlarken
- pazarlama, launch ve ilk growth islerini
- tek bir operasyon yuzeyinden takip etmesini saglayan bir urun

Mesaj artik su eksende:

- landing'de: `Pazardan once ve pazarda tek yardimcin`
- urun davranisinda: `hazirlik + launch + growth ayni board mantigi icinde`
- vaat tarafinda: bugun launch odakli, yarin daha genis app operations tarafina evrilebilecek

Overpromise etmemek icin:

- hero alani bugunku net degeri anlatiyor
- gelecek vizyonu alt bolumlerde ve dashboard yapisinda sezdiriliyor

## Su an repo icinde gorunur durum

Ana on yuzeyler:

- `/` -> pazarlama odakli landing
- `/auth?tab=login` -> sade giris ekrani
- `/auth?tab=register` -> sade kayit ekrani
- `/pricing` -> planlar (Starter / Pro / Enterprise)
- `/dashboard` -> ana uygulama paneli
- `/settings` -> hesap/plan/guvenlik/tema ayarlari (ilk yuzey)
- `/ops` -> internal control tower
- `/admin` -> portfoy / yonetim paneli

Dashboard davranisi:

- kullanicinin uygulamasi varsa:
  - en ustte mevcut urun ve launch ozeti gorunur
  - launch tarihi, platform, mevcut odak ve control desk bloklari gorunur
  - alt kisimda tum uygulamalar kartlar halinde listelenir
  - her uygulama kartindan yeni platform/client varyanti icin `/app/new` prefill ile devam edilebilir
- hic uygulama yoksa:
  - onboarding odakli bos durum gorunur
  - `Uygulamani ekle -> pazara hazirlik ritmini kur -> launch ve growth takibini baslat` akisi anlatilir
  - `Simdi basla` CTA'si verilir

Auth davranisi:

- auth sayfasinda artik landing benzeri ekstra pazarlama panelleri yok
- yalnizca giris / kayit formu ve form alti gecis aksiyonlari var
- form metinleri secilen dile gore degisiyor

## Kaynak dosyalar

Bu sprintte en kritik degisen dosyalar:

- `app/page.tsx`
- `app/(auth)/auth/page.tsx`
- `app/(app)/dashboard/page.tsx`
- `app/pricing/page.tsx`
- `components/auth/AuthTabs.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`
- `components/dashboard/AppCard.tsx`
- `components/dashboard/AppList.tsx`
- `components/dashboard/NewAppForm.tsx`
- `components/i18n/LocaleSwitcher.tsx`
- `lib/i18n/dictionaries.ts`
- `lib/auth/messages.ts`
- `lib/auth/validation.ts`

## Verifikasyon

Bu turda tekrar dogrulananlar:

- [x] `npm run lint`
- [x] `npm run typecheck`

Not:

- Bu handoff guncellemesi sirasinda `npm run build` tekrar kosulmadi.
- Dev server son calismada `localhost:3001` uzerinden kullaniliyordu.

## Hangi noktadayiz?

Proje artik saf `UI first pass` asamasini gecip su evreye girdi:

- landing / auth / dashboard omurgasi urunlestirildi
- onboarding mantigi dashboard tarafina tasindi
- urun copy'si ve bilgi mimarisi daha bilincli hale geldi

Kisaca:

- `Sprint 1`: buyuk olcude tamamlandi, fakat resmi desktop/mobile QA ve tema karari acik
- `Sprint 2`: fiilen basladi; onboarding, self-explanatory product flow ve adoption iyilestirmeleri uzerindeyiz

## Product, design ve dev ekipleri icin ozet

### Product

Karar verilmis urun cizgisi:

- landing net olmali, kalabalik olmamali
- CTA ilk olarak auth'a goturmeli
- login olmayan kisi dashboard aksiyonu gormemeli
- dashboard sadece app listesi degil, bir `operating desk` gibi calismali
- urun launch prep kadar marketing ve growth takibini de ayni yuzeyde gostermeli

Acik product kararlar:

- hangi growth KPI'lari ilk dashboard KPI bandina girecek?
- hangi event'ler `Flow 0` ve onboarding olcumu icin zorunlu olacak?
- free / pro ayrimi dashboard UX'inde ne kadar belirgin olacak?

Plan karari (uygulama limiti politikasini sonraki developer uygulayacak):

- Free plan: `1 urun`, `1 platform`
- Ucretli plan: `2 urun`, `3 platform`
- Daha buyuk paket: `3 urun`, `5 platform`
- Enterprise: `talep kadar urun`, `x adet platform`

Not: Bugun sistem sadece `free` vs `pro` ayrimini ve urun (board) limitini enforce ediyor.
Yeni paket yapisi icin giris noktalar:

- `types/index.ts` -> `export type Plan = ...`
- `lib/apps/service.ts` -> `buildAppLimitState(...)`
- Supabase `users.plan` + RLS/trigger'lar (migrations altinda)
- UI vitrini: `/pricing` ve `lib/i18n/dictionaries.ts` (pricing metinleri)

### Design

Tasarim yoresi:

- landing marketing page gibi davranmali
- fazla cerceve / kutu / panel goruntusu azaltildi; bu yon korunmali
- dashboard referanslari:
  - sol-nav + KPI + control desk mantigi
  - tek bakista okunabilen karar bloklari
  - operasyonu yoneten bir masa hissi

Acik design isleri:

- dashboard ustunde filter bar / tarih / kanal / kategori secicileri
- desktop/mobile spacing QA
- app shell genelinde daha rafine tipografi ve ritim

### Development

Teknik notlar:

- locale secimi cookie ile tutuluyor
- auth validation ve auth API mesajlari locale-aware
- landing server component olarak session kontrolu yapiyor
- Supabase env varsa signed-in user `/dashboard`'a yonlendiriliyor
- middleware korumasi dashboard/app/settings/admin/ops/auth tarafinda aktif

Acik dev isleri:

- dashboard'un ic verileri bugun hala launch-centric; gercek growth KPI alanlari sonra eklenmeli
- TR/EN ceviri sistemi landing ve auth'ta aktif, dashboard/app shell'e yayilmasi gerekiyor
- analytics event tracking henuz eklenmedi

## Siradaki en mantikli isler

Bir sonraki blok icin en yuksek getirili sira:

1. Dashboard filter bar ve KPI bandini netlestir
2. Dashboard / app shell genelinde tam TR/EN locale yayilimi yap
3. `Flow 0` ve onboarding icin analytics event'leri ekle
4. Mobile + desktop UI QA yap
5. Checklist detail / deliverable UX polish turune geri don

## Kritik eksikler / blocker olmayan ama bilinmesi gerekenler

- Hosted Supabase cutover henuz yapilmadi
- Gercek live env smoke henuz tamamlanmadi
- Hosted taraf icin `.env.local` ve CLI access token hala gerekli
- HCaptcha ve Supabase key'leri olmadan auth fallback notice'lari normal davranis
- Dashboard'taki growth takibi bugun daha cok copy / bilgi mimarisi duzeyinde; gercek analytics katmani sonraki asama

## README ile iliski

Bu dosya ekip ici operasyonel handoff'tur.

- teknik onboarding ve calistirma adimlari icin: `README.md`
- resmi kapsam ve plan icin: `specs/`
- urun akislari icin: `specs/flows.md`
- gorev listesi ve isaretli ilerleme icin: `specs/tasks.md`
