import Link from "next/link";

import {
  LaunchBadge,
  LaunchMetricCard,
  LaunchMiniStat,
  LaunchNotice,
  LaunchPage,
  LaunchPanel,
  LaunchPillList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getTaskOverview } from "@/lib/admin/tasks-overview";

function getToneForLevel(level: string) {
  switch (level) {
    case "Tamamlandi":
      return "success" as const;
    case "Ileri seviye":
      return "brand" as const;
    case "Orta seviye":
      return "warning" as const;
    case "Basladi":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function getBarTone(rate: number) {
  if (rate >= 100) {
    return "bg-[hsl(var(--success))]";
  }

  if (rate >= 67) {
    return "bg-[hsl(var(--primary))]";
  }

  if (rate >= 34) {
    return "bg-[hsl(var(--warning))]";
  }

  return "bg-[hsl(var(--muted-foreground))/0.35]";
}

function getReleaseLabel(rate: number, laggingCount: number) {
  if (rate >= 85 && laggingCount === 0) {
    return "Release'e yakin";
  }

  if (rate >= 60) {
    return "Kontrollu ilerliyor";
  }

  return "Yogun koordinasyon istiyor";
}

export default async function OpsPage() {
  const overview = await getTaskOverview();
  const completedSections = overview.sections.filter(
    (section) => section.completionRate === 100
  ).length;
  const topSection = [...overview.sections].sort(
    (left, right) => right.completionRate - left.completionRate
  )[0];
  const laggingSections = [...overview.sections]
    .filter((section) => section.completionRate < 67)
    .sort((left, right) => left.completionRate - right.completionRate);
  const activeSections = [...overview.sections]
    .filter(
      (section) =>
        section.completionRate > 0 && section.completionRate < 100
    )
    .sort((left, right) => right.openTasks.length - left.openTasks.length);
  const executionQueue = overview.openTasks.slice(0, 7);
  const releaseLabel = getReleaseLabel(
    overview.completionRate,
    laggingSections.length
  );

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* ── Internal Page Header ── */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[hsl(var(--border)/0.55)] bg-[hsl(var(--background)/0.9)] px-6 py-4 backdrop-blur-md">
        <div>
          <h1 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-warning/10 text-warning">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2"/></svg>
            </span>
            Control Tower
          </h1>
          <p className="mt-0.5 text-[11.5px] text-[hsl(var(--muted-foreground))] uppercase tracking-tight font-medium">
             Execution Truth · {releaseLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/dashboard" className="rounded-[0.55rem] border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.8)] px-3.5 py-1.5 text-[0.8rem] font-medium text-foreground transition hover:bg-[hsl(var(--muted)/0.7)]">
            Dashboard
          </Link>
          <Link href="/admin" className="rounded-[0.55rem] border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.8)] px-3.5 py-1.5 text-[0.8rem] font-medium text-foreground transition hover:bg-[hsl(var(--muted)/0.7)]">
            Portföy
          </Link>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 max-w-[1600px] mx-auto">
        <section className="rounded-[1.25rem] border border-[hsl(var(--border)/0.5)] bg-warning/[0.02] p-8 mb-8 backdrop-blur-sm">
           <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold text-warning uppercase tracking-widest">
                Lalalaunchboard Roadmap
              </span>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-foreground">Gidişatı tek komuta ekranından oku.</h1>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Bu panel dogrudan tracker dosyalarini okuyup hangi sprint alaninin kapandigini, 
                neyin takildigini ve hangi taskın masaya gelmesi gerektigini gösterir.
              </p>
           </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { label: "Genel Tamamlama", value: `%${overview.completionRate}`, hint: "Toplam ilerleme seviyesi", color: "hsl(var(--primary))" },
            { label: "Delivery Load", value: `${overview.openTasks.length} Açık`, hint: "Bekleyen iş maddesi", color: "hsl(38,92%,52%)" },
            { label: "Release Posture", value: releaseLabel, hint: "Durum özeti", color: "hsl(152,58%,42%)" }
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-2 rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{m.label}</p>
              <p className="text-2xl font-black tracking-[-0.06em] text-foreground" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.hint}</p>
            </div>
          ))}
        </div>

        <section className="space-y-6 pt-4">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-warning">Section Matrix</p>
               <h3 className="text-xl font-black tracking-[-0.04em]">Epic lane&apos;leri oran ve risk analizi</h3>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid gap-4 md:grid-cols-2">
              {overview.sections.map((section) => {
                const isComplete = section.completionRate === 100;
                return (
                  <div key={section.id} className="group rounded-[1.25rem] border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm transition hover:border-[hsl(var(--border)/0.8)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                          isComplete ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}>
                          {section.level}
                        </span>
                        <h3 className="text-base font-bold text-foreground">
                          {section.id}. {section.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black tracking-tight text-foreground">%{section.completionRate}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{section.completed}/{section.total}</p>
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className={`h-full rounded-full ${getBarTone(section.completionRate)}`}
                        style={{ width: `${section.completionRate}%` }}
                      />
                    </div>

                    {!isComplete && section.openTasks.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {section.openTasks.slice(0, 2).map((task) => (
                          <div key={task.id} className="rounded-lg bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground border border-border/30">
                            <span className="font-bold text-foreground mr-1">#{task.id}</span> {task.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.25rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm">
                 <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-warning">Tıkanan Alanlar</p>
                 <div className="space-y-3">
                    {laggingSections.length > 0 ? laggingSections.slice(0, 3).map(s => (
                      <div key={s.id} className="rounded-xl border border-border/50 bg-muted/10 p-4">
                         <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold">{s.title}</p>
                            <span className="text-[10px] font-bold text-warning">%{s.completionRate}</span>
                         </div>
                         <p className="text-[10px] text-muted-foreground">Kritik gecikme sinyali veriyor.</p>
                      </div>
                    )) : <p className="text-xs text-muted-foreground italic">Riskli alan bulunmuyor.</p>}
                 </div>
              </div>

              <div className="rounded-[1.25rem] border border-primary/20 bg-primary/5 p-6 backdrop-blur-sm">
                 <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary">Momentum</p>
                 <div className="space-y-4">
                    {activeSections.length > 0 ? activeSections.slice(0, 2).map(s => (
                      <div key={s.id} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold">
                            <span>{s.title}</span>
                            <span>%{s.completionRate}</span>
                         </div>
                         <div className="h-1 rounded-full bg-primary/10 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${s.completionRate}%` }} />
                         </div>
                      </div>
                    )) : <p className="text-xs text-white/50 italic">Aktif lane bulunmuyor.</p>}
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-8 pb-12">
          <div className="space-y-1 px-2">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Execution Queue</p>
             <h3 className="text-xl font-black tracking-[-0.04em]">Sıradaki kritik maddeler</h3>
          </div>

          <div className="grid gap-3">
            {executionQueue.map((task, i) => (
              <div key={task.id} className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition hover:bg-muted/20">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] font-black text-muted-foreground">
                   {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase opacity-40">Open Task</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
