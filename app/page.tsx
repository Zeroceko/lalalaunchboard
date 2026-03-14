import Link from "next/link";

import { ChecklistPreview } from "@/components/checklist/ChecklistPreview";
import {
  LaunchBadge,
  LaunchHero,
  LaunchMetricCard,
  LaunchPage,
  LaunchPanel,
  LaunchRailList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";

const productModules = [
  {
    title: "Dashboard",
    description:
      "Tum projelerini tek listede gorur, nereden baslaman gerektigini hemen anlarsin."
  },
  {
    title: "Workspace Kurulumu",
    description:
      "Uygulama adi, platform ve hedef tarih bilgilerini 1 dakikada tamamlarsin."
  },
  {
    title: "Yapilacaklar Listesi",
    description:
      "Lansman oncesi tum adimlari sirasiyla gorur ve tiklayarak kapatirsin."
  },
  {
    title: "Ilerleme Takibi",
    description:
      "Neler bitti, neler eksik tek ekranda gorundugu icin gecikmeleri erken fark edersin."
  },
  {
    title: "Geri Sayim",
    description:
      "Yayin tarihine kalan gunu gorur, onceligini her gun daha dogru belirlersin."
  },
  {
    title: "Yayin Sonrasi Plan",
    description:
      "Yayin sonrasi buyume islerini de ayni duzenin icinde takip etmeye devam edersin."
  }
];

const flowItems = [
  {
    title: "Projeni ekle",
    description:
      "Uygulama adini, platformunu ve hedef tarihini girerek basla.",
    badge: "01",
    tone: "info" as const
  },
  {
    title: "Adim adim tamamla",
    description:
      "Yapilacaklar listesini kapat, teslim dosyalarini ekle, ilerlemeni izle.",
    badge: "02",
    tone: "warning" as const
  },
  {
    title: "Raporla ve paylas",
    description:
      "PDF veya Markdown rapor al, ekip veya partnerlerle aninda paylas.",
    badge: "03",
    tone: "success" as const
  }
];

const lifecycleLayers = [
  {
    title: "Boardu kur",
    description:
      "Isim, platform ve lansman tarihiyle operasyon yuzeyini baslat; ilk kararlar ayni board mantigina otursun.",
    badge: "Launch",
    tone: "info" as const
  },
  {
    title: "Lansmani calistir",
    description:
      "Checklist, progress ve countdown ile pre-launch hazirligini kontrollu sekilde ilerlet.",
    badge: "Operate",
    tone: "warning" as const
  },
  {
    title: "Buyumeyi yonet",
    description:
      "Lansman bittiginde sistem bitmez; routine ve export katmanlari ayni boardun devamina donusur.",
    badge: "Grow",
    tone: "success" as const
  }
];

export default function HomePage() {
  return (
    <LaunchPage className="min-h-screen py-8 sm:py-10">
      <div className="space-y-8 sm:space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Lalalaunchboard
            </span>
            <LaunchBadge tone="brand">Urununu pazara hazirla</LaunchBadge>
            <LaunchBadge tone="info">Launch & grow</LaunchBadge>
            <LaunchBadge tone="warning">Tek ekranda takip</LaunchBadge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth" className={launchButtonStyles.secondary}>
              Giris / Kayit
            </Link>
            <Link href="/dashboard" className={launchButtonStyles.secondary}>
              Dashboard
            </Link>
          </div>
        </div>

        <LaunchHero
          eyebrow="Lansmana Hazirlik Araci"
          title="Ne yapacagini her gun net gor, lansmana paniksiz hazirlan."
          description="Lalalaunchboard, teknik olmayan kullanicilarin bile kolayca anlayacagi bir sistem sunar. Yapilacaklar, teslim dosyalari ve geri sayim tek yerde oldugu icin sureci daha rahat yonetirsin."
          actions={
            <>
              <Link href="/app/new" className={launchButtonStyles.primary}>
                Ucretsiz basla
              </Link>
              <Link href="/dashboard" className={launchButtonStyles.secondary}>
                Ornek dashboard
              </Link>
            </>
          }
          aside={
            <LaunchPanel tone="default" className="space-y-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <LaunchBadge tone="info">Ornek calisma alani</LaunchBadge>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    FocusFlow
                  </h2>
                </div>
                <LaunchBadge tone="warning">14 gun kaldi</LaunchBadge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  data-tone="brand"
                  className="launch-glass-widget rounded-[1.45rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--brand-soft))/0.56] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Ilerleme
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    %68
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    Yapilacaklarin cogu tamamlandi. Kalan kritik adimlar net gorunuyor.
                  </p>
                </div>
                <div
                  data-tone="warning"
                  className="launch-glass-widget rounded-[1.45rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--amber-soft))/0.64] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Bu hafta odak
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                    Magaza gorselleri
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    Son gorsel paketi bitince lansman adimlari daha guvenli ilerler.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {["Checklist", "Countdown", "Routine"].map((item, index) => (
                  <div
                    key={item}
                    data-tone="neutral"
                    className="launch-glass-widget flex items-center gap-3 rounded-[1.2rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.92] px-4 py-3.5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))/0.12] text-sm font-semibold text-[hsl(var(--primary))]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Ayni board sisteminin parcasi olarak calisir.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </LaunchPanel>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <LaunchMetricCard
            label="Kime uygun"
            value="Solo ekipler"
            detail="Tek kisi veya kucuk ekiplerle urun cikaranlar icin tasarlandi."
            tone="brand"
          />
          <LaunchMetricCard
            label="Kurulum suresi"
            value="~2 dakika"
            detail="Hesap acip ilk workspace olusturman cok kisa surer."
            tone="warning"
          />
          <LaunchMetricCard
            label="En buyuk kazanc"
            value="Zihin rahatligi"
            detail="Neyi ne zaman yapacagin netlesir, son dakika stresi azalir."
            tone="success"
          />
        </div>

        <section className="space-y-5">
          <LaunchSectionHeader
            eyebrow="Lifecycle"
            title="Tek launch gunu degil, butun urun ritmi"
            description="Product manager tarafindaki `launch -> operate -> grow` bakisini landing'e de tasidim. Boylece Lalalaunchboard yalnizca checklist araci gibi degil, daha uzun omurlu bir operasyon sistemi gibi okunur."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {lifecycleLayers.map((layer) => (
              <LaunchPanel key={layer.title} tone="default" className="space-y-3 p-5">
                <LaunchBadge tone={layer.tone}>{layer.badge}</LaunchBadge>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {layer.title}
                </h3>
                <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {layer.description}
                </p>
              </LaunchPanel>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <LaunchSectionHeader
              eyebrow="Problem"
              title="Lansman sureci karmasik olmak zorunda degil"
              description="Notlarin bir yerde, dosyalarin baska yerde oldugu duzende herkes gecikir. Lalalaunchboard, butun sureci tek bir akisa indirerek kafa karisikligini azaltir."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Neyi yapacagin acik",
                  description:
                    "Tarih, ilerleme ve oncelik ayni ekranda oldugu icin karar vermek kolaylasir."
                },
                {
                  title: "Daha az daginiklik",
                  description:
                    "Farkli tablar arasinda kaybolmadan tum sureci tek yerden yonetirsin."
                },
                {
                  title: "Tekrar kullanilabilir sistem",
                  description:
                    "Her yeni urunde sifirdan dusunmek yerine ayni duzeni tekrar kullanirsin."
                }
              ].map((item) => (
                <LaunchPanel key={item.title} tone="default" className="space-y-3">
                  <LaunchBadge tone="neutral">Fayda</LaunchBadge>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    {item.description}
                  </p>
                </LaunchPanel>
              ))}
            </div>
          </div>

          <LaunchRailList
            eyebrow="3 Adim"
            title="Nasil calisir?"
            description="Ilk projeyi ac, adimlari tamamla, raporu paylas. Butun yol haritasi bu kadar net."
            items={flowItems}
          />
        </section>

        <section className="space-y-5">
          <LaunchSectionHeader
            eyebrow="Ozellikler"
            title="Tek tek arac degil, tek bir sistem"
            description="Butun bolumler birbirine bagli calisir. Bu sayede sureci parcalamadan ilerlersin."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productModules.map((module) => (
              <LaunchPanel key={module.title} tone="default" className="space-y-3 p-5">
                <LaunchBadge tone="info">Ozellik</LaunchBadge>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {module.title}
                </h3>
                <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {module.description}
                </p>
              </LaunchPanel>
            ))}
          </div>
        </section>

        <ChecklistPreview />

        <LaunchPanel tone="dark" className="space-y-5 overflow-hidden">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
            <div className="space-y-3">
              <LaunchBadge
                tone="warning"
                className="bg-[hsl(var(--card))/0.12] text-[hsl(var(--surface-dark-foreground))]"
              >
                Simdi basla
              </LaunchBadge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[hsl(var(--surface-dark-foreground))]">
                2 dakikada hesabini ac, ilk lansman planini kur, sonra buyumeyi takip et.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--surface-dark-muted))]">
                Teknik bilgin olmasa bile bu akisi rahatca yonetebilirsin. Sistem sana yalnizca ne yapman gerektigini degil, sonrasinda nasil ritim koruyacagini da gosterir.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/app/new" className={launchButtonStyles.primary}>
                Ilk workspace&apos;i olustur
              </Link>
              <Link href="/auth" className={launchButtonStyles.secondary}>
                Giris ve kayit
              </Link>
            </div>
          </div>
        </LaunchPanel>
      </div>
    </LaunchPage>
  );
}
