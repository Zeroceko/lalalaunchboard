import { NextResponse } from "next/server";

import { productMessages } from "@/lib/products/messages";
import {
  createProductForUser,
  getProductSnapshot,
  resolveProductErrorMessage
} from "@/lib/products/service";
import { createProductSchema } from "@/lib/products/validation";
import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { ProductActionResult } from "@/types";

function json(body: ProductActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  if (!hasSupabaseEnv()) {
    return json({ ok: false, message: productMessages.productsUnavailable }, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json({ ok: false, message: productMessages.unauthorized }, 401);
  }

  try {
    const snapshot = await getProductSnapshot(supabase, user.id);

    if (!snapshot.profile || !snapshot.limit) {
      return json({ ok: false, message: productMessages.profileUnavailable }, 409);
    }

    return json(
      {
        ok: true,
        products: snapshot.products,
        limit: snapshot.limit
      },
      200
    );
  } catch (error) {
    return json({ ok: false, message: resolveProductErrorMessage(error) }, 500);
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json({ ok: false, message: productMessages.genericError }, 400);
  }

  const parsed = createProductSchema.safeParse(body.data);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: productMessages.genericError,
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json({ ok: false, message: productMessages.productsUnavailable }, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json({ ok: false, message: productMessages.unauthorized }, 401);
  }

  try {
    const result = await createProductForUser(supabase, user.id, parsed.data);

    if (!result.ok) {
      return json(
        {
          ok: false,
          message: result.message,
          limit: result.limit
        },
        result.limit ? 403 : 409
      );
    }

    return json(
      {
        ok: true,
        message: productMessages.productCreated,
        product: result.product,
        limit: result.limit,
        redirectTo: `/app/${result.product.id}`
      },
      201
    );
  } catch (error) {
    return json({ ok: false, message: resolveProductErrorMessage(error) }, 500);
  }
}
