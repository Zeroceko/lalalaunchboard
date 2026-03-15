import { NextResponse } from "next/server";

import { workspaceMessages } from "@/lib/workspaces/messages";
import { createWorkspace, getWorkspaceForUser } from "@/lib/workspaces/service";
import { createWorkspaceSchema } from "@/lib/workspaces/validation";
import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { WorkspaceActionResult } from "@/types";

function json(body: WorkspaceActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  if (!hasSupabaseEnv()) {
    return json({ ok: false, message: workspaceMessages.genericError }, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json({ ok: false, message: workspaceMessages.unauthorized }, 401);
  }

  try {
    const workspace = await getWorkspaceForUser(supabase, user.id);
    return json({ ok: true, workspace: workspace ?? undefined }, 200);
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

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json({ ok: false, message: workspaceMessages.genericError }, 400);
  }

  const parsed = createWorkspaceSchema.safeParse(body.data);

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
    const workspace = await createWorkspace(supabase, user.id, parsed.data);
    return json(
      {
        ok: true,
        message: workspaceMessages.workspaceCreated,
        workspace
      },
      201
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
