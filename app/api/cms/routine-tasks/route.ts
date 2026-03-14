import { NextResponse } from "next/server";

import { getRoutineTasks } from "@/lib/contentful/client";

export async function GET() {
  const items = await getRoutineTasks();
  return NextResponse.json(items, { status: 200 });
}
