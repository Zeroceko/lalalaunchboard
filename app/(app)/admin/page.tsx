import Link from "next/link";

import { PortfolioBoardCard } from "@/components/dashboard/PortfolioBoardCard";
import {
  LaunchBadge,
  LaunchHero,
  LaunchMetricCard,
  LaunchNotice,
  LaunchPage,
  LaunchPanel,
  LaunchRailList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import {
  getPortfolioManagementSnapshot,
  resolvePortfolioErrorMessage
} from "@/lib/apps/management";
import { requireSessionContext } from "@/lib/auth/session";

const managementRail = [
  {
    title: "Checklist pulse",
    description:
      "Her board icin prep ilerlemesi ve acik alanlar tek panelde okunur.",
    badge: "Prep",
    tone: "brand" as const
  },
  {
    title: "Deliverable density",
    description:
      "Hangi workspace'in daha cok link, not veya dosya topladigi hemen gorunur.",
    badge: "Assets",
    tone: "clay" as const
  },
  {
    title: "Weekly routine",
    description:
      "Bu haftanin post-launch ritmi board bazinda ayrismis halde izlenir.",
    badge: "Growth",
    tone: "success" as const
  }
];

export default async function AdminPage() {
  const { supabase, user } = await requireSessionContext();

  let snapshot;

  try {
    snapshot = await getPortfolioManagementSnapshot(supabase, user.id);
  } catch (error) {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Panel waiting</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Yonetim paneli su anda board verisini bekliyor.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {resolvePortfolioErrorMessage(error)}
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  if (!snapshot.profile || !snapshot.limit) {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Profile sync</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Panel verisi henuz hazir degil.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Profil ve workspace baglantisi hazir oldugunda bu alan uygulama
            portfoyunu otomatik olarak gosterecek.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* ── Internal Page Header ── */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[hsl(var(--border)/0.55)] bg-[hsl(var(--background)/0.9)] px-6 py-4 backdrop-blur-md">
        <div>
          <h1 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14V8l7-5 7 5v6a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M8 15v-5h4v5"/></svg>
            </span>
            Portföy Yönetimi
          </h1>
          <p className="mt-0.5 text-[11.5px] text-[hsl(var(--muted-foreground))] uppercase tracking-tight font-medium">
             Tüm Uygulama İlerlemeleri · Komuta Merkezi
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/dashboard" className="rounded-[0.55rem] border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.8)] px-3.5 py-1.5 text-[0.8rem] font-medium text-foreground transition hover:bg-[hsl(var(--muted)/0.7)]">
            Dashboard
          </Link>
          <Link href="/app/new" className="flex items-center gap-1.5 rounded-[0.55rem] bg-[hsl(var(--primary))] px-3.5 py-1.5 text-[0.8rem] font-semibold text-white transition hover:bg-[hsl(var(--primary-strong))]">
            + Yeni Board
          </Link>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 max-w-[1600px] mx-auto">
        <section className="rounded-[1.25rem] border border-[hsl(var(--border)/0.5)] bg-primary/[0.02] p-8 mb-8 backdrop-blur-sm">
           <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-widest">
                Portföy Vizyonu
              </span>
              <h2 className="text-2xl font-black tracking-[-0.05em] text-foreground">Kullanıcı ilerlemesini tek komuta ekranından izle.</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Bu yüzey Lalalaunchboard platformundaki tüm ürünlerinizin hazırlık hızını, 
                varlık yoğunluğunu ve büyüme ritmini tek bir ekranda birleştirir.
              </p>
           </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-4">
          {[
            { label: "Active boards", value: snapshot.totals.activeBoards, hint: "Toplam aktif workspace", color: "hsl(var(--primary))" },
            { label: "Avg checklist", value: `%${snapshot.totals.averageChecklistProgress}`, hint: "Ortalama prep ilerlemesi", color: "hsl(152,58%,42%)" },
            { label: "Due soon", value: snapshot.totals.dueSoonCount, hint: "14 gün altı kalan board", color: "hsl(38,92%,52%)" },
            { label: "At risk", value: snapshot.totals.atRiskCount, hint: "Riskli board sayısı", color: "hsl(350,78%,56%)" }
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-2 rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{m.label}</p>
              <p className="text-2xl font-black tracking-[-0.06em] text-foreground" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="flex flex-col justify-between rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Deliverables</p>
              </div>
              <h3 className="text-lg font-bold">Toplanan çıktı yoğunluğu</h3>
              <p className="text-[2.2rem] font-black tracking-[-0.06em]">{snapshot.totals.totalDeliverables}</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Tüm boardlarda biriken link, not ve dosya sayısı.</p>
          </div>

          <div className="flex flex-col justify-between rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-success-soft text-success">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Weekly Rhythm</p>
              </div>
              <h3 className="text-lg font-bold">Routine ortalaması</h3>
              <p className="text-[2.2rem] font-black tracking-[-0.06em]">%{snapshot.totals.averageRoutineProgress}</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Hafta {snapshot.weekNumber} için tüm boardların ortalama tamamlama oranı.</p>
          </div>

          <div className="flex flex-col justify-between rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Data Source</p>
              </div>
              <h3 className="text-lg font-bold">İçerik kaynağı</h3>
              <div className="space-y-1 py-1">
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Checklist</span>
                    <span className="font-bold">{snapshot.checklistSource}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Routine</span>
                    <span className="font-bold">{snapshot.routineSource}</span>
                 </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Fallback içerik aktif olabilir.</p>
          </div>
        </div>

        {!snapshot.limit.canCreateApp && (
          <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-xs text-warning-foreground font-medium flex items-center gap-3">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
             Free plan kapasitesi dolu. Mevcut boardların önceliğini yönetebilirsiniz.
          </div>
        )}

        <section className="space-y-6 pt-4">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Board Queue</p>
               <h3 className="text-xl font-black tracking-[-0.04em]">Öncelik sırasıyla portföy görünümü</h3>
            </div>
            <Link href="/dashboard" className="text-xs font-bold text-muted-foreground hover:text-foreground">
               Ana Dashboard →
            </Link>
          </div>

          {snapshot.boards.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[hsl(var(--border)/0.5)] bg-muted/10 p-20 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-muted/50 text-muted-foreground">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Yönetim paneli ilk board ile anlam kazanır.</h3>
              <p className="max-w-md mt-2 text-sm text-muted-foreground">
                Yeni bir uygulama eklendiğinde burası verileri bazında göstermeye başlar.
              </p>
              <Link href="/app/new" className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:scale-[1.02]">
                İlk board&apos;u oluştur
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {snapshot.boards.map((board) => (
                <PortfolioBoardCard key={board.app.id} board={board} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
