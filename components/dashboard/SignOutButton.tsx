"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import { authMessages } from "@/lib/auth/messages";
import type { AuthActionResult } from "@/types";

export function SignOutButton() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleSignOut() {
    setStatusMessage(null);
    setIsSubmitting(true);

    void (async () => {
      try {
        const response = await fetch("/api/auth/sign-out", {
          method: "POST"
        });
        const result = (await response.json()) as AuthActionResult;

        if (!response.ok || !result.ok) {
          const message = result.message ?? authMessages.genericError;
          setStatusMessage(message);
          pushToast({
            title: "Cikis yapilamadi",
            description: message,
            variant: "destructive"
          });
          return;
        }

        startTransition(() => {
          router.push(result.redirectTo ?? "/auth");
          router.refresh();
        });
      } catch {
        setStatusMessage(authMessages.genericError);
        pushToast({
          title: "Cikis yapilamadi",
          description: authMessages.genericError,
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
        onClick={handleSignOut}
        disabled={isSubmitting || isPending}
        className="rounded-full border border-foreground/10 bg-white/70 px-4 py-2 text-sm font-medium transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
      </button>
      {statusMessage ? (
        <p className="max-w-48 text-right text-xs text-destructive">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
