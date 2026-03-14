"use client";

import { useState } from "react";

import { ItemDetailPanel } from "@/components/checklist/ItemDetailPanel";
import { LaunchBadge, launchButtonStyles } from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";
import type { ChecklistItemWithStatus, Deliverable } from "@/types";

interface ChecklistItemProps {
  appId: string;
  item: ChecklistItemWithStatus;
  isPending: boolean;
  onToggle: () => void;
  onDeliverablesChange: (deliverables: Deliverable[]) => void;
}

export function ChecklistItem({
  appId,
  item,
  isPending,
  onToggle,
  onDeliverablesChange
}: ChecklistItemProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isCompleted = item.status?.completed ?? false;

  return (
    <>
      <div className="launch-glass-widget rounded-[1.65rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.95] p-5 shadow-[0_16px_36px_hsl(var(--shadow-color)/0.06)]">
        <div className="flex items-start gap-4">
          <button
            type="button"
            aria-pressed={isCompleted}
            onClick={onToggle}
            disabled={isPending}
            className={cn(
              "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition duration-200",
              isCompleted
                ? "border-[hsl(var(--success))/0.28] bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
                : "border-[hsl(var(--border))/0.75] bg-[hsl(var(--surface-inset))/0.85] text-transparent",
              isPending && "cursor-not-allowed opacity-60"
            )}
          >
            ✓
          </button>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <button
                type="button"
                onClick={() => setIsDetailOpen(true)}
                className="min-w-0 flex-1 rounded-[1.1rem] text-left transition duration-200 hover:bg-[hsl(var(--surface-inset))/0.7]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    className={cn(
                      "text-base font-semibold tracking-[-0.02em] text-foreground",
                      isCompleted && "text-muted-foreground line-through"
                    )}
                  >
                    {item.title}
                  </h4>
                  <LaunchBadge tone={isCompleted ? "success" : "neutral"}>
                    {isCompleted ? "Done" : "Open"}
                  </LaunchBadge>
                  {item.deliverables.length > 0 ? (
                    <span className="rounded-full border border-[hsl(var(--primary))/0.18] bg-[hsl(var(--brand-soft))/0.96] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--primary))]">
                      {item.deliverables.length} deliverable
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                  {item.description}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailOpen(true)}
                className={cn(launchButtonStyles.secondary, "px-4 py-2.5 text-sm")}
              >
                Detail paneli ac
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-[hsl(var(--border))/0.58] bg-[hsl(var(--surface-inset))/0.7] px-2.5 py-1 text-[hsl(var(--muted-foreground))]">
                {item.toolLinks.length} kaynak link
              </span>
              <span className="rounded-full border border-[hsl(var(--border))/0.58] bg-[hsl(var(--surface-inset))/0.7] px-2.5 py-1 text-[hsl(var(--muted-foreground))]">
                {item.guideText ? "Guide hazir" : "Guide bekleniyor"}
              </span>
              <span className="rounded-full border border-[hsl(var(--border))/0.58] bg-[hsl(var(--surface-inset))/0.7] px-2.5 py-1 text-[hsl(var(--muted-foreground))]">
                {item.deliverables.length > 0
                  ? "Evidence attached"
                  : "No deliverable yet"}
              </span>
              {isPending ? (
                <span className="rounded-full border border-[hsl(var(--info))/0.22] bg-[hsl(var(--info-soft))/0.96] px-2.5 py-1 text-[hsl(var(--info))]">
                  Kaydediliyor
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ItemDetailPanel
        appId={appId}
        item={item}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onDeliverablesChange={onDeliverablesChange}
      />
    </>
  );
}
