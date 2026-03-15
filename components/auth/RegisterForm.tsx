"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { HCaptchaField } from "@/components/auth/HCaptchaField";
import { useToast } from "@/components/shared/ToastProvider";
import {
  LaunchButton,
  LaunchFieldShell,
  LaunchInput,
  LaunchNotice
} from "@/components/ui/LaunchKit";
import { getAuthMessages } from "@/lib/auth/messages";
import { getRegisterSchema, flattenFieldErrors } from "@/lib/auth/validation";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { AuthActionResult } from "@/types";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  captchaToken: ""
};

interface RegisterFormProps {
  locale: Locale;
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const dictionary = getDictionary(locale);
  const authMessages = getAuthMessages(locale);
  const registerSchema = getRegisterSchema(locale);
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
  const captchaEnabled = Boolean(hcaptchaSiteKey);
  const signupEnabled = authConfigured;

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
          title: dictionary.authForm.registerErrorTitle,
          description: message,
          variant: "destructive"
        });
        return;
      }

      router.push("/app/new");
      router.refresh();
    } catch {
      setStatusMessage(authMessages.genericError);
      pushToast({
        title: dictionary.authForm.registerErrorTitle,
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
        fieldId="register-email"
      >
        <LaunchInput
          id="register-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder={dictionary.authForm.emailPlaceholder}
        />
      </LaunchFieldShell>

      <div className="grid gap-5 sm:grid-cols-2">
        <LaunchFieldShell
          label={dictionary.authForm.passwordLabel}
          hint={dictionary.authForm.registerPasswordHint}
          error={fieldErrors?.password}
          fieldId="register-password"
        >
          <LaunchInput
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder={dictionary.authForm.passwordPlaceholder}
          />
        </LaunchFieldShell>

        <LaunchFieldShell
          label={dictionary.authForm.confirmPasswordLabel}
          hint={dictionary.authForm.confirmPasswordHint}
          error={fieldErrors?.confirmPassword}
          fieldId="register-confirm-password"
        >
          <LaunchInput
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder={dictionary.authForm.confirmPasswordPlaceholder}
          />
        </LaunchFieldShell>
      </div>

      {captchaEnabled && (
        <LaunchFieldShell
          label={dictionary.authForm.captchaLabel}
          hint={dictionary.authForm.captchaHint}
          error={fieldErrors?.captchaToken}
        >
          <HCaptchaField
            disabled={isSubmitting}
            siteKey={hcaptchaSiteKey}
            value={form.captchaToken}
            onChange={(token) => updateField("captchaToken", token)}
          />
        </LaunchFieldShell>
      )}

      {!authConfigured ? (
        <LaunchNotice tone="warning">
          {dictionary.authForm.registerConfigNotice}
        </LaunchNotice>
      ) : null}

      {statusMessage ? <LaunchNotice tone="danger">{statusMessage}</LaunchNotice> : null}

      <LaunchButton
        type="submit"
        disabled={isSubmitting || !signupEnabled}
        className="w-full"
      >
        {isSubmitting
          ? dictionary.authForm.registerSubmitting
          : dictionary.authForm.registerSubmit}
      </LaunchButton>
    </form>
  );
}
