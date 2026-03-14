import Link from "next/link";

import type { App } from "@/types";

import { AppCard } from "@/components/dashboard/AppCard";

interface AppListProps {
  apps: App[];
}

export function AppList({ apps }: AppListProps) {
  if (apps.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-foreground/15 bg-white/75 p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
          First board
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Dashboard su an bos ama sistem hazir.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Ilk workspace&apos;i actiginda lansman tarihi, countdown, checklist, routine
          ve export akislarinin merkezi burada belirecek.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] bg-secondary/60 p-4 text-sm text-foreground/80">
            1. App adini ve platformunu sec
          </div>
          <div className="rounded-[1.25rem] bg-secondary/60 p-4 text-sm text-foreground/80">
            2. Launch tarihini sabitle
          </div>
          <div className="rounded-[1.25rem] bg-secondary/60 p-4 text-sm text-foreground/80">
            3. Checklist akisina gec
          </div>
        </div>
        <Link
          href="/app/new"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
        >
          Ilk workspace&apos;i olustur
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
