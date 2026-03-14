import Link from "next/link";

import { AppList } from "@/components/dashboard/AppList";
import {
  LaunchBadge,
  LaunchMiniStat,
  LaunchNotice,
  LaunchPage,
  LaunchPanel,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import {
  formatLaunchDate,
  formatPlatformLabel,
  getLaunchCountdown,
  getWorkspaceSnapshot
} from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";
import type { App } from "@/types";

const platformTone: Record<App["platform"], "brand" | "success" | "clay"> = {
  ios: "clay",
  android: "success",
  web: "brand"
};

const controlDeskByPlatform: Record<
  App["platform"],
  Array<{
    title: string;
    description: string;
    tone: "brand" | "warning" | "success";
  }>
> = {
  ios: [
    {
      title: "Pazara hazırlık",
      description:
        "Store metadata, ekran görüntüleri ve release paketi son okumaya alınmalı.",
      tone: "brand"
    },
    {
      title: "Launch iletişimi",
      description:
        "Product Hunt, changelog ve topluluk paylaşımı aynı gün akışına bağlanmalı.",
      tone: "warning"
    },
    {
      title: "Growth takibi",
      description:
        "İlk hafta yorumlar, dönüşüm ve retention sinyalleri tek yerde izlenmeli.",
      tone: "success"
    }
  ],
  android: [
    {
      title: "Pazara hazırlık",
      description:
        "Play listing, görseller ve phased rollout notları birlikte netleşmeli.",
      tone: "brand"
    },
    {
      title: "Launch iletişimi",
      description:
        "Duyuru akışı, community post'ları ve mağaza notları aynı ritimde hazırlanmalı.",
      tone: "warning"
    },
    {
      title: "Growth takibi",
      description:
        "İlk hafta acquisition, rating ve retention sinyalleri düzenli okunmalı.",
      tone: "success"
    }
  ],
  web: [
    {
      title: "Pazara hazırlık",
      description:
        "Landing, pricing, onboarding ve analitik kurulumu yayına hazır olmalı.",
      tone: "brand"
    },
    {
      title: "Launch iletişimi",
      description:
        "E-posta, sosyal paylaşım, changelog ve waitlist dönüşü aynı planla çalışmalı.",
      tone: "warning"
    },
    {
      title: "Growth takibi",
      description:
        "Signup funnel, aktivasyon ve ilk deneyler dashboard üzerinden izlenmeli.",
      tone: "success"
    }
  ]
};

const onboardingSteps = [
  {
    label: "01",
    title: "Uygulamanı ekle",
    description:
      "İsmi, platformu ve hedef tarihi girerek ürününü bu komuta alanına taşı."
  },
  {
    label: "02",
    title: "Pazara hazırlık ritmini kur",
    description:
      "Checklist, teslim dosyaları ve geri sayım aynı akışta görünür olsun."
  },
  {
    label: "03",
    title: "Launch ve growth takibini başlat",
    description:
      "Duyuru, içerik, funnel ve ilk büyüme işleri tek dashboard içinde toplansın."
  }
];

function renderCreateAction(canCreateApp: boolean) {
  return canCreateApp ? (
    <Link href="/app/new" className={launchButtonStyles.primary}>
      Şimdi başla
    </Link>
  ) : (
    <span className="inline-flex rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.95] px-4 py-3 text-sm font-semibold text-[hsl(var(--warning-foreground))] shadow-[0_12px_30px_hsl(var(--shadow-color)/0.08)]">
      Yeni alan için Pro plan gerekecek
    </span>
  );
}

export default async function DashboardPage() {
  const { supabase, user } = await requireSessionContext();
  let snapshot;

  try {
    snapshot = await getWorkspaceSnapshot(supabase, user.id);
  } catch {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Bağlantı bekleniyor</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Dashboard şu anda veritabanı bağlantısını bekliyor.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Remote Supabase migration tarafı tamamlandığında uygulama özetleri,
            launch akışı ve growth görünümü burada okunur hale gelecek.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  if (!snapshot.profile || !snapshot.limit) {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Profil senkronu</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Workspace verisi henüz hazır değil.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Supabase Auth ve profil senkronu tamamlandığında dashboard otomatik
            olarak aktif hale gelir.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  const primaryApp = snapshot.apps[0] ?? null;
  const createAction = renderCreateAction(snapshot.limit.canCreateApp);

  if (!primaryApp) {
    return (
      <LaunchPage className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_360px]">
          <LaunchPanel tone="dark" className="space-y-8">
            <div className="space-y-4">
              <LaunchBadge
                tone="warning"
                className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
              >
                Onboarding
              </LaunchBadge>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.05em] text-[hsl(var(--surface-dark-foreground))] sm:text-[3.4rem] sm:leading-[0.98]">
                  Ürününü, launch planını ve growth takibini tek dashboard&apos;da başlat.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[hsl(var(--surface-dark-muted))]">
                  Bu alan yalnızca ürün listelemek için değil; pazara hazırlık,
                  duyuru akışı ve ilk büyüme ritmini tek yerden yönetmek için var.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[hsl(var(--surface-dark-foreground))/0.1]">
              {onboardingSteps.map((step) => (
                <div
                  key={step.label}
                  className="grid gap-3 py-5 sm:grid-cols-[88px_minmax(0,1fr)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--surface-dark-muted))]">
                    {step.label}
                  </p>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[hsl(var(--surface-dark-foreground))]">
                      {step.title}
                    </h2>
                    <p className="text-base leading-7 text-[hsl(var(--surface-dark-muted))]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </LaunchPanel>

          <LaunchPanel tone="tint" className="space-y-6">
            <div className="space-y-3">
              <LaunchBadge tone="brand">Şimdi başla</LaunchBadge>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                İlk uygulamanı ekle.
              </h2>
              <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
                İlk kayıtla birlikte pazarlama, growth ve hazırlık işleri için tek
                bir kontrol masası açılır.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.4rem] bg-[hsl(var(--card))/0.78] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]">
                <p className="text-sm font-semibold text-foreground">Pazara hazırlık</p>
                <p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  Checklist, teslim ve tarihleri aynı yerde topla.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[hsl(var(--card))/0.78] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]">
                <p className="text-sm font-semibold text-foreground">Pazarlama akışı</p>
                <p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  Duyuru, içerik ve funnel işlerini launch ritmine bağla.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[hsl(var(--card))/0.78] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]">
                <p className="text-sm font-semibold text-foreground">Growth görünümü</p>
                <p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  Yayın sonrasında da aynı masadan devam et.
                </p>
              </div>
            </div>

            {createAction}
          </LaunchPanel>
        </div>
      </LaunchPage>
    );
  }

  const countdown = getLaunchCountdown(primaryApp.launch_date);
  const controlDesk = controlDeskByPlatform[primaryApp.platform];

  return (
    <LaunchPage className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_380px]">
        <section className="overflow-hidden rounded-[2.4rem] border border-[hsl(var(--border))/0.56] bg-[linear-gradient(145deg,hsl(var(--surface-dark-start)),hsl(var(--surface-dark-mid))_55%,hsl(var(--surface-dark-end)))] px-6 py-6 shadow-[0_34px_96px_hsl(var(--shadow-color)/0.2)] sm:px-8 sm:py-8">
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <LaunchBadge
                    tone={platformTone[primaryApp.platform]}
                    className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
                  >
                    {formatPlatformLabel(primaryApp.platform)}
                  </LaunchBadge>
                  <LaunchBadge
                    tone="warning"
                    className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
                  >
                    {countdown}
                  </LaunchBadge>
                </div>

                <div className="space-y-3">
                  <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-[hsl(var(--surface-dark-foreground))] sm:text-[3.3rem] sm:leading-[0.98]">
                    {primaryApp.name}
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-[hsl(var(--surface-dark-muted))]">
                    Mevcut ana uygulaman burada öne çıkıyor. Pazara hazırlık,
                    launch iletişimi ve growth takibi aynı kontrol masasında
                    okunuyor.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.6rem] bg-[hsl(var(--surface-dark-foreground))/0.06] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--surface-dark-muted))]">
                  Launch tarihi
                </p>
                <p className="mt-2 text-lg font-semibold text-[hsl(var(--surface-dark-foreground))]">
                  {formatLaunchDate(primaryApp.launch_date)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.55rem] bg-[hsl(var(--surface-dark-foreground))/0.06] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--surface-dark-muted))]">
                  Mevcut ürün
                </p>
                <p className="mt-2 text-lg font-semibold text-[hsl(var(--surface-dark-foreground))]">
                  {primaryApp.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-[hsl(var(--surface-dark-muted))]">
                  Bugün en yakın launch odağı bu çalışma alanında.
                </p>
              </div>
              <div className="rounded-[1.55rem] bg-[hsl(var(--surface-dark-foreground))/0.06] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--surface-dark-muted))]">
                  Operasyon modu
                </p>
                <p className="mt-2 text-lg font-semibold text-[hsl(var(--surface-dark-foreground))]">
                  Prep + Marketing + Growth
                </p>
                <p className="mt-1 text-sm leading-6 text-[hsl(var(--surface-dark-muted))]">
                  Tek ekrandan tüm etkinlikleri okumak için kuruldu.
                </p>
              </div>
              <div className="rounded-[1.55rem] bg-[hsl(var(--surface-dark-foreground))/0.06] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--surface-dark-muted))]">
                  Sonraki adım
                </p>
                <p className="mt-2 text-lg font-semibold text-[hsl(var(--surface-dark-foreground))]">
                  Kontrol masasını aç
                </p>
                <p className="mt-1 text-sm leading-6 text-[hsl(var(--surface-dark-muted))]">
                  Checklist ve post-launch yüzeyleriyle akışı ilerlet.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/app/${primaryApp.id}`} className={launchButtonStyles.primary}>
                Checklist
              </Link>
              <Link
                href={`/app/${primaryApp.id}/post-launch`}
                className={launchButtonStyles.secondary}
              >
                Growth alanı
              </Link>
              <Link href="/ops" className={launchButtonStyles.secondary}>
                Control tower
              </Link>
            </div>
          </div>
        </section>

        <LaunchPanel tone="tint" className="space-y-5">
          <div className="space-y-3">
            <LaunchBadge tone="clay">Control desk</LaunchBadge>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
              Bugün buraya bak.
            </h2>
            <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
              Geliştirici olarak pazarlama, growth ve ürün hazırlığını aynı bakışta
              takip edebilmen için üst katman bu üç odağa ayrıldı.
            </p>
          </div>

          <div className="space-y-3">
            {controlDesk.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[hsl(var(--border))/0.52] bg-[hsl(var(--card))/0.82] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-[hsl(var(--surface-inset))/0.92] text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                    {index + 1}
                  </span>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {snapshot.limit.canCreateApp ? (
            <Link href="/app/new" className={launchButtonStyles.secondary}>
              Yeni uygulama ekle
            </Link>
          ) : null}
        </LaunchPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LaunchMiniStat
          label="Aktif uygulamalar"
          value={snapshot.apps.length}
          detail="Tüm launch ve growth yüzeyleri bu listeye bağlı."
          tone="brand"
        />
        <LaunchMiniStat
          label="Ana platform"
          value={formatPlatformLabel(primaryApp.platform)}
          detail="Bugünün önceliği bu ürünün platform tonuna göre okunur."
          tone={platformTone[primaryApp.platform]}
        />
        <LaunchMiniStat
          label="Kapasite"
          value={snapshot.limit.plan === "pro" ? "Pro" : "Free"}
          detail="Yeni uygulama ekleme sınırı burada belirlenir."
          tone="clay"
        />
        <LaunchMiniStat
          label="Açık alan"
          value={
            snapshot.limit.remainingSlots === null
              ? "Sınırsız"
              : snapshot.limit.remainingSlots
          }
          detail={
            snapshot.limit.remainingSlots === null
              ? "Yeni ürün geldikçe dashboard büyümeye devam eder."
              : "Mevcut plan içinde açılabilecek yeni çalışma alanı."
          }
          tone={snapshot.limit.remainingSlots === 0 ? "warning" : "success"}
        />
      </div>

      {!snapshot.limit.canCreateApp ? (
        <LaunchNotice tone="warning">
          Mevcut free plan kapasitesi dolu. Yeni uygulama eklemek için önce bir
          alan silmen veya daha sonra Pro plana geçmen gerekir.
        </LaunchNotice>
      ) : null}

      <section className="space-y-5">
        <LaunchSectionHeader
          eyebrow="Tüm uygulamalar"
          title="Çalışma alanlarını özetleriyle birlikte gör"
          description="Her kart, ürünün pazara hazırlık sinyallerini ve growth tarafındaki sıradaki işleri aynı anda okutmak için burada."
          action={
            snapshot.limit.canCreateApp ? (
              <Link href="/app/new" className={launchButtonStyles.secondary}>
                Yeni uygulama
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.95] px-4 py-3 text-sm font-semibold text-[hsl(var(--warning-foreground))]">
                Slot dolu
              </span>
            )
          }
        />
        <AppList apps={snapshot.apps} canCreateApp={snapshot.limit.canCreateApp} />
      </section>
    </LaunchPage>
  );
}
