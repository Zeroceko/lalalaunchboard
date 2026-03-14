"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import {
  LaunchButton,
  LaunchFieldShell,
  LaunchInput,
  LaunchNotice
} from "@/components/ui/LaunchKit";
import { getAuthMessages } from "@/lib/auth/messages";
import { getLoginSchema, flattenFieldErrors } from "@/lib/auth/validation";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { AuthActionResult } from "@/types";

const initialState = {
  email: "",
  password: ""
};

interface LoginFormProps {
  locale: Locale;
}

export function LoginForm({ locale }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const dictionary = getDictionary(locale);
  const authMessages = getAuthMessages(locale);
  const loginSchema = getLoginSchema(locale);
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
          title: dictionary.authForm.loginErrorTitle,
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
        title: dictionary.authForm.loginErrorTitle,
        description: authMessages.genericError,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <LaunchFieldShell
        label={dictionary.authForm.emailLabel}
        hint={dictionary.authForm.emailHint}
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
          placeholder={dictionary.authForm.emailPlaceholder}
        />
      </LaunchFieldShell>

      <LaunchFieldShell
        label={dictionary.authForm.passwordLabel}
        hint={dictionary.authForm.loginPasswordHint}
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
          placeholder={dictionary.authForm.passwordPlaceholder}
        />
      </LaunchFieldShell>

      {!isConfigured ? (
        <LaunchNotice tone="warning">
          {dictionary.authForm.loginConfigNotice}
        </LaunchNotice>
      ) : null}

      {statusMessage ? <LaunchNotice tone="danger">{statusMessage}</LaunchNotice> : null}

      <LaunchButton
        type="submit"
        disabled={isSubmitting || !isConfigured}
        className="w-full"
      >
        {isSubmitting
          ? dictionary.authForm.loginSubmitting
          : dictionary.authForm.loginSubmit}
      </LaunchButton>
    </form>
  );
}
