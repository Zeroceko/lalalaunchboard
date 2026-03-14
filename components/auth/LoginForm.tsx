"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Hos geldin</h2>
        <p className="text-sm text-muted-foreground">
          Gecmis workspace&apos;lerine geri donmek icin giris yap.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="ornek@mail.com"
        />
        {fieldErrors?.email ? (
          <p className="text-sm text-destructive">{fieldErrors.email}</p>
        ) : null}
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Sifre</span>
        <input
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              password: event.target.value
            }))
          }
          className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="En az 8 karakter"
        />
        {fieldErrors?.password ? (
          <p className="text-sm text-destructive">{fieldErrors.password}</p>
        ) : null}
      </label>

      {!isConfigured ? (
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-secondary/40 px-4 py-4 text-sm text-muted-foreground">
          Giris akisini calistirmak icin once <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          ve bir Supabase public key tanimlamamiz gerekiyor.
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {statusMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !isConfigured}
        className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
      </button>
    </form>
  );
}
