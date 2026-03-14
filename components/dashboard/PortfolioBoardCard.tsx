import Link from "next/link";

import {
  formatLaunchDate,
  formatPlatformLabel
} from "@/lib/apps/service";
import type { PortfolioBoardSummary } from "@/lib/apps/management";

import { DeleteAppButton } from "@/components/dashboard/DeleteAppButton";
import {
  LaunchBadge,
  LaunchMiniStat,
  LaunchPanel,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";

interface PortfolioBoardCardProps {
  board: PortfolioBoardSummary;
}

const platformTone: Record<
  PortfolioBoardSummary["app"]["platform"],
  "brand" | "success" | "clay"
> = {
  ios: "clay",
  android: "success",
  web: "brand"
};

function getCountdownTone(
  countdown: PortfolioBoardSummary["countdown"]
): "brand" | "warning" | "danger" {
  if (countdown.daysRemaining < 0) {
    return "danger";
  }

  if (countdown.daysRemaining <= 7) {
    return "warning";
  }

  return "brand";
}

export function PortfolioBoardCard({ board }: PortfolioBoardCardProps) {
  const tone = platformTone[board.app.platform];

  return (
    <LaunchPanel className="space-y-6 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <LaunchBadge tone={tone}>
              {formatPlatformLabel(board.app.platform)}
            </LaunchBadge>
            <LaunchBadge tone={getCountdownTone(board.countdown)}>
              {board.countdown.label}
            </LaunchBadge>
            <LaunchBadge tone={board.healthTone}>{board.healthLabel}</LaunchBadge>
          </div>

          <div className="space-y-2">
            <h3 className="text-[1.9rem] font-semibold tracking-[-0.05em] text-foreground">
              {board.app.name}
            </h3>
            <p className="max-w-3xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              Bu panel board&apos;un checklist hizini, deliverable yogunlugunu ve
              haftalik routine ritmini tek bakista okutmak icin tasarlandi.
            </p>
          </div>
        </div>

        <DeleteAppButton appId={board.app.id} appName={board.app.name} />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <LaunchMiniStat
          label="Launch date"
          value={formatLaunchDate(board.app.launch_date)}
          detail="Bu boardun takvim referansi."
          tone="warning"
        />
        <LaunchMiniStat
          label="Checklist"
          value={`%${board.checklistProgress}`}
          detail={`${board.checklistCompletedCount}/${board.checklistTotalCount} madde tamamlandi.`}
          tone={board.checklistProgress >= 75 ? "success" : tone}
        />
        <LaunchMiniStat
          label="Deliverables"
          value={board.deliverableCount}
          detail="Link, not ve dosya yogunlugu."
          tone={board.deliverableCount >= 3 ? "brand" : "clay"}
        />
        <LaunchMiniStat
          label="Routine"
          value={`%${board.routineProgress}`}
          detail={`${board.routineCompletedCount}/${board.routineTotalCount} haftalik gorev tamamlandi.`}
          tone={board.routineProgress >= 50 ? "success" : "neutral"}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                Board health
              </p>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Priority score {board.priorityScore}
              </p>
            </div>
            <div className="overflow-hidden rounded-full border border-[hsl(var(--border))/0.5] bg-[hsl(var(--surface-inset))/0.88]">
              <div
                className={cn(
                  "h-3 rounded-full transition-all",
                  board.checklistProgress >= 75
                    ? "bg-[hsl(var(--success))]"
                    : board.checklistProgress >= 45
                      ? "bg-[hsl(var(--primary))]"
                      : "bg-[hsl(var(--warning))]"
                )}
                style={{ width: `${Math.max(board.checklistProgress, 6)}%` }}
              />
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-[hsl(var(--border))/0.5] bg-[hsl(var(--surface-inset))/0.76] p-4">
            <div className="space-y-2">
              <LaunchBadge tone={board.healthTone}>Next move</LaunchBadge>
              <p className="text-base font-semibold text-foreground">
                {board.nextMove}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.4rem] border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.92] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              Hemen ac
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/app/${board.app.id}`}
                className={launchButtonStyles.primary}
              >
                Checklist
              </Link>
              <Link
                href={`/app/${board.app.id}/post-launch`}
                className={launchButtonStyles.secondary}
              >
                Post-launch
              </Link>
              <Link
                href={`/app/${board.app.id}/export`}
                className={launchButtonStyles.secondary}
              >
                Export
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LaunchPanel>
  );
}
