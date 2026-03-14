import "server-only";

import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function getSessionContext() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return {
      supabase,
      user: null
    };
  }

  return {
    supabase,
    user
  };
}

export async function requireSessionContext() {
  const context = await getSessionContext();

  if (!context.user) {
    redirect("/auth");
  }

  return {
    supabase: context.supabase,
    user: context.user as SupabaseUser
  };
}
