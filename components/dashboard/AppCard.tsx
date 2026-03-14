import Link from "next/link";

import {
  formatLaunchDate,
  formatPlatformLabel,
  getLaunchCountdown
} from "@/lib/apps/service";
import type { App } from "@/types";

import { DeleteAppButton } from "@/components/dashboard/DeleteAppButton";

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <article className="rounded-[1.9rem] border border-foreground/10 bg-white/88 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] bg-primary text-lg font-semibold text-primary-foreground">
              {app.name.slice(0, 1).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {getLaunchCountdown(app.launch_date)}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
                  {formatPlatformLabel(app.platform)}
                </span>
              </div>

              <div>
                <h2 className="truncate text-2xl font-semibold tracking-tight">
                  {app.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Hedef lansman tarihi {formatLaunchDate(app.launch_date)}. Bu board
                  checklist, deliverable, routine ve export akislarini tek yerde tutar.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
                Prep
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Checklist ve deliverable akisi
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
                Launch
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Countdown ve release odagi
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
                Grow
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Routine ve export ciktilari
              </p>
            </div>
          </div>
        </div>

        <DeleteAppButton appId={app.id} appName={app.name} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/8 pt-4">
        <p className="text-sm text-muted-foreground">
          Bu workspace uzerinden launch&apos;in tum ritmini yonetebilirsin.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/app/${app.id}`}
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          >
            Checklist
          </Link>
          <Link
            href={`/app/${app.id}/post-launch`}
            className="inline-flex rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium transition hover:bg-secondary/40"
          >
            Post-Launch
          </Link>
          <Link
            href={`/app/${app.id}/export`}
            className="inline-flex rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium transition hover:bg-secondary/40"
          >
            Export
          </Link>
        </div>
      </div>
    </article>
  );
}
