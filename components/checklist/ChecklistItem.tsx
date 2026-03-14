"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ItemDetailPanel } from "@/components/checklist/ItemDetailPanel";
import { useToast } from "@/components/shared/ToastProvider";
import { LaunchBadge, launchButtonStyles } from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";
import type { ChecklistActionResult, ChecklistItemWithStatus } from "@/types";

interface ChecklistItemProps {
  appId: string;
  item: ChecklistItemWithStatus;
}

export function ChecklistItem({ appId, item }: ChecklistItemProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isCompleted = item.status?.completed ?? false;

  function handleToggle() {
    setStatusMessage(null);

    void (async () => {
      try {
        const response = await fetch(`/api/apps/${appId}/checklist/${item.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            completed: !isCompleted
          })
        });
        const result = (await response.json()) as ChecklistActionResult;

        if (!response.ok || !result.ok) {
          const message = result.message ?? "Checklist guncellenemedi";
          setStatusMessage(message);
          pushToast({
            title: "Checklist guncellenemedi",
            description: message,
            variant: "destructive"
          });
          return;
        }

        startTransition(() => {
          router.refresh();
        });
      } catch {
        setStatusMessage("Checklist guncellenemedi");
        pushToast({
          title: "Checklist guncellenemedi",
          description: "Lutfen tekrar dene.",
          variant: "destructive"
        });
      }
    })();
  }

  return (
    <>
      <div className="launch-glass-widget rounded-[1.65rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.95] p-5 shadow-[0_16px_36px_hsl(var(--shadow-color)/0.06)]">
        <div className="flex items-start gap-4">
          <button
            type="button"
            aria-pressed={isCompleted}
            onClick={handleToggle}
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
            </div>

            {statusMessage ? (
              <p className="text-sm text-destructive">{statusMessage}</p>
            ) : null}
          </div>
        </div>
      </div>
      <ItemDetailPanel
        appId={appId}
        item={item}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
