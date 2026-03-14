import Link from "next/link";

import type { RoutineTaskWithLog } from "@/types";

import { RoutineTaskItem } from "@/components/post-launch/RoutineTaskItem";

interface RoutineWeekViewProps {
  appId: string;
  weekNumber: number;
  currentWeek: number;
  tasks: RoutineTaskWithLog[];
  completedCount: number;
  totalCount: number;
}

export function RoutineWeekView({
  appId,
  weekNumber,
  currentWeek,
  tasks,
  completedCount,
  totalCount
}: RoutineWeekViewProps) {
  const previousWeek = Math.max(1, weekNumber - 1);
  const nextWeek = Math.min(53, weekNumber + 1);
  const isCurrentWeek = weekNumber === currentWeek;
  const openCount = Math.max(totalCount - completedCount, 0);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-white/88 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
      <div className="border-b border-foreground/8 bg-secondary/26 px-6 py-6 lg:px-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Week {weekNumber}
              </span>
              {isCurrentWeek ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                  Current cycle
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground/70">
                  Review mode
                </span>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Haftalik growth ritmini koru
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Launch sonrasi analytics, user feedback ve growth deneylerini
                duzenli kapatmak icin tekrar eden gorev setini burada takip et.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <div className="rounded-[1.35rem] border border-foreground/10 bg-white/80 p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                Completed
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {completedCount}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-foreground/10 bg-white/80 p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                Open
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {openCount}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-foreground/10 bg-white/80 p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                Total
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {totalCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/app/${appId}/post-launch?week=${previousWeek}`}
            className="rounded-full border border-foreground/10 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary/45"
          >
            Onceki hafta
          </Link>
          <Link
            href={`/app/${appId}/post-launch?week=${currentWeek}`}
            className="rounded-full border border-foreground/10 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary/45"
          >
            Bu hafta
          </Link>
          <Link
            href={`/app/${appId}/post-launch?week=${nextWeek}`}
            className="rounded-full border border-foreground/10 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary/45"
          >
            Sonraki hafta
          </Link>
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:p-7">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <RoutineTaskItem
              key={task.id}
              appId={appId}
              task={task}
              weekNumber={weekNumber}
            />
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-foreground/15 bg-background px-5 py-6 text-sm leading-7 text-muted-foreground">
            Bu hafta icin goruntulenecek routine task bulunamadi.
          </div>
        )}
      </div>
    </section>
  );
}
