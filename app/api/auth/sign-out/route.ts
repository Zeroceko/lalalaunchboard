import { NextResponse } from "next/server";

import { getAuthMessages } from "@/lib/auth/messages";
import { hasSupabaseEnv } from "@/lib/env";
import { resolveRequestLocale } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult } from "@/types";

function json(body: AuthActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST() {
  const locale = resolveRequestLocale();
  const authMessages = getAuthMessages(locale);

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
  const { error } = await supabase.auth.signOut();

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
      redirectTo: "/auth"
    },
    200
  );
}
