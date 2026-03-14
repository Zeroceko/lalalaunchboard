"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import { appMessages } from "@/lib/apps/messages";
import type { AppActionResult } from "@/types";

interface DeleteAppButtonProps {
  appId: string;
  appName: string;
}

export function DeleteAppButton({
  appId,
  appName
}: DeleteAppButtonProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `${appName} workspace'ini silmek istediğine emin misin? Bu işlem geri alınamaz.`
    );

    if (!confirmed) {
      return;
    }

    setStatusMessage(null);
    setIsSubmitting(true);

    void (async () => {
      try {
        const response = await fetch(`/api/apps/${appId}`, {
          method: "DELETE"
        });
        const result = (await response.json()) as AppActionResult;

        if (!response.ok || !result.ok) {
          const message = result.message ?? appMessages.genericError;
          setStatusMessage(message);
          pushToast({
            title: "Silme basarisiz",
            description: message,
            variant: "destructive"
          });
          return;
        }

        pushToast({
          title: "Workspace silindi",
          description: `${appName} artik dashboard'da listelenmeyecek.`,
          variant: "success"
        });
        startTransition(() => {
          router.refresh();
        });
      } catch {
        setStatusMessage(appMessages.genericError);
        pushToast({
          title: "Silme basarisiz",
          description: appMessages.genericError,
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    })();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isSubmitting || isPending}
        className="rounded-full border border-destructive/20 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || isPending ? "Siliniyor..." : "Sil"}
      </button>
      {statusMessage ? (
        <p className="max-w-48 text-right text-xs text-destructive">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
