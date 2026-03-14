"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HCaptchaField } from "@/components/auth/HCaptchaField";
import { useToast } from "@/components/shared/ToastProvider";
import { authMessages } from "@/lib/auth/messages";
import { flattenFieldErrors, registerSchema } from "@/lib/auth/validation";
import type { AuthActionResult } from "@/types";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  captchaToken: ""
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const [form, setForm] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    AuthActionResult["fieldErrors"]
  >({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? null;
  const signupEnabled = authConfigured && Boolean(hcaptchaSiteKey);

  function updateField<K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    const parsed = registerSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(flattenFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const result = (await response.json()) as AuthActionResult;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        const message = result.message ?? authMessages.genericError;
        setStatusMessage(message);
        pushToast({
          title: "Kayit tamamlanamadi",
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
        title: "Kayit tamamlanamadi",
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
        <h2 className="text-2xl font-semibold tracking-tight">Yeni hesap olustur</h2>
        <p className="text-sm text-muted-foreground">
          Checklist workspace&apos;lerini saklamak icin email ve sifreni kullan.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="ornek@mail.com"
        />
        {fieldErrors?.email ? (
          <p className="text-sm text-destructive">{fieldErrors.email}</p>
        ) : null}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Sifre</span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="En az 8 karakter"
          />
          {fieldErrors?.password ? (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Sifre Tekrari</span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Sifreyi tekrar yaz"
          />
          {fieldErrors?.confirmPassword ? (
            <p className="text-sm text-destructive">
              {fieldErrors.confirmPassword}
            </p>
          ) : null}
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">CAPTCHA</span>
        <HCaptchaField
          disabled={isSubmitting}
          siteKey={hcaptchaSiteKey}
          value={form.captchaToken}
          onChange={(token) => updateField("captchaToken", token)}
        />
        {fieldErrors?.captchaToken ? (
          <p className="text-sm text-destructive">{fieldErrors.captchaToken}</p>
        ) : null}
      </div>

      {!authConfigured ? (
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-secondary/40 px-4 py-4 text-sm text-muted-foreground">
          Kayıt akisini acmak icin once <code>NEXT_PUBLIC_SUPABASE_URL</code> ve
          bir Supabase public key tanimlamamiz gerekiyor.
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {statusMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !signupEnabled}
        className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Hesap olusturuluyor..." : "Kayit Ol"}
      </button>
    </form>
  );
}
