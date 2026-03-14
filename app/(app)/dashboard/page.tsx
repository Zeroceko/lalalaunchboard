import Link from "next/link";

import { AppList } from "@/components/dashboard/AppList";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { getWorkspaceSnapshot } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";

const workflowSteps = [
  {
    title: "Prep the release",
    detail: "Create one workspace per app and shape the checklist around a real launch date."
  },
  {
    title: "Capture outputs",
    detail: "Keep links, notes, files and guide text attached to the exact item they support."
  },
  {
    title: "Keep momentum",
    detail: "Move into routine tracking and export a clean progress snapshot when you need it."
  }
];

export default async function DashboardPage() {
  const { supabase, user } = await requireSessionContext();
  let snapshot;

  try {
    snapshot = await getWorkspaceSnapshot(supabase, user.id);
  } catch {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Schema bekleniyor"
          title="Dashboard veritabanina henuz baglanamiyor."
          description="Remote Supabase projesine migration push tamamlandiginda app workspace'leri bu ekranda listelenecek."
        />
      </main>
    );
  }

  if (!snapshot.profile || !snapshot.limit) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Profil hazirlaniyor"
          title="Workspace verisine henuz erisemiyoruz."
          description="Supabase Auth ile `public.users` profil kaydi arasinda kisa bir gecikme varsa bu ekrani yenilemen yeterli olur."
        />
      </main>
    );
  }

  const hasApps = snapshot.apps.length > 0;
  const nextMove = hasApps
    ? "Open a workspace and push the next launch-critical item forward."
    : "Create your first workspace to start the launch operating rhythm.";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-foreground/10 bg-white/85 p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
              Dashboard
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Launch workspace&apos;lerini bir operasyon paneli gibi yonet.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Her app kendi checklist, deliverable, post-launch routine ve export
              akisini tasir. Burasi o islerin dagilmadan kaldigi merkez.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/app/new"
                className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
              >
                Yeni workspace ac
              </Link>
              <span className="inline-flex rounded-full border border-foreground/10 bg-white px-4 py-3 text-sm text-muted-foreground">
                {nextMove}
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] p-8 text-slate-50 shadow-[0_28px_70px_rgba(15,23,42,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Operating mode
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  {snapshot.limit.plan === "pro" ? "Scale mode" : "Focused mode"}
                </h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                {snapshot.limit.plan}
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-base font-semibold">{step.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.6rem] border border-foreground/10 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Plan
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {snapshot.limit.plan === "pro" ? "Pro" : "Free"}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-foreground/10 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Toplam workspace
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {snapshot.limit.appCount}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-foreground/10 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Kalan slot
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {snapshot.limit.remainingSlots === null
                ? "Sinirsiz"
                : snapshot.limit.remainingSlots}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-foreground/10 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Durum
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {hasApps ? "Active" : "Setup"}
            </p>
          </div>
        </div>

        {!snapshot.limit.canCreateApp ? (
          <div className="rounded-[1.5rem] border border-amber-300/60 bg-amber-50 px-5 py-4 text-sm text-amber-950">
            Free plan limitine ulastin. Istersen mevcut workspace&apos;lerinden birini
            silerek devam edebilir, ileride Pro Plan ile sinirsiz app acabiliriz.
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Workspaces
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Her app icin ayri bir launch board
              </h2>
            </div>
            <AppList apps={snapshot.apps} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-foreground/10 bg-white/80 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Next move
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {hasApps ? "Drive the next release forward." : "Open your first board."}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {hasApps
                  ? "Bir workspace sec, eksik deliverable&apos;lari tamamla ve launch oncesi akisi gorunur halde tut."
                  : "Yeni bir workspace acarak launch tarihi, platform ve checklist akisini tek yerde toplamaya basla."}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-foreground/10 bg-white/80 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Board shape
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[1.25rem] bg-secondary/60 p-4 text-sm text-foreground/80">
                  Checklist keeps launch prep concrete.
                </div>
                <div className="rounded-[1.25rem] bg-secondary/60 p-4 text-sm text-foreground/80">
                  Routine keeps post-launch momentum alive.
                </div>
                <div className="rounded-[1.25rem] bg-secondary/60 p-4 text-sm text-foreground/80">
                  Export turns progress into a shareable artifact.
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
