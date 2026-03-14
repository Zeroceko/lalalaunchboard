import { NextResponse } from "next/server";

import { appMessages } from "@/lib/apps/messages";
import {
  createAppForUser,
  getWorkspaceSnapshot,
  resolveAppErrorMessage
} from "@/lib/apps/service";
import { createAppSchema } from "@/lib/apps/validation";
import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { AppActionResult } from "@/types";

function json(body: AppActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  if (!hasSupabaseEnv()) {
    return json(
      {
        ok: false,
        message: appMessages.appsUnavailable
      },
      503
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json(
      {
        ok: false,
        message: appMessages.unauthorized
      },
      401
    );
  }

  try {
    const snapshot = await getWorkspaceSnapshot(supabase, user.id);

    if (!snapshot.profile || !snapshot.limit) {
      return json(
        {
          ok: false,
          message: appMessages.profileUnavailable
        },
        409
      );
    }

    return json(
      {
        ok: true,
        apps: snapshot.apps,
        limit: snapshot.limit
      },
      200
    );
  } catch (error) {
    return json(
      {
        ok: false,
        message: resolveAppErrorMessage(error)
      },
      500
    );
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body.ok) {
    return json(
      {
        ok: false,
        message: appMessages.genericError
      },
      400
    );
  }

  const payload = body.data;
  const parsed = createAppSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: appMessages.genericError,
        fieldErrors: flattenFieldErrors(parsed.error)
      },
      400
    );
  }

  if (!hasSupabaseEnv()) {
    return json(
      {
        ok: false,
        message: appMessages.appsUnavailable
      },
      503
    );
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json(
      {
        ok: false,
        message: appMessages.unauthorized
      },
      401
    );
  }

  try {
    const result = await createAppForUser(supabase, user.id, parsed.data);

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
        message: appMessages.appCreated,
        app: result.app,
        limit: result.limit,
        redirectTo: `/app/${result.app.id}`
      },
      201
    );
  } catch (error) {
    return json(
      {
        ok: false,
        message: resolveAppErrorMessage(error)
      },
      500
    );
  }
}
