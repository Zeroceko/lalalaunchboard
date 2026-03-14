import { NextResponse } from "next/server";

import { getAuthMessages } from "@/lib/auth/messages";
import { flattenFieldErrors, getRegisterSchema } from "@/lib/auth/validation";
import { readJsonBody } from "@/lib/api/request";
import { verifyCaptchaToken } from "@/lib/auth/hcaptcha";
import { getAppUrl, hasSignupCaptchaEnv, hasSupabaseEnv } from "@/lib/env";
import { resolveRequestLocale } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult } from "@/types";

function json(body: AuthActionResult, status: number) {
  return NextResponse.json(body, { status });
}

function isDuplicateUserResponse(identityCount: number | undefined) {
  return identityCount === 0;
}

export async function POST(request: Request) {
  const locale = resolveRequestLocale();
  const authMessages = getAuthMessages(locale);
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json(
      {
        ok: false,
        message: authMessages.genericError
      },
      400
    );
  }

  const payload = body.data;
  const parsed = getRegisterSchema(locale).safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: authMessages.genericError,
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json(
      {
        ok: false,
        message: authMessages.authUnavailable
      },
      503
    );
  }

  if (!hasSignupCaptchaEnv()) {
    return json(
      {
        ok: false,
        message: authMessages.captchaUnavailable
      },
      503
    );
  }

  const captchaResult = await verifyCaptchaToken(parsed.data.captchaToken, locale);

  if (!captchaResult.ok) {
    return json(
      {
        ok: false,
        message: captchaResult.message ?? authMessages.captchaRequired
      },
      400
    );
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getAppUrl()}/app/new`,
      captchaToken: parsed.data.captchaToken
    }
  });

  if (
    error?.message?.includes("User already registered") ||
    isDuplicateUserResponse(data.user?.identities?.length)
  ) {
    return json(
      {
        ok: false,
        message: authMessages.duplicateEmail
      },
      409
    );
  }

  if (error) {
    return json(
      {
        ok: false,
        message: authMessages.genericError
      },
      500
    );
  }

  return json(
    {
      ok: true,
      redirectTo: "/app/new"
    },
    200
  );
}
