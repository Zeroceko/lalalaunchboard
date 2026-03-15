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
        <section className="relative overflow-hidden rounded-[2rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-10 backdrop-blur-sm">
          {/* Subtle background glow */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-warning/10 blur-[100px]" />

          <div className="relative grid gap-12 xl:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary uppercase tracking-widest">
                  İlk Workspace
                </span>
                <h1 className="text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl">
                   Lalalaunchboard&apos;a <br />
                   Hoş Geldin.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                  Burası senin ürün hazırlık üssün. İlk ürününü eklediğinde; 
                  checklist hızını, varlık yoğunluğunu ve büyüme ritmini buradan 
                  izlemeye başlayacaksın.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products/new"
                  className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-[0.98]"
                >
                  İlk Board&apos;u Oluştur →
                </Link>
                <Link
                  href="/docs"
                  className="rounded-xl border border-[hsl(var(--border)/0.8)] bg-[hsl(var(--card)/0.5)] px-8 py-3.5 text-sm font-bold text-foreground transition hover:bg-muted/50"
                >
                  Nasıl Çalışır?
                </Link>
              </div>
            </div>

            <div className="hidden space-y-6 xl:block">
              <div className="rounded-2xl border border-[hsl(var(--border)/0.4)] bg-muted/20 p-6 backdrop-blur-sm">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Hazırlık Kiti</p>
                 <div className="space-y-4">
                    {[
                      { icon: "📦", title: "Product Hub", desc: "Tüm varlıkların merkezi" },
                      { icon: "📈", title: "Growth OS", desc: "Büyüme metrikleri takibi" },
                      { icon: "🎯", title: "Launch Check", desc: "Hazırlık hızı analizi" }
                    ].map(i => (
                      <div key={i.title} className="flex gap-3">
                         <span className="text-xl">{i.icon}</span>
                         <div>
                            <p className="text-xs font-bold">{i.title}</p>
                            <p className="text-[10px] text-muted-foreground">{i.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-warning/10 bg-warning/5 p-6 flex items-center justify-between gap-6">
           <div className="space-y-1">
              <h3 className="text-sm font-bold text-warning-foreground">Start Clean</h3>
              <p className="text-xs text-muted-foreground">Lalalaunchboard&apos;un değeri yeni bir kayıt oluşturmak değil; launch sürecini tek bir komuta alanına çevirmek.</p>
           </div>
           {canCreateApp ? (
              <Link href="/app/new" className="rounded-lg bg-warning/10 px-4 py-2 text-xs font-bold text-warning transition hover:bg-warning/20 shrink-0">
                Hızlı Başlat
              </Link>
           ) : (
             <Link href="/pricing" className="text-xs font-bold text-warning underline">Yükselt</Link>
           )}
        </div>
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
