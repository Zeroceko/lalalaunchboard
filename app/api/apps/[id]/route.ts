import { NextResponse } from "next/server";

import { appMessages } from "@/lib/apps/messages";
import {
  deleteAppForUser,
  resolveAppErrorMessage,
  updateAppLaunchDateForUser
} from "@/lib/apps/service";
import { updateAppSchema } from "@/lib/apps/validation";
import { readJsonBody } from "@/lib/api/request";
import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import type { AppActionResult } from "@/types";

function json(body: AppActionResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  const parsed = updateAppSchema.safeParse(payload);

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
    const app = await updateAppLaunchDateForUser(
      supabase,
      user.id,
      params.id,
      parsed.data
    );

    if (!app) {
      return json(
        {
          ok: false,
          message: appMessages.appNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        message: appMessages.appUpdated,
        app
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

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
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
    const app = await deleteAppForUser(supabase, user.id, params.id);

    if (!app) {
      return json(
        {
          ok: false,
          message: appMessages.appNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        message: appMessages.appDeleted,
        app
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
