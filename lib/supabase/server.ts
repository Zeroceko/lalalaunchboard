import { cookies } from "next/headers";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { getSupabaseServerEnv } from "@/lib/env";

export function createClient() {
  const cookieStore = cookies();
  const env = getSupabaseServerEnv();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOptions;
          }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can read cookies even when they cannot mutate them.
          }
        }
      }
    }
  );
}
