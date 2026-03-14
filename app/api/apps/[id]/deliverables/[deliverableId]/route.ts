import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/auth/session";
import { deliverableMessages } from "@/lib/deliverables/messages";
import {
  deleteDeliverableForUser,
  resolveDeliverableErrorMessage
} from "@/lib/deliverables/service";
import { hasSupabaseEnv } from "@/lib/env";
import type { DeliverableActionResult } from "@/types";

function json(body: DeliverableActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function DELETE(
  _request: Request,
  {
    params
  }: {
    params: { id: string; deliverableId: string };
  }
) {
  if (!hasSupabaseEnv()) {
    return json(
      {
        ok: false,
        message: deliverableMessages.unavailable
      },
      503
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json(
      {
        ok: false,
        message: deliverableMessages.unauthorized
      },
      401
    );
  }

  try {
    const deliverable = await deleteDeliverableForUser(
      supabase,
      user.id,
      params.id,
      params.deliverableId
    );

    if (!deliverable) {
      return json(
        {
          ok: false,
          message: deliverableMessages.deliverableNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        deliverable
      },
      200
    );
  } catch (error) {
    return json(
      {
        ok: false,
        message: resolveDeliverableErrorMessage(error)
      },
      500
    );
  }
}
