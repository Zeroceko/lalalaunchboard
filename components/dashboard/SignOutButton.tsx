"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import { LaunchButton } from "@/components/ui/LaunchKit";
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
    <>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSubmitting || isPending}
        className="rounded-[0.5rem] px-2 py-1 text-[11px] font-medium text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors shrink-0"
      >
        {isSubmitting || isPending ? "..." : "Çıkış"}
      </button>
      {statusMessage ? (
        <p className="text-xs text-destructive">{statusMessage}</p>
      ) : null}
    </>
  );
}
