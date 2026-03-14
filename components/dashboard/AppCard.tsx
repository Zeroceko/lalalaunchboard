import Link from "next/link";

import {
  formatLaunchDate,
  formatPlatformLabel,
  getLaunchCountdown
} from "@/lib/apps/service";
import type { App } from "@/types";

import { DeleteAppButton } from "@/components/dashboard/DeleteAppButton";
import {
  LaunchBadge,
  LaunchMiniStat,
  LaunchPanel,
  LaunchPillList,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";

interface AppCardProps {
  app: App;
  canCreateApp?: boolean;
}

const platformTone: Record<App["platform"], "brand" | "success" | "clay"> = {
  ios: "clay",
  android: "success",
  web: "brand"
};

const platformSurface: Record<App["platform"], string> = {
  ios:
    "border-b border-[hsl(var(--clay))/0.18] bg-[linear-gradient(180deg,hsl(var(--clay-soft))/0.98,hsl(var(--card))/0.9)]",
  android:
    "border-b border-[hsl(var(--success))/0.18] bg-[linear-gradient(180deg,hsl(var(--success-soft))/0.98,hsl(var(--card))/0.9)]",
  web:
    "border-b border-[hsl(var(--primary))/0.18] bg-[linear-gradient(180deg,hsl(var(--brand-soft))/0.98,hsl(var(--card))/0.9)]"
};

const platformFocus: Record<App["platform"], string> = {
  ios: "Store sayfasi ve yayin paketi",
  android: "Play rollout ve duyuru akisi",
  web: "Landing, funnel ve signup akisi"
};

const nextMoves: Record<App["platform"], string[]> = {
  ios: [
    "Store sayfasi, gorseller ve ASO metinleri son okumaya alinmali.",
    "Launch gunu duyuru akisi ve paylasim plani tek siraya baglanmali.",
    "Ilk hafta yorum, donusum ve retention sinyalleri izlenmeli."
  ],
  android: [
    "Play listing, gorseller ve rollout plani ayni yuzeyde netlesmeli.",
    "Topluluk paylasimi, changelog ve release note akisi hazirlanmali.",
    "Ilk hafta acquisition, rating ve retention verisi takip edilmeli."
  ],
  web: [
    "Landing, pricing ve CTA'lar yayina hazir hale getirilmeli.",
    "E-posta, sosyal duyuru ve changelog paketi ayni ritimde hazirlanmali.",
    "Signup funnel ve ilk growth deneyi sonuclari izlenmeli."
  ]
};

const workflowLayers = ["Prep", "Marketing", "Growth", "Routine"];

function resolveCountdownTone(countdown: string) {
  if (countdown === "Lansman günü") {
    return "warning" as const;
  }

  if (countdown === "Lansman tarihi geçti") {
    return "danger" as const;
  }

  return "brand" as const;
}

export function AppCard({ app, canCreateApp = true }: AppCardProps) {
  const countdown = getLaunchCountdown(app.launch_date);
  const tone = platformTone[app.platform];
  const missingPlatforms = (["ios", "android", "web"] as const).filter(
    (platform) => platform !== app.platform
  );

  return (
    <LaunchPanel className="overflow-hidden p-0">
      <div className={cn("px-6 py-5 sm:px-7", platformSurface[app.platform])}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <LaunchBadge tone={tone}>{formatPlatformLabel(app.platform)}</LaunchBadge>
              <LaunchBadge tone={resolveCountdownTone(countdown)}>{countdown}</LaunchBadge>
              <LaunchBadge tone="success">Board active</LaunchBadge>
            </div>

            <div className="space-y-2">
              <h3 className="text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                {app.name}
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                Launch plani, pazarlama akisi ve growth tarafindaki siradaki is
                ayni workspace icinde kalir. Bu kart bir liste satiri degil;
                aktif urunun operasyon ozetidir.
              </p>
            </div>
          </div>

          <div className="lg:pt-1">
            <DeleteAppButton appId={app.id} appName={app.name} />
          </div>
        </div>
      </div>

      <div className="grid gap-7 px-6 py-7 sm:px-7 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <LaunchMiniStat
              label="Launch date"
              value={formatLaunchDate(app.launch_date)}
              detail="Geri sayim ve hazirlik ritmi bu tarihe gore calisir."
              tone="warning"
            />
            <LaunchMiniStat
              label="Primary focus"
              value={platformFocus[app.platform]}
              detail="Platform secimi bugunun ana dikkat alanini netlestirir."
              tone={tone}
            />
            <LaunchMiniStat
              label="Board state"
              value="Calisiyor"
              detail="Hazirlik, pazarlama ve growth katmanlari bu yuzeyde birlesir."
              tone="success"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                  Stack
                </p>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  Bu urun icin birlikte takip edilen ana operasyon katmanlari.
                </p>
              </div>
              <LaunchBadge tone={tone}>Urun ozeti</LaunchBadge>
            </div>

            <LaunchPillList items={workflowLayers} />
          </div>
        </div>

        <div className="space-y-4">
          <LaunchPanel tone="inset" className="space-y-5 p-5">
            <div className="space-y-2">
              <LaunchBadge tone={tone}>Next move</LaunchBadge>
              <h4 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                Kontrol masasi
              </h4>
              <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                Bu urun icin siradaki isler; hazirlik, launch iletisimi ve growth
                tarafina gore burada okunur.
              </p>
            </div>

            <div className="space-y-3">
              {nextMoves[app.platform].map((item, index) => (
                <div
                  key={item}
                  data-tone={tone}
                  className="launch-glass-widget flex items-center gap-3 rounded-[1.2rem] border border-[hsl(var(--border))/0.56] bg-[hsl(var(--card))/0.9] px-4 py-3.5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-[0.95rem] border border-[hsl(var(--border))/0.5] bg-[hsl(var(--surface-inset))/0.82] text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </LaunchPanel>
        </div>
      </div>

      <div className="border-t border-[hsl(var(--border))/0.48] px-6 py-5 sm:px-7">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              Checklist, growth ve export yuzeylerine bu kart uzerinden gecis
              yapabilirsin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/app/${app.id}`} className={launchButtonStyles.primary}>
                Checklist
              </Link>
              <Link
                href={`/app/${app.id}/post-launch`}
                className={launchButtonStyles.secondary}
              >
                Growth
              </Link>
              <Link
                href={`/app/${app.id}/export`}
                className={launchButtonStyles.secondary}
              >
                Export
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[hsl(var(--border))/0.52] bg-[hsl(var(--surface-inset))/0.58] px-4 py-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <LaunchBadge tone="clay">Genislet</LaunchBadge>
                <LaunchBadge tone="neutral">Client ve platform varyantlari</LaunchBadge>
              </div>
              <p className="text-sm font-semibold text-foreground">
                Bu projeye sonradan yeni platform veya client ekleyebilirsin.
              </p>
              <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                iOS ile basladiysan sonradan Android ve Web workspace&apos;leri de
                acilabilir. Ayni mantikla farkli client varyantlarini da yeni bir
                workspace olarak ekleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {missingPlatforms.map((platform) => (
                <Link
                  key={platform}
                  href={{
                    pathname: "/app/new",
                    query: {
                      templateName: app.name,
                      platform,
                      mode: "platform",
                      sourceAppId: app.id
                    }
                  }}
                  className={canCreateApp ? launchButtonStyles.secondary : launchButtonStyles.subtle}
                >
                  {`${formatPlatformLabel(platform)} ekle`}
                </Link>
              ))}

              <Link
                href={{
                  pathname: "/app/new",
                  query: {
                    templateName: `${app.name} - Yeni client`,
                    platform: app.platform,
                    mode: "client",
                    sourceAppId: app.id
                  }
                }}
                className={canCreateApp ? launchButtonStyles.secondary : launchButtonStyles.subtle}
              >
                Yeni client ekle
              </Link>
            </div>

            {!canCreateApp ? (
              <p className="text-xs leading-5 text-[hsl(var(--warning-foreground))]">
                Mevcut plan yeni varyant acmaya izin vermiyor. Once paketi
                yukselterek birden fazla workspace kullanman gerekir.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </LaunchPanel>
  );
}
