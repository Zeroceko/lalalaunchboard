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
  ios: "Store sayfası ve yayın paketi",
  android: "Play rollout ve duyuru akışı",
  web: "Landing, funnel ve signup akışı"
};

const nextMoves: Record<App["platform"], string[]> = {
  ios: [
    "Store sayfası, görseller ve ASO metinleri son okumaya alınmalı.",
    "Launch günü duyuru akışı ve paylaşım planı tek sıraya bağlanmalı.",
    "İlk hafta yorum, dönüşüm ve retention sinyalleri izlenmeli."
  ],
  android: [
    "Play listing, görseller ve rollout planı aynı yüzeyde netleşmeli.",
    "Topluluk paylaşımı, changelog ve release note akışı hazırlanmalı.",
    "İlk hafta acquisition, rating ve retention verisi takip edilmeli."
  ],
  web: [
    "Landing, pricing ve CTA'lar yayına hazır hale getirilmeli.",
    "E-posta, sosyal duyuru ve changelog paketi aynı ritimde hazırlanmalı.",
    "Signup funnel ve ilk growth deneyi sonuçları izlenmeli."
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
  const expansionPlatforms = (["ios", "android", "web"] as const).filter(
    (platform) => platform !== app.platform
  );

  function buildNewWorkspaceHref(params: {
    templateName?: string;
    platform?: App["platform"];
    mode?: "default" | "platform" | "client";
    sourceAppId?: string;
  }) {
    const searchParams = new URLSearchParams();

    if (params.templateName) {
      searchParams.set("templateName", params.templateName);
    }

    if (params.platform) {
      searchParams.set("platform", params.platform);
    }

    if (params.mode && params.mode !== "default") {
      searchParams.set("mode", params.mode);
    }

    if (params.sourceAppId) {
      searchParams.set("sourceAppId", params.sourceAppId);
    }

    const query = searchParams.toString();
    return query.length > 0 ? `/app/new?${query}` : "/app/new";
  }

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
                Launch planı, pazarlama akışı ve growth tarafındaki sıradaki iş aynı
                workspace içinde kalır. Bu kart bir liste satırı değil; aktif
                ürünün operasyon özetidir.
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
              detail="Geri sayım ve hazırlık ritmi bu tarihe göre çalışır."
              tone="warning"
            />
            <LaunchMiniStat
              label="Primary focus"
              value={platformFocus[app.platform]}
              detail="Platform seçimi bugünün ana dikkat alanını netleştirir."
              tone={tone}
            />
            <LaunchMiniStat
              label="Board state"
              value="Çalışıyor"
              detail="Hazırlık, pazarlama ve growth katmanları bu yüzeyde birleşir."
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
                  Bu ürün için birlikte takip edilen ana operasyon katmanları.
                </p>
              </div>
              <LaunchBadge tone={tone}>Ürün özeti</LaunchBadge>
            </div>

            <LaunchPillList items={workflowLayers} />
          </div>
        </div>

        <div className="space-y-4">
          <LaunchPanel tone="inset" className="space-y-5 p-5">
            <div className="space-y-2">
              <LaunchBadge tone={tone}>Next move</LaunchBadge>
              <h4 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                Kontrol masası
              </h4>
              <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                Bu ürün için sıradaki işler; hazırlık, launch iletişimi ve growth
                tarafına göre burada okunur.
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

          <LaunchPanel tone="inset" className="space-y-5 p-5">
            <div className="space-y-2">
              <LaunchBadge tone={tone}>Genislet</LaunchBadge>
              <h4 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                Platform veya client ekle
              </h4>
              <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                Mevcut board uzerine yeni bir platform workspace&apos;i ya da yeni bir
                client varyanti ac. Isim ve platform bilgisi hazir gelir.
              </p>
            </div>

            {canCreateApp ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Platform ekle
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {expansionPlatforms.map((platform) => (
                      <Link
                        key={platform}
                        href={buildNewWorkspaceHref({
                          templateName: app.name,
                          platform,
                          mode: "platform",
                          sourceAppId: app.id
                        })}
                        className={launchButtonStyles.secondary}
                      >
                        + {formatPlatformLabel(platform)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Client / varyant
                  </p>
                  <Link
                    href={buildNewWorkspaceHref({
                      templateName: `${app.name} - Yeni client`,
                      platform: app.platform,
                      mode: "client",
                      sourceAppId: app.id
                    })}
                    className={launchButtonStyles.secondary}
                  >
                    Client ekle
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.1rem] border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.92] px-4 py-3 text-sm text-[hsl(var(--warning-foreground))]">
                Free plan limiti dolu. Yeni platform veya client varyanti acmak icin
                Pro plana gecmen gerekir.
              </div>
            )}
          </LaunchPanel>
        </div>
      </div>

      <div className="border-t border-[hsl(var(--border))/0.48] px-6 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            Checklist, growth ve export yüzeylerine bu kart üzerinden geçiş
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
      </div>
    </LaunchPanel>
  );
}
