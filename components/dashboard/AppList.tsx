import Link from "next/link";

import type { App } from "@/types";

import { AppCard } from "@/components/dashboard/AppCard";
import {
  LaunchActionBar,
  LaunchBadge,
  LaunchPanel,
  LaunchRailList,
  launchButtonStyles
} from "@/components/ui/LaunchKit";

interface AppListProps {
  apps: App[];
  canCreateApp?: boolean;
}

export function AppList({ apps, canCreateApp = true }: AppListProps) {
  if (apps.length === 0) {
    return (
      <div className="space-y-6">
        <LaunchPanel className="overflow-hidden p-0">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6 bg-[linear-gradient(180deg,hsl(var(--card))/0.98,hsl(var(--surface-default-end))/0.94)] p-8 sm:p-10">
              <LaunchBadge tone="clay">First workspace</LaunchBadge>
              <div className="space-y-3">
                <h3 className="max-w-2xl text-[2.6rem] font-semibold tracking-[-0.06em] text-foreground">
                  Ilk launch board&apos;unu burada ac.
                </h3>
                <p className="max-w-2xl text-base leading-8 text-[hsl(var(--muted-foreground))]">
                  Ilk app eklendiginde bu alan sadece listeye donusmez. Launch date,
                  prep ritmi, next move ve board stack&apos;i ayni yuzeyde okunur hale
                  gelir.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Prep", "Countdown", "Progress", "Routine"].map((item) => (
                  <LaunchBadge
                    key={item}
                    tone="neutral"
                    className="bg-[hsl(var(--card))/0.96]"
                  >
                    {item}
                  </LaunchBadge>
                ))}
              </div>

              {canCreateApp ? (
                <Link href="/app/new" className={launchButtonStyles.primary}>
                  Ilk workspace&apos;i olustur
                </Link>
              ) : (
                <div className="inline-flex rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.95] px-5 py-3 text-sm font-semibold text-[hsl(var(--warning-foreground))]">
                  Free plan limiti dolu
                </div>
              )}
            </div>

            <div className="border-t border-[hsl(var(--border))/0.68] bg-[linear-gradient(180deg,hsl(var(--surface-brand-start))/0.96,hsl(var(--surface-clay-start))/0.92)] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <LaunchRailList
                eyebrow="What comes with it"
                title="Bos degil, hazir bir sistem"
                description="Ilk board acildigi anda checklist, progress ve post-launch tarafina tasinacak ortak urun yapisi da netlesir."
                items={[
                  {
                    title: "Prep layer",
                    description:
                      "Store prep, aciklamalar, gorseller ve son teslimler tek workflow akisinda toplanir.",
                    badge: "Core",
                    tone: "brand"
                  },
                  {
                    title: "Timing layer",
                    description:
                      "Launch date etrafinda countdown ve oncelik duzeni dogrudan gorunur olur.",
                    badge: "Momentum",
                    tone: "warning"
                  },
                  {
                    title: "Growth layer",
                    description:
                      "Routine ve export sonradan eklenmis eklenti gibi degil, boardun dogal devami gibi davranir.",
                    badge: "Next",
                    tone: "success"
                  }
                ]}
                className="h-full border-none bg-transparent p-0 shadow-none"
              />
            </div>
          </div>
        </LaunchPanel>

        <LaunchActionBar
          eyebrow="Start clean"
          title="Ilk board ile urunun asil hissini ac"
          description="Lalalaunchboard'un degeri yeni bir kayit olusturmak degil; launch surecini tek bir komuta alanina cevirmek."
        >
          {canCreateApp ? (
            <Link href="/app/new" className={launchButtonStyles.primary}>
              Yeni board baslat
            </Link>
          ) : (
            <div className="inline-flex rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.95] px-5 py-3 text-sm font-semibold text-[hsl(var(--warning-foreground))]">
              Yeni board icin Pro plan gerekecek
            </div>
          )}
        </LaunchActionBar>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} canCreateApp={canCreateApp} />
      ))}
    </div>
  );
}
