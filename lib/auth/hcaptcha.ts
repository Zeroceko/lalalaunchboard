import { authMessages } from "@/lib/auth/messages";
import { getHcaptchaSecretKey } from "@/lib/env";

export async function verifyCaptchaToken(token: string) {
  const secret = getHcaptchaSecretKey();

  if (!token) {
    return {
      ok: false,
      message: authMessages.captchaRequired
    };
  }

  if (!secret) {
    return {
      ok: false,
      message: authMessages.captchaUnavailable
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
