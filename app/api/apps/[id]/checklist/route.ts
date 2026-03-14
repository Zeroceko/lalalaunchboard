import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/auth/session";
import {
  getChecklistWorkspace,
  resolveChecklistErrorMessage
} from "@/lib/checklist/service";
import { checklistMessages } from "@/lib/checklist/messages";
import { hasSupabaseEnv } from "@/lib/env";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        ok: false,
        message: checklistMessages.unavailable
      },
      { status: 503 }
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: checklistMessages.unauthorized
      },
      { status: 401 }
    );
  }

  try {
    const workspace = await getChecklistWorkspace(supabase, user.id, params.id);

    if (!workspace.app) {
      return NextResponse.json(
        {
          ok: false,
          message: checklistMessages.appNotFound
        },
        { status: 404 }
      );
    }

    return NextResponse.json(workspace.items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: resolveChecklistErrorMessage(error)
      },
      { status: 500 }
    );
  }
}
