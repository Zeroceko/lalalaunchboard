import { NextResponse } from "next/server";

import { workspaceMessages } from "@/lib/workspaces/messages";
import { updateWorkspace } from "@/lib/workspaces/service";
import { updateWorkspaceSchema } from "@/lib/workspaces/validation";
import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { WorkspaceActionResult } from "@/types";

function json(body: WorkspaceActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json({ ok: false, message: workspaceMessages.genericError }, 400);
  }

  const parsed = updateWorkspaceSchema.safeParse(body.data);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: workspaceMessages.genericError,
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json({ ok: false, message: workspaceMessages.genericError }, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json({ ok: false, message: workspaceMessages.unauthorized }, 401);
  }

  try {
    const workspace = await updateWorkspace(supabase, user.id, params.id, parsed.data);

    if (!workspace) {
      return json({ ok: false, message: workspaceMessages.workspaceNotFound }, 404);
    }

    return json(
      {
        ok: true,
        message: workspaceMessages.workspaceUpdated,
        workspace
      },
      200
    );
  } catch (error) {
    return json(
      {
        ok: false,
        message: error instanceof Error ? error.message : workspaceMessages.genericError
      },
      500
    );
  }
}
