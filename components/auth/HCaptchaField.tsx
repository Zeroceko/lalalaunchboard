"use client";

import dynamic from "next/dynamic";

const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"), {
  ssr: false
});

interface HCaptchaFieldProps {
  disabled?: boolean;
  siteKey: string | null;
  value: string;
  onChange: (token: string) => void;
}

export function HCaptchaField({
  disabled,
  siteKey,
  value,
  onChange
}: HCaptchaFieldProps) {
  if (!siteKey) {
    return (
      <div className="rounded-[1.35rem] border border-[hsl(var(--warning))/0.18] bg-[hsl(var(--amber-soft))/0.94] px-4 py-4 text-sm leading-6 text-foreground shadow-[0_10px_28px_hsl(var(--shadow-color)/0.05)]">
        Kayit akisini calistirmak icin <code>NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code> ve{" "}
        <code>HCAPTCHA_SECRET_KEY</code> eklemen gerekecek.
      </div>
    );
  }

  return (
    <div className="rounded-[1.35rem] border border-[hsl(var(--border))/0.72] bg-[hsl(var(--surface-inset))/0.82] p-3 shadow-[inset_0_1px_0_hsl(var(--panel-highlight)/0.9),0_10px_28px_hsl(var(--shadow-color)/0.06)]">
      <HCaptcha
        sitekey={siteKey}
        reCaptchaCompat={false}
        onVerify={(token) => onChange(token)}
        onExpire={() => onChange("")}
      />
      {!value ? (
        <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
          Devam etmeden once CAPTCHA dogrulamasini tamamla.
        </p>
      ) : null}
      {disabled ? (
        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
          Form gonderilirken CAPTCHA alani kilitlenir.
        </p>
      ) : null}
    </div>
  );
}
