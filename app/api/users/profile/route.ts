import { NextResponse } from "next/server";
import { z } from "zod";

import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { UserProfileActionResult } from "@/types";

function json(body: UserProfileActionResult, status: number) {
  return NextResponse.json(body, { status });
}

const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Ad Soyad zorunludur").max(100).optional(),
  role_in_company: z
    .enum(["Founder", "Growth", "Product", "Marketing"], {
      message: "Geçerli bir rol seçiniz"
    })
    .optional()
});

export async function PATCH(request: Request) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json({ ok: false, message: "Geçersiz istek" }, 400);
  }

  const parsed = updateProfileSchema.safeParse(body.data);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: "Geçersiz profil bilgisi",
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json({ ok: false, message: "Supabase yapılandırması gerekiyor" }, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json({ ok: false, message: "Giriş yapman gerekiyor" }, 401);
  }

  const updatePayload: Record<string, unknown> = {};
  if (parsed.data.full_name !== undefined) updatePayload.full_name = parsed.data.full_name;
  if (parsed.data.role_in_company !== undefined) updatePayload.role_in_company = parsed.data.role_in_company;

  const { error } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("id", user.id);

  if (error) {
    return json({ ok: false, message: error.message }, 500);
  }

  return json({ ok: true, message: "Profil güncellendi" }, 200);
}
