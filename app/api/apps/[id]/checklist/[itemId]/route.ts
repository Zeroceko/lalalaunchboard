import { NextResponse } from "next/server";

import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { checklistMessages } from "@/lib/checklist/messages";
import {
  resolveChecklistErrorMessage,
  updateChecklistItemStatus
} from "@/lib/checklist/service";
import { checklistStatusSchema } from "@/lib/checklist/validation";
import { hasSupabaseEnv } from "@/lib/env";
import type { ChecklistActionResult } from "@/types";

function json(body: ChecklistActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; itemId: string } }
) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json(
      {
        ok: false,
        message: checklistMessages.invalidState
      },
      400
    );
  }

  const payload = body.data;
  const parsed = checklistStatusSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: checklistMessages.invalidState,
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json(
      {
        ok: false,
        message: checklistMessages.unavailable
      },
      503
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json(
      {
        ok: false,
        message: checklistMessages.unauthorized
      },
      401
    );
  }

  try {
    const status = await updateChecklistItemStatus(
      supabase,
      user.id,
      params.id,
      params.itemId,
      parsed.data
    );

    if (!status) {
      return json(
        {
          ok: false,
          message: checklistMessages.appNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        status
      },
      200
    );
  } catch (error) {
    return json(
      {
        ok: false,
        message: resolveChecklistErrorMessage(error)
      },
      500
    );
  }
}
