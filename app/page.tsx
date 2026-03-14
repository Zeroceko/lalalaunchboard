import Link from "next/link";
import { redirect } from "next/navigation";

import { ChecklistPreview } from "@/components/checklist/ChecklistPreview";
import {
  LaunchBadge,
  LaunchHero,
  LaunchPage,
  LaunchPanel,
  LaunchRailList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";

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

export default async function HomePage() {
  if (hasSupabaseEnv()) {
    try {
      const { user } = await getSessionContext();
      if (user) {
        redirect("/dashboard");
      }
    } catch (error) {
      console.warn("HomePage session check failed; rendering landing.", error);
    }
  }

  return (
    <LaunchPage className="min-h-screen max-w-[1240px] py-6 sm:py-8">
      <div className="space-y-5 sm:space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Lalalaunchboard
            </span>
            <LaunchBadge tone="brand">Urununu pazara hazirla</LaunchBadge>
            <LaunchBadge tone="info">Launch & grow</LaunchBadge>
            <LaunchBadge tone="warning">Tek ekranda takip</LaunchBadge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
              Sign in
            </Link>
            <Link href="/auth?tab=register" className={launchButtonStyles.primary}>
              Sign up
            </Link>
          </div>
        </div>

        <LaunchHero
          eyebrow="Launch operating system"
          title="App launch surecini tek board'da netlestir ve paniksiz ilerlet."
          description="Lalalaunchboard, indie builder'lar icin checklist, deliverable, countdown ve routine akisini tek yerde toplar. Bugun ne satildigi net, sonra neyin eksik oldugu net, sonraki hamle de tek ekranda okunur."
          actions={
            <>
              <Link href="/auth?tab=register" className={launchButtonStyles.primary}>
                Sign up
              </Link>
              <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
                Sign in
              </Link>
            </>
          }
          aside={
            <LaunchPanel tone="default" className="space-y-5">
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

        <LaunchPanel tone="tint" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
            <div className="space-y-4">
              <LaunchBadge tone="neutral">Ozet</LaunchBadge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                Ilk boardunu kur. Lansmanini calistir. Buyumeyi takip et.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
                Bugun launch odakli bir board ile baslarsin: checklist, deliverable,
                countdown ve routine tek yerde. Ileride ayni duzen, daha genis app
                operasyonuna dogru genisler.
              </p>
            </div>

            <LaunchRailList
              eyebrow="3 Adim"
              title="Nasil calisir?"
              description="Ilk board'u kur, adimlari kapat, raporu paylas. Ozet bu kadar net."
              items={flowItems}
              className="p-0"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {lifecycleLayers.map((layer) => (
              <LaunchPanel key={layer.title} tone="default" className="space-y-3 p-5">
                <LaunchBadge tone={layer.tone}>{layer.badge}</LaunchBadge>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {layer.title}
                </h3>
                <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {layer.description}
                </p>
              </LaunchPanel>
            ))}
          </div>
        </LaunchPanel>

        <section className="space-y-4">
          <LaunchSectionHeader
            eyebrow="Ne var?"
            title="Tek ekranda calisan launch sistemi"
            description="Parca parca araclar yerine, tek bir ritim veren board yuzeyi."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {productModules.map((module) => (
              <LaunchPanel key={module.title} tone="subtle" className="space-y-3 p-5">
                <LaunchBadge tone="info">Modul</LaunchBadge>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
            <div className="space-y-3">
              <LaunchBadge
                tone="warning"
                className="bg-[hsl(var(--card))/0.12] text-[hsl(var(--surface-dark-foreground))]"
              >
                Start here
              </LaunchBadge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[hsl(var(--surface-dark-foreground))]">
                Ilk boardunu kur, lansmanini calistir, buyumeni takip et.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--surface-dark-muted))]">
                Su an launch odakli. Ileride ayni duzeni daha genis app operasyonuna tasiyacaksin. Bu yuzden bugunku mesaj net, gelecek vizyon da gorunur kalir.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/auth?tab=register" className={launchButtonStyles.primary}>
                Sign up
              </Link>
              <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
                Sign in
              </Link>
            </div>
          </div>
        </LaunchPanel>
      </div>
    </LaunchPage>
  );
}
