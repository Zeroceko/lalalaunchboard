"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import { cn } from "@/lib/utils";
import type { RoutineActionResult, RoutineTaskWithLog } from "@/types";

interface RoutineTaskItemProps {
  appId: string;
  task: RoutineTaskWithLog;
  weekNumber: number;
}

export function RoutineTaskItem({
  appId,
  task,
  weekNumber
}: RoutineTaskItemProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const isCompleted = task.log?.completed ?? false;

  function handleToggle() {
    setStatusMessage(null);

    void (async () => {
      try {
        const response = await fetch(`/api/apps/${appId}/routine/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            taskId: task.id,
            weekNumber,
            completed: !isCompleted
          })
        });

        const result = (await response.json()) as RoutineActionResult;

        if (!response.ok || !result.ok) {
          const message = result.message ?? "Routine guncellenemedi";
          setStatusMessage(message);
          pushToast({
            title: "Routine guncellenemedi",
            description: message,
            variant: "destructive"
          });
          return;
        }

        startTransition(() => {
          router.refresh();
        });
      } catch {
        setStatusMessage("Routine guncellenemedi");
        pushToast({
          title: "Routine guncellenemedi",
          description: "Lutfen tekrar dene.",
          variant: "destructive"
        });
      }
    })();
  }

  return (
    <div className="rounded-[1.6rem] border border-foreground/10 bg-white/92 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-4">
        <button
          type="button"
          aria-pressed={isCompleted}
          onClick={handleToggle}
          disabled={isPending}
          className={cn(
            "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/20 bg-background text-transparent",
            isPending && "cursor-not-allowed opacity-60"
          )}
        >
          ✓
        </button>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={cn(
                "text-base font-semibold tracking-tight",
                isCompleted && "text-muted-foreground line-through"
              )}
            >
              {task.title}
            </h4>
            <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Week {weekNumber}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em]",
                isCompleted
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-secondary text-foreground/70"
              )}
            >
              {isCompleted ? "Done" : "Open"}
            </span>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-muted-foreground">
              Growth loop
            </span>
            <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-muted-foreground">
              Repeating weekly
            </span>
          </div>

          {statusMessage ? (
            <p className="text-sm text-destructive">{statusMessage}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
