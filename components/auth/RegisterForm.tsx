"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HCaptchaField } from "@/components/auth/HCaptchaField";
import { useToast } from "@/components/shared/ToastProvider";
import {
  LaunchActionBar,
  LaunchBadge,
  LaunchButton,
  LaunchFieldShell,
  LaunchInput,
  LaunchMiniStat,
  LaunchNotice
} from "@/components/ui/LaunchKit";
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <LaunchBadge tone="brand">Create account</LaunchBadge>
          <LaunchBadge tone="success">Start your first board</LaunchBadge>
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">
            Ilk launch boardunu ac
          </h3>
          <p className="max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Kayit tamamlandiginda yeni app setup ekrani, dashboard kartlari ve
            gelecekteki checklist akisi ayni sistem icinde calismaya baslar.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <LaunchMiniStat
          label="Baslangic"
          value="Free"
          detail="Ilk board ile sisteme gir."
          tone="brand"
        />
        <LaunchMiniStat
          label="Yapi"
          value="Guided"
          detail="Kurulum ekrani seni yonlendirir."
          tone="warning"
        />
        <LaunchMiniStat
          label="Guvenlik"
          value="Protected"
          detail="CAPTCHA ile korunur."
          tone="success"
        />
      </div>

      <LaunchFieldShell
        label="Email"
        hint="Tum launch boardlarin bu hesabin altinda toplanir."
        error={fieldErrors?.email}
        fieldId="register-email"
      >
        <LaunchInput
          id="register-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="ornek@mail.com"
        />
      </LaunchFieldShell>

      <div className="grid gap-5 sm:grid-cols-2">
        <LaunchFieldShell
          label="Sifre"
          hint="Hesabina guvenli sekilde geri donmek icin kullanilir."
          error={fieldErrors?.password}
          fieldId="register-password"
        >
          <LaunchInput
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="En az 8 karakter"
          />
        </LaunchFieldShell>

        <LaunchFieldShell
          label="Sifre tekrari"
          hint="Hesap kurulmadan once sifrenin dogrulugunu netlestir."
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
            placeholder="Sifreyi tekrar yaz"
          />
        </LaunchFieldShell>
      </div>

      <LaunchFieldShell
        label="CAPTCHA"
        hint="Kayit akisini korumak icin dogrulama gerekir."
        error={fieldErrors?.captchaToken}
      >
        <HCaptchaField
          disabled={isSubmitting}
          siteKey={hcaptchaSiteKey}
          value={form.captchaToken}
          onChange={(token) => updateField("captchaToken", token)}
        />
      </LaunchFieldShell>

      {!authConfigured ? (
        <LaunchNotice tone="warning">
          Kayit akisini acmak icin once <code>NEXT_PUBLIC_SUPABASE_URL</code> ve
          bir Supabase public key tanimlanmali.
        </LaunchNotice>
      ) : null}

      {statusMessage ? <LaunchNotice tone="danger">{statusMessage}</LaunchNotice> : null}

      <LaunchActionBar
        eyebrow="Start launch OS"
        title="Hesabini olustur ve boardunu baslat"
        description="Kaydi tamamladiginda urun seni dogrudan dashboard ve kurulum akisina tasiyacak."
      >
        <LaunchButton type="submit" disabled={isSubmitting || !signupEnabled}>
          {isSubmitting ? "Hesap olusturuluyor..." : "Kayit ol"}
        </LaunchButton>
      </LaunchActionBar>
    </form>
  );
}
