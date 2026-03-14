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
      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
        Kayıt akışını çalıştırmak için <code>NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code>{" "}
        ve <code>HCAPTCHA_SECRET_KEY</code> eklemen gerekecek.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-secondary/30 p-3">
      <HCaptcha
        sitekey={siteKey}
        reCaptchaCompat={false}
        onVerify={(token) => onChange(token)}
        onExpire={() => onChange("")}
      />
      {!value ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Devam etmeden once CAPTCHA dogrulamasini tamamla.
        </p>
      ) : null}
      {disabled ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Form gonderilirken CAPTCHA alani kilitlenir.
        </p>
      ) : null}
    </div>
  );
}
