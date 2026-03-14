import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { routineMessages } from "@/lib/routine/messages";
import {
  getCurrentWeekNumber,
  getRoutineWorkspace,
  resolveRoutineErrorMessage
} from "@/lib/routine/service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        ok: false,
        message: routineMessages.unavailable
      },
      { status: 503 }
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: routineMessages.unauthorized
      },
      { status: 401 }
    );
  }

  try {
    const workspace = await getRoutineWorkspace(
      supabase,
      user.id,
      params.id,
      getCurrentWeekNumber()
    );

    if (!workspace.app) {
      return NextResponse.json(
        {
          ok: false,
          message: routineMessages.appNotFound
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      workspace.tasks.map(({ log: _log, ...task }) => task),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: resolveRoutineErrorMessage(error)
      },
      { status: 500 }
    );
  }
}
