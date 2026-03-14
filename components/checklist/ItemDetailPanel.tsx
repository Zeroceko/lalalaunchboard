"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { DeliverableForm } from "@/components/checklist/DeliverableForm";
import { useToast } from "@/components/shared/ToastProvider";
import { deliverableMessages } from "@/lib/deliverables/messages";
import { cn } from "@/lib/utils";
import type {
  ChecklistItemWithStatus,
  Deliverable,
  DeliverableActionResult
} from "@/types";

interface ItemDetailPanelProps {
  appId: string;
  item: ChecklistItemWithStatus;
  open: boolean;
  onClose: () => void;
}

function formatFileSize(size?: number) {
  if (!size) {
    return null;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDeliverableType(type: Deliverable["type"]) {
  if (type === "link") {
    return "Link";
  }

  if (type === "note") {
    return "Note";
  }

  return "File";
}

function DeliverableRow({
  appId,
  deliverable
}: {
  appId: string;
  deliverable: Deliverable;
}) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      "Bu deliverable kalici olarak silinecek. Devam etmek istiyor musun?"
    );

    if (!confirmed) {
      return;
    }

    setStatusMessage(null);

    void (async () => {
      try {
        const response = await fetch(
          `/api/apps/${appId}/deliverables/${deliverable.id}`,
          {
            method: "DELETE"
          }
        );
        const result = (await response.json()) as DeliverableActionResult;

        if (!response.ok || !result.ok) {
          const message = result.message ?? deliverableMessages.genericError;
          setStatusMessage(message);
          pushToast({
            title: "Deliverable silinemedi",
            description: message,
            variant: "destructive"
          });
          return;
        }

        pushToast({
          title: "Deliverable silindi",
          description: "Bu kayit item detay panelinden kaldirildi.",
          variant: "success"
        });
        startTransition(() => {
          router.refresh();
        });
      } catch {
        setStatusMessage(deliverableMessages.genericError);
        pushToast({
          title: "Deliverable silinemedi",
          description: deliverableMessages.genericError,
          variant: "destructive"
        });
      }
    })();
  }

  const toneClass =
    deliverable.type === "link"
      ? "bg-primary/10 text-primary"
      : deliverable.type === "note"
        ? "bg-secondary text-foreground/75"
        : "bg-accent/12 text-accent";

  const hasExternalTarget =
    deliverable.type === "link" || deliverable.type === "file";

  return (
    <div className="rounded-[1.35rem] border border-foreground/10 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em]",
                toneClass
              )}
            >
              {formatDeliverableType(deliverable.type)}
            </span>
            {deliverable.type === "file" && deliverable.file_name ? (
              <span className="text-xs text-muted-foreground">
                {deliverable.file_name}
                {deliverable.file_size
                  ? ` · ${formatFileSize(deliverable.file_size)}`
                  : ""}
              </span>
            ) : null}
          </div>

          {deliverable.type === "note" ? (
            <p className="text-sm leading-7 text-foreground/85">
              {deliverable.content}
            </p>
          ) : (
            <a
              href={deliverable.content}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm leading-7 text-primary underline-offset-4 hover:underline"
            >
              {deliverable.content}
            </a>
          )}

          <div className="flex flex-wrap gap-2">
            {hasExternalTarget ? (
              <a
                href={deliverable.content}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-secondary/45"
              >
                Ac
              </a>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-full border border-destructive/20 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Siliniyor..." : "Sil"}
        </button>
      </div>

      {statusMessage ? (
        <p className="mt-3 text-sm text-destructive">{statusMessage}</p>
      ) : null}
    </div>
  );
}

export function ItemDetailPanel({
  appId,
  item,
  open,
  onClose
}: ItemDetailPanelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const isCompleted = item.status?.completed ?? false;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 transition",
        open && "pointer-events-auto"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} detay paneli`}
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-[860px] overflow-y-auto border-l border-foreground/10 bg-[hsl(var(--background))] shadow-[0_20px_80px_rgba(15,23,42,0.2)] transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                Item detay paneli
              </p>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-balance">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-secondary/35"
            >
              Kapat
            </button>
          </div>

          <section className="grid gap-5 rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] lg:grid-cols-[minmax(0,1.3fr)_minmax(240px,0.8fr)]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em]",
                    isCompleted
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-white/10 text-white/72"
                  )}
                >
                  {isCompleted ? "Done" : "Open"}
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/62">
                  Prep lane item
                </span>
              </div>

              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Execution summary
                </p>
                <p className="mt-3 text-sm leading-7 text-white/74">
                  Rehber metni, kaynak linkleri ve deliverable kayitlari bu item&apos;in
                  tamamlama kaniti gibi calisir. Paneli mini bir operating card
                  olarak kullanabilirsin.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Guide
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {item.guideText ? "Ready" : "Missing"}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Links
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {item.toolLinks.length}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Deliverables
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {item.deliverables.length}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="space-y-6">
              <section className="rounded-[1.85rem] border border-foreground/10 bg-white/88 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Guide
                </p>
                <p className="mt-4 text-sm leading-7 text-foreground/85">
                  {item.guideText || "Bu item icin rehber metni henuz eklenmemis."}
                </p>
              </section>

              <section className="rounded-[1.85rem] border border-foreground/10 bg-white/88 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Tool links
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Bu item icin faydali kaynaklar
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground/70">
                    {item.toolLinks.length} link
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {item.toolLinks.length > 0 ? (
                    item.toolLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[1.25rem] border border-foreground/10 bg-background px-4 py-4 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-white"
                      >
                        <p>{link.label}</p>
                        <p className="mt-1 break-all text-xs font-normal text-muted-foreground">
                          {link.url}
                        </p>
                      </a>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-foreground/15 bg-background px-4 py-4 text-sm text-muted-foreground">
                      Bu item icin eklenmis arac linki yok.
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[1.85rem] border border-foreground/10 bg-white/88 p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                    Deliverable ekle
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Link, not veya dosya ekleyerek bu checklist item&apos;ini
                    belgeleyebilir ve teslim akisini kayit altina alabilirsin.
                  </p>
                </div>

                <div className="mt-5">
                  <DeliverableForm appId={appId} itemId={item.id} />
                </div>
              </section>

              <section className="rounded-[1.85rem] border border-foreground/10 bg-white/88 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Deliverable listesi
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Bu item altinda biriken tum ciktilar burada listelenir.
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground/70">
                    {item.deliverables.length} kayit
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {item.deliverables.length > 0 ? (
                    item.deliverables.map((deliverable) => (
                      <DeliverableRow
                        key={deliverable.id}
                        appId={appId}
                        deliverable={deliverable}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-foreground/15 bg-background px-4 py-4 text-sm leading-7 text-muted-foreground">
                      Henuz deliverable eklenmemis. Bu item icin cikti veya kanit
                      topladikca burada listelenecek.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
