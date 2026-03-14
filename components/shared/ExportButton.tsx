"use client";

import { useState } from "react";

import { useToast } from "@/components/shared/ToastProvider";
import type { ExportFormat } from "@/types";

interface ExportButtonProps {
  appId: string;
  format: ExportFormat;
  label: string;
  description: string;
}

function parseFileName(contentDisposition: string | null) {
  const match = contentDisposition?.match(/filename="([^"]+)"/);
  return match?.[1] ?? null;
}

export function ExportButton({
  appId,
  format,
  label,
  description
}: ExportButtonProps) {
  const { pushToast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleDownload() {
    setIsPending(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/apps/${appId}/export?format=${format}`);

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const result = (await response.json()) as { message?: string };
          const message =
            result.message ?? "Export islemi basarisiz oldu, lutfen tekrar dene";
          setStatusMessage(message);
          pushToast({
            title: "Export basarisiz",
            description: message,
            variant: "destructive"
          });
        } else {
          setStatusMessage("Export islemi basarisiz oldu, lutfen tekrar dene");
          pushToast({
            title: "Export basarisiz",
            description: "Export islemi basarisiz oldu, lutfen tekrar dene",
            variant: "destructive"
          });
        }
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename =
        parseFileName(response.headers.get("content-disposition")) ??
        `lalalaunchboard-export.${format === "markdown" ? "md" : "pdf"}`;

      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      pushToast({
        title: `${label} hazir`,
        description: "Dosya indiriliyor.",
        variant: "success"
      });
    } catch {
      setStatusMessage("Export islemi basarisiz oldu, lutfen tekrar dene");
      pushToast({
        title: "Export basarisiz",
        description: "Export islemi basarisiz oldu, lutfen tekrar dene",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  }

  const formatTone =
    format === "pdf"
      ? "bg-primary/10 text-primary"
      : "bg-accent/12 text-accent";

  return (
    <div className="flex h-full flex-col rounded-[1.85rem] border border-foreground/10 bg-white/90 p-6 shadow-[0_22px_48px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            {label}
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${formatTone}`}
        >
          {format}
        </span>
      </div>

      <div className="mt-6 grid gap-3 text-sm">
        <div className="rounded-[1.2rem] border border-foreground/10 bg-secondary/35 px-4 py-3 text-muted-foreground">
          Shareable outside the product
        </div>
        <div className="rounded-[1.2rem] border border-foreground/10 bg-secondary/35 px-4 py-3 text-muted-foreground">
          Includes checklist progress and deliverables
        </div>
        <div className="rounded-[1.2rem] border border-foreground/10 bg-secondary/35 px-4 py-3 text-muted-foreground">
          Ready for archive, review or investor updates
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isPending}
        className="mt-6 inline-flex w-fit rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Hazirlaniyor..." : `${label} indir`}
      </button>

      {statusMessage ? (
        <p className="mt-3 text-sm text-destructive">{statusMessage}</p>
      ) : null}
    </div>
  );
}
