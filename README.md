# Lalalaunchboard

Lalalaunchboard, bir yazilim gelistiricisinin urununu pazara hazirlarken ve
pazara ciktiktan sonraki ilk growth islerini takip ederken kullanacagi operasyon
yuzeyidir.

Calisan urun mesaji su anda su eksende kilitli:

- pazardan once ve pazarda tek yardimcin
- launch prep, marketing ve growth tek board mantigi icinde
- bugun launch odakli, yarin daha genis app operations tarafina genisleyebilir

## Bu repo ne durumda?

Ana akisin ilk urunlestirilmis versiyonu hazir:

- pazarlama odakli landing sayfasi
- sade login / register deneyimi
- signed-in user icin dogrudan dashboard yonlendirmesi
- uygulama varsa ozet gosteren dashboard
- uygulama yoksa onboarding gosteren dashboard
- internal `ops` route'u ve yonetim yuzeyleri
- checklist, routine ve export omurgasi

Kisacasi:

- landing artik bir marketing page
- auth artik yalnizca giris / kayit deneyimi
- dashboard artik yalnizca app listesi degil, bir control desk

## Source of truth

Resmi urun ve teknik kapsam `specs/` altindadir:

- `specs/requirements.md`
- `specs/design.md`
- `specs/tasks.md`
- `specs/roadmap.md`
- `specs/flows.md`

Operasyonel durum ozeti icin:

- `HANDOFF.md`

## Onemli rotalar

- `/` -> landing
- `/auth?tab=login` -> giris
- `/auth?tab=register` -> kayit
- `/dashboard` -> ana panel
- `/app/new` -> yeni uygulama / board olusturma
- `/ops` -> internal control tower
- `/admin` -> portfoy / yonetim paneli

## Guncel urun davranisi

Landing:

- login olmayan kullanici dashboard butonu gormez
- ustte TR / EN secici vardir
- primary CTA auth akisina gider

Auth:

- yalnizca form gorunur
- login altinda `Uye degil misin? Uye ol`
- register altinda `Zaten uye misin? Giris yap`

Dashboard:

- uygulama varsa:
  - en ustte mevcut uygulama ve operasyon ozeti gorunur
  - launch + marketing + growth control desk mantigi kullanilir
- uygulama yoksa:
  - onboarding adimlari ve `Simdi basla` gorunur

## Proje yapisi

- `app/` -> route'lar ve API handler'lari
- `components/` -> UI ve ekran bileşenleri
- `lib/` -> servisler, validation, auth ve entegrasyon yardimcilari
- `types/` -> paylasilan TypeScript tipleri
- `specs/` -> resmi plan ve kapsam
- `vault/` -> notlar ve calisma hafizasi

Workspace seviyesi:

- `LALALaunchBoard/Development` -> aktif uygulama kodu
- `LALALaunchBoard/Product` -> urun calismalari icin ayrilan alan
- `LALALaunchBoard/Design - UI:UX` -> tasarim sandbox / handoff alani

## Lokal kurulum

1. `.env.local.example` dosyasini `.env.local` olarak kopyala
2. gerekli env degiskenlerini doldur
3. dependency kur

```bash
npm install
```

4. uygulamayi calistir

```bash
npm run dev
```

## Gerekli env degiskenleri

Gercek auth akisi icin:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` veya publishable key
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` veya `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `HCAPTCHA_SECRET_KEY`

Canli CMS icin opsiyonel:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_DELIVERY_TOKEN`
- `CONTENTFUL_PREVIEW_TOKEN`
- `CONTENTFUL_ENVIRONMENT`
- `CONTENTFUL_REVALIDATE_SECRET`

## Dogrulama

Son guncel kod turlarinda dogrulananlar:

- `npm run lint`
- `npm run typecheck`

Bu repo gecmisinde ayrica asagidaki akislari gecen turlar oldu:

- `npm run build`
- `npm run test:properties`
- `npm run smoke:db:local`
- Docker tabanli `web-test` akisi

## Simdi neredeyiz?

Urun, `ilk UI pass` asamasindan cikti ve su an `productized MVP` evresine girdi.

Bu ne demek:

- bilgi mimarisi daha net
- copy daha bilincli
- dashboard daha operasyonel
- onboarding daha gorunur

Ama sunlar hala acik:

- dashboard filtre bandi ve KPI sistemi
- tum app shell'de TR / EN yayilimi
- analytics / event tracking
- mobile + desktop UI QA
- hosted env cutover

## Ekip devir notu

Bu repo su anda baska bir developer, tasarimci veya urun ekibine devredilebilir durumdadir.

Baslangic noktasi olarak sirasi:

1. `HANDOFF.md` oku
2. `specs/tasks.md` icindeki isaretli durumlari kontrol et
3. `specs/flows.md` ile ana urun akislarini hizala
4. ilgili route'u lokal calistir ve UI / davranisi dogrula

## Not

- Aktif branch son calismalarda `feat/workspace-surfaces-flow-docs` idi
- `main` korumali olabilir; push ve release akisinda branch / PR mantigi korunmali
