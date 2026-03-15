import { NextResponse } from "next/server";

import { productMessages } from "@/lib/products/messages";
import {
  deleteProductForUser,
  resolveProductErrorMessage,
  updateProductForUser
} from "@/lib/products/service";
import { updateProductSchema } from "@/lib/products/validation";
import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { ProductActionResult } from "@/types";

function json(body: ProductActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json({ ok: false, message: productMessages.genericError }, 400);
  }

  const parsed = updateProductSchema.safeParse(body.data);

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
    const product = await updateProductForUser(supabase, user.id, params.id, parsed.data);

    if (!product) {
      return json({ ok: false, message: productMessages.productNotFound }, 404);
    }

    return json(
      { ok: true, message: productMessages.productUpdated, product },
      200
    );
  } catch (error) {
    return json({ ok: false, message: resolveProductErrorMessage(error) }, 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!hasSupabaseEnv()) {
    return json({ ok: false, message: productMessages.productsUnavailable }, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json({ ok: false, message: productMessages.unauthorized }, 401);
  }

  try {
    const product = await deleteProductForUser(supabase, user.id, params.id);

    if (!product) {
      return json({ ok: false, message: productMessages.productNotFound }, 404);
    }

    return json(
      { ok: true, message: productMessages.productDeleted, product },
      200
    );
  } catch (error) {
    return json({ ok: false, message: resolveProductErrorMessage(error) }, 500);
  }
}
