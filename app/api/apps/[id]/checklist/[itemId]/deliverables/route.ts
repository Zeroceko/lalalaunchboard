import { NextResponse } from "next/server";

import { flattenFieldErrors } from "@/lib/auth/validation";
import { getSessionContext } from "@/lib/auth/session";
import { deliverableMessages } from "@/lib/deliverables/messages";
import {
  createFileDeliverable,
  createTextDeliverable,
  listDeliverablesForItem,
  resolveDeliverableErrorMessage
} from "@/lib/deliverables/service";
import {
  deliverableFileMetadataSchema,
  deliverableJsonSchema,
  getMaxDeliverableFileSize
} from "@/lib/deliverables/validation";
import { hasSupabaseEnv } from "@/lib/env";
import type { DeliverableActionResult } from "@/types";

function json(body: DeliverableActionResult, status: number) {
  return NextResponse.json(body, { status });
}

async function parseRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const type = String(formData.get("type") ?? "");

    if (type !== "file") {
      return {
        kind: "json" as const,
        value: {
          type,
          content: String(formData.get("content") ?? "")
        }
      };
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return {
        kind: "invalid-file" as const
      };
    }

    const parsed = deliverableFileMetadataSchema.safeParse({
      type,
      fileName: file.name,
      fileSize: file.size
    });

    if (!parsed.success) {
      return {
        kind: "file-errors" as const,
        errors: parsed.error
      };
    }

    return {
      kind: "file" as const,
      file
    };
  }

  const payload = await request.json();

  return {
    kind: "json" as const,
    value: payload
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string; itemId: string } }
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
    const deliverables = await listDeliverablesForItem(
      supabase,
      user.id,
      params.id,
      params.itemId
    );

    if (!deliverables) {
      return json(
        {
          ok: false,
          message: deliverableMessages.appNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        deliverables
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

export async function POST(
  request: Request,
  { params }: { params: { id: string; itemId: string } }
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

  const parsedRequest = await parseRequest(request);

  if (parsedRequest.kind === "invalid-file") {
    return json(
      {
        ok: false,
        message: deliverableMessages.fileRequired,
        fieldErrors: {
          file: deliverableMessages.fileRequired
        }
      },
      400
    );
  }

  if (parsedRequest.kind === "file-errors") {
    const errors = flattenFieldErrors(parsedRequest.errors);

    return json(
      {
        ok: false,
        message:
          errors.fileSize ??
          errors.fileName ??
          deliverableMessages.fileTooLarge,
        fieldErrors: {
          file:
            errors.fileSize ??
            errors.fileName ??
            deliverableMessages.fileTooLarge
        }
      },
      400
    );
  }

  if (parsedRequest.kind === "json") {
    const parsed = deliverableJsonSchema.safeParse(parsedRequest.value);

    if (!parsed.success) {
      const fieldErrors = flattenFieldErrors(parsed.error);

      return json(
        {
          ok: false,
          message:
            fieldErrors.content ??
            fieldErrors.type ??
            deliverableMessages.genericError,
          fieldErrors: {
            content: fieldErrors.content,
            type: fieldErrors.type
          }
        },
        400
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
      const deliverable = await createTextDeliverable(
        supabase,
        user.id,
        params.id,
        params.itemId,
        parsed.data
      );

      if (!deliverable) {
        return json(
          {
            ok: false,
            message: deliverableMessages.appNotFound
          },
          404
        );
      }

      return json(
        {
          ok: true,
          deliverable
        },
        201
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

  if (parsedRequest.file.size > getMaxDeliverableFileSize()) {
    return json(
      {
        ok: false,
        message: deliverableMessages.fileTooLarge,
        fieldErrors: {
          file: deliverableMessages.fileTooLarge
        }
      },
      400
    );
  }

  try {
    const deliverable = await createFileDeliverable(
      supabase,
      user.id,
      params.id,
      params.itemId,
      parsedRequest.file
    );

    if (!deliverable) {
      return json(
        {
          ok: false,
          message: deliverableMessages.appNotFound
        },
        404
      );
    }

    return json(
      {
        ok: true,
        deliverable
      },
      201
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
