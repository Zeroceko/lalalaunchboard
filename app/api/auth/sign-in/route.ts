import { NextResponse } from "next/server";

import { getAuthMessages } from "@/lib/auth/messages";
import { flattenFieldErrors, getLoginSchema } from "@/lib/auth/validation";
import { readJsonBody } from "@/lib/api/request";
import { hasSupabaseEnv } from "@/lib/env";
import { resolveRequestLocale } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult } from "@/types";

function json(body: AuthActionResult, status: number) {
  return NextResponse.json(body, { status });
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
  const parsed = getLoginSchema(locale).safeParse(payload);

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

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return json(
      {
        ok: false,
        message: authMessages.invalidCredentials
      },
      401
    );
  }

  return json(
    {
      ok: true,
      redirectTo: "/dashboard"
    },
    200
  );
}
