import { getAuthMessages } from "@/lib/auth/messages";
import { getHcaptchaSecretKey } from "@/lib/env";
import {
  DEFAULT_LOCALE,
  type Locale
} from "@/lib/i18n/config";

export async function verifyCaptchaToken(
  token: string,
  locale: Locale = DEFAULT_LOCALE
) {
  const authMessages = getAuthMessages(locale);
  const secret = getHcaptchaSecretKey();

  if (!secret) {
    // Local development: captcha env yok, bypass et
    return { ok: true };
  }

  if (!token) {
    return {
      ok: false,
      message: authMessages.captchaRequired
    };
  }

  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      secret,
      response: token
    })
  });

  const result = (await response.json()) as {
    success?: boolean;
  };

  return {
    ok: Boolean(result.success),
    message: result.success ? undefined : authMessages.captchaRequired
  };
}
