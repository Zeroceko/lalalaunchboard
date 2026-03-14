import { NextResponse } from "next/server";

import { getChecklistItems } from "@/lib/contentful/client";

export async function GET() {
  const items = await getChecklistItems();
  return NextResponse.json(items, { status: 200 });
}
