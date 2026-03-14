"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import {
  LaunchActionBar,
  LaunchBadge,
  LaunchButton,
  LaunchFieldShell,
  LaunchInput,
  LaunchNotice
} from "@/components/ui/LaunchKit";
import { authMessages } from "@/lib/auth/messages";
import { flattenFieldErrors, loginSchema } from "@/lib/auth/validation";
import type { AuthActionResult } from "@/types";

const initialState = {
  email: "",
  password: ""
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const [form, setForm] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    AuthActionResult["fieldErrors"]
  >({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    const parsed = loginSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(flattenFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const result = (await response.json()) as AuthActionResult;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        const message = result.message ?? authMessages.invalidCredentials;
        setStatusMessage(message);
        pushToast({
          title: "Giris basarisiz",
          description: message,
          variant: "destructive"
        });
        return;
      }

      const nextPath = searchParams.get("next");

      router.push(
        nextPath && nextPath.startsWith("/") ? nextPath : "/dashboard"
      );
      router.refresh();
    } catch {
      setStatusMessage(authMessages.genericError);
      pushToast({
        title: "Giris basarisiz",
        description: authMessages.genericError,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <LaunchBadge tone="info">Return to board</LaunchBadge>
          <LaunchBadge tone="neutral">Email sign-in</LaunchBadge>
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">
            Kaldigin yerden devam et
          </h3>
          <p className="max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Giris yaptiktan sonra dashboard ekraninda aktif launch boardlarini,
            tarihlerini ve siradaki hamlelerini ayni yerden gormeye devam edersin.
          </p>
        </div>
      </div>

      <LaunchFieldShell
        label="Email"
        hint="Workspace ve launch boardlarina bagli ana hesap bilgisi."
        error={fieldErrors?.email}
        fieldId="login-email"
      >
        <LaunchInput
          id="login-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="ornek@mail.com"
        />
      </LaunchFieldShell>

      <LaunchFieldShell
        label="Sifre"
        hint="Bu hesapla iliskili boardlara guvenli sekilde erismek icin kullanilir."
        error={fieldErrors?.password}
        fieldId="login-password"
      >
        <LaunchInput
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              password: event.target.value
            }))
          }
          placeholder="En az 8 karakter"
        />
      </LaunchFieldShell>

      {!isConfigured ? (
        <LaunchNotice tone="warning">
          Giris akisini calistirmak icin once <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          ve bir Supabase public key tanimlanmali.
        </LaunchNotice>
      ) : null}

      {statusMessage ? <LaunchNotice tone="danger">{statusMessage}</LaunchNotice> : null}

      <LaunchActionBar
        eyebrow="Resume launch"
        title="Boarduna guvenli sekilde don"
        description="Giris tamamlandiginda urun seni dogrudan dashboard akisina geri tasir."
      >
        <LaunchButton type="submit" disabled={isSubmitting || !isConfigured}>
          {isSubmitting ? "Giris yapiliyor..." : "Giris yap"}
        </LaunchButton>
      </LaunchActionBar>
    </form>
  );
}
