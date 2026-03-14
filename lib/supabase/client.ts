"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseBrowserEnv } from "@/lib/env";

export function createClient() {
  const env = getSupabaseBrowserEnv();

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY
  );
}
