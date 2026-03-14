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
      "Tum launch boardlarini, tarihlerini ve odak alanlarini tek bakista gorursun."
  },
  {
    title: "New App Setup",
    description:
      "Yeni bir uygulama icin isim, platform ve tarih kararlarini hizlica sabitlersin."
  },
  {
    title: "Pre-launch Checklist",
    description:
      "Store prep, kreatif teslimler ve yayin hazirliklari board mantiginda ilerler."
  },
  {
    title: "Progress",
    description:
      "Tamamlanan isler ile acik riskler ayni sistem icinde gorunur olur."
  },
  {
    title: "Countdown",
    description:
      "Launch tarihi uzak bir hedef degil, gunluk karar ritmini belirleyen merkez olur."
  },
  {
    title: "Post-launch Routine",
    description:
      "Lansman sonrasi buyume gorevleri urunun devam eden akisina baglanir."
  }
];

const flowItems = [
  {
    title: "Boardu kur",
    description:
      "Isim, platform ve lansman tarihiyle operasyon yuzeyini baslat.",
    badge: "01",
    tone: "info" as const
  },
  {
    title: "Lansmani calistir",
    description:
      "Checklist, progress ve countdown ile uygulamayi kontrollu bicimde hazirla.",
    badge: "02",
    tone: "warning" as const
  },
  {
    title: "Buyumeyi surdur",
    description:
      "Post-launch rutinleri ve export ile boardu yasayan bir sisteme donustur.",
    badge: "03",
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
            <LaunchBadge tone="brand">Prep, launch, grow</LaunchBadge>
            <LaunchBadge tone="warning">Board-first product</LaunchBadge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth" className={launchButtonStyles.secondary}>
              Auth
            </Link>
            <Link href="/dashboard" className={launchButtonStyles.secondary}>
              Dashboard
            </Link>
          </div>
        </div>

        <LaunchHero
          eyebrow="Launch Operating System"
          title="App lansmanini daginik notlardan cikar, tek board uzerinde yonet."
          description="Lalalaunchboard, indie gelistiriciler icin setup, checklist, countdown, progress ve post-launch rutinlerini tek bir urun ritmi icinde toplar. Amac daha cok kart degil, daha net karar almak."
          actions={
            <>
              <Link href="/app/new" className={launchButtonStyles.primary}>
                Yeni workspace baslat
              </Link>
              <Link href="/dashboard" className={launchButtonStyles.secondary}>
                Dashboardu gor
              </Link>
            </>
          }
          aside={
            <LaunchPanel tone="default" className="space-y-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <LaunchBadge tone="info">Live board preview</LaunchBadge>
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
                    Hazirlik islerinin cogu tamamlandi, kritik kalanlar gorunur
                    durumda.
                  </p>
                </div>
                <div
                  data-tone="warning"
                  className="launch-glass-widget rounded-[1.45rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--amber-soft))/0.64] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Siradaki hamle
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                    App Store kreatif paketi
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    Son teslim listesi ve ekran goruntuleri bu asamada netlesir.
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
            label="Urun yaklasimi"
            value="Board-first"
            detail="Her app tekil kart degil, kendi operasyon yuzeyi gibi ele alinir."
            tone="brand"
          />
          <LaunchMetricCard
            label="Hedef kullanici"
            value="Indie makers"
            detail="Daginik araclar yerine tek akis isteyen gelistiriciler icin tasarlanir."
            tone="warning"
          />
          <LaunchMetricCard
            label="Ana fayda"
            value="Daha net karar"
            detail="Hazirlik, tarih ve siradaki hamle ayni anda gorunur olur."
            tone="success"
          />
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <LaunchSectionHeader
              eyebrow="Problem"
              title="Launch sureci genelde araclar arasinda parcalanir"
              description="Notlar bir yerde, tarih baska yerde, yapilacaklar baska yerde kalinca ekipler degil solo gelistiriciler bile ritmi kaybeder. Lalalaunchboard bunu tek board mantigina indirger."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Tek gorunur ritim",
                  description:
                    "Tarih, ilerleme ve odak alani ayni ekranda gorunur kalir."
                },
                {
                  title: "Daha az context switch",
                  description:
                    "Farkli notlar ve tablar arasinda gezinmek yerine ayni board uzerinde kalirsin."
                },
                {
                  title: "Daha guclu hafiza",
                  description:
                    "Her app kendi boardu ile tekrar kullanilabilir bir launch hafizasi birakir."
                }
              ].map((item) => (
                <LaunchPanel key={item.title} tone="default" className="space-y-3">
                  <LaunchBadge tone="neutral">Value</LaunchBadge>
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
            eyebrow="Flow"
            title="Urun nasil calisir?"
            description="Lalalaunchboard'un kullanim amaci tek launch gununu degil, tum hazirlik ve sonrasi sureci ayni board uzerinde isletmektir."
            items={flowItems}
          />
        </section>

        <section className="space-y-5">
          <LaunchSectionHeader
            eyebrow="Modules"
            title="Birbirine bagli launch modulleri"
            description="Her modul tek basina feature gibi gorunse de aslinda ayni board mantiginin farkli asamalaridir."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productModules.map((module) => (
              <LaunchPanel key={module.title} tone="default" className="space-y-3 p-5">
                <LaunchBadge tone="info">Module</LaunchBadge>
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
                Start here
              </LaunchBadge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[hsl(var(--surface-dark-foreground))]">
                Ilk uygulaman icin boardu kur ve tum launch akisini ayni yerden yonet.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--surface-dark-muted))]">
                Dashboard, setup, checklist ve growth yuzeyleri artik ortak bir UI kit
                ve daha net urun dili ile sekilleniyor.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/app/new" className={launchButtonStyles.primary}>
                Workspace olustur
              </Link>
              <Link href="/auth" className={launchButtonStyles.secondary}>
                Auth akisina bak
              </Link>
            </div>
          </div>
        </LaunchPanel>
      </div>
    </LaunchPage>
  );
}
