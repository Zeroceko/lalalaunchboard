import { NextResponse } from "next/server";

import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { routineMessages } from "@/lib/routine/messages";
import {
  listRoutineLogsForWeek,
  normalizeWeekNumber,
  resolveRoutineErrorMessage,
  upsertRoutineLogForUser
} from "@/lib/routine/service";
import { routineLogSchema } from "@/lib/routine/validation";
import type { RoutineActionResult } from "@/types";

function json(body: RoutineActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function GET(
  request: Request,
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
    const url = new URL(request.url);
    const weekNumber = normalizeWeekNumber(url.searchParams.get("week"));
    const logs = await listRoutineLogsForWeek(supabase, params.id, weekNumber);

    return NextResponse.json(logs, { status: 200 });
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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json(
      {
        ok: false,
        message: routineMessages.invalidState
      },
      400
    );
  }

  const payload = body.data;
  const parsed = routineLogSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: routineMessages.invalidState,
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json(
      {
        ok: false,
        message: routineMessages.unavailable
      },
      503
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json(
      {
        ok: false,
        message: routineMessages.unauthorized
      },
      401
    );
  }

  try {
    const log = await upsertRoutineLogForUser(
      supabase,
      user.id,
      params.id,
      parsed.data
    );

    if (!log) {
      return json(
        {
          ok: false,
          message: routineMessages.appNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        log
      },
      200
    );
  } catch (error) {
    return json(
      {
        ok: false,
        message: resolveRoutineErrorMessage(error)
      },
      500
    );
  }
}
