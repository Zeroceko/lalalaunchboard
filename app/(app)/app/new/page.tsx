import Link from "next/link";

import { NewAppForm } from "@/components/dashboard/NewAppForm";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { getAppCreationState } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";

const setupSteps = [
  "Name the app and lock the platform context",
  "Set a target launch date to anchor the countdown",
  "Move straight into checklist, routine, and export flows"
];

export default async function NewAppPage() {
  const { supabase, user } = await requireSessionContext();
  let state;

  try {
    state = await getAppCreationState(supabase, user.id);
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Schema bekleniyor"
          title="Yeni workspace akisi remote veritabanini bekliyor."
          description="Migration'lar hosted Supabase projesine uygulandiginda bu form gercek app olusturma akisini baslatacak."
        />
      </main>
    );
  }

  if (!state.profile || !state.limit) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Profil hazirlaniyor"
          title="Yeni workspace ekrani henuz hazir degil."
          description="Kullanici profil satiri hazir oldugunda bu ekran otomatik olarak calisacaktir. Birkac saniye sonra tekrar deneyebilirsin."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex rounded-full border border-foreground/10 bg-white/70 px-4 py-2 text-sm font-medium transition hover:bg-white"
        >
          Dashboard&apos;a don
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-foreground/10 bg-white/85 p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                New Workspace
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Yeni bir launch board kur.
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                App adi, platform ve launch tarihi secildigi anda checklist,
                deliverable, routine ve export akislari ayni workspace altinda toplanacak.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] p-8 text-slate-50 shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Setup flow
              </p>
              <div className="mt-5 grid gap-3">
                {setupSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-slate-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-foreground/10 bg-white/88 p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <NewAppForm limit={state.limit} />
          </section>
        </div>
      </div>
    </main>
  );
}
