import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/auth/session";
import { getChecklistWorkspace } from "@/lib/checklist/service";
import { hasSupabaseEnv } from "@/lib/env";
import { ExportPdfDocument } from "@/lib/export/pdf-document";
import { buildExportFileName, buildMarkdownExport } from "@/lib/export";
import { exportMessages } from "@/lib/export/messages";

export const runtime = "nodejs";

function json(message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      message
    },
    { status }
  );
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!hasSupabaseEnv()) {
    return json(exportMessages.unavailable, 503);
  }

  const { supabase, user } = await getSessionContext();

  if (!user) {
    return json(exportMessages.unauthorized, 401);
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format");

  if (format !== "pdf" && format !== "markdown") {
    return json(exportMessages.invalidFormat, 400);
  }

  try {
    const workspace = await getChecklistWorkspace(supabase, user.id, params.id);

    if (!workspace.app) {
      return json(exportMessages.appNotFound, 404);
    }

    const fileName = buildExportFileName(workspace.app.name, format);

    if (format === "markdown") {
      return new Response(buildMarkdownExport(workspace), {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`
        }
      });
    }

    const pdf = await renderToBuffer(ExportPdfDocument({ workspace }));

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    const message =
      error instanceof Error &&
      (error.message.includes('relation "public.checklist_item_statuses" does not exist') ||
        error.message.includes('relation "public.deliverables" does not exist') ||
        error.message.includes('relation "public.apps" does not exist'))
        ? exportMessages.schemaUnavailable
        : exportMessages.genericError;

    return json(message, 500);
  }
}
