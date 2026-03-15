"use client";

import { useState } from "react";
import Link from "next/link";

export interface SetupStep {
  key: string;
  label: string;
  description: string;
  done: boolean;
  href: string;
}

function CheckCircle({ done }: { done: boolean }) {
  if (done) {
    return (
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" className="h-3 w-3">
          <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-border bg-background" />
  );
}

export function SetupProgress({ steps }: { steps: SetupStep[] }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const doneCount = steps.filter((s) => s.done).length;
  const total = steps.length;
  const pct = Math.round((doneCount / total) * 100);
  const allDone = doneCount === total;

  if (allDone || dismissed) return null;

  const remaining = total - doneCount;

  return (
    <div className="mx-2 mb-2">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="group w-full rounded-[0.65rem] px-2.5 py-2 transition-colors hover:bg-[hsl(var(--sidebar-item-hover))] text-left"
      >
        <div className="flex items-center gap-2">
          {/* Sprout icon */}
          <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center opacity-70 group-hover:opacity-100">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4 text-muted-foreground">
              <path d="M8 14V8" strokeLinecap="round" />
              <path d="M8 8C8 5 10 3 13 3s0 5-5 5z" strokeLinejoin="round" />
              <path d="M8 10C8 7 6 5 3 5s0 5 5 5z" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex-1 text-[0.8125rem] font-medium text-muted-foreground group-hover:text-foreground">
            {remaining} görev kaldı
          </span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border px-4 py-3.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {/* Progress bar */}
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {doneCount}/{total}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">Profili tamamla</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI önerilerini kişiselleştirmek için bilgilerini ekle
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3 w-3">
                <path d="M1 1l10 10M11 1L1 11" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Steps */}
          <div className="py-1">
            {steps.map((step) => (
              <Link
                key={step.key}
                href={step.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/60 group"
              >
                <div className="mt-0.5">
                  <CheckCircle done={step.done} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-none ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {step.label}
                  </p>
                  {!step.done && (
                    <p className="mt-1 text-xs text-muted-foreground leading-snug">{step.description}</p>
                  )}
                </div>
                {!step.done && (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                    <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Şimdilik gizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
