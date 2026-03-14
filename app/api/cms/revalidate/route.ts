import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import {
  CMS_CHECKLIST_TAG,
  CMS_ROUTINE_TAG
} from "@/lib/contentful/client";
import { getContentfulRevalidateSecret } from "@/lib/env";

export async function POST(request: Request) {
  const expectedSecret = getContentfulRevalidateSecret();
  const body = (await request.json().catch(() => ({}))) as {
    secret?: string;
  };
  const providedSecret =
    request.headers.get("x-revalidate-secret") ?? body.secret ?? null;

  if (expectedSecret && providedSecret !== expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        message: "Geçersiz revalidate isteği"
      },
      { status: 401 }
    );
  }

  revalidateTag(CMS_CHECKLIST_TAG);
  revalidateTag(CMS_ROUTINE_TAG);
  revalidatePath("/");
  revalidatePath("/dashboard");

  return NextResponse.json(
    {
      ok: true,
      revalidated: true,
      now: Date.now()
    },
    { status: 200 }
  );
}
