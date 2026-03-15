import "server-only";

import type { App, AppLimitState, Plan, User } from "@/types";

import { appMessages } from "@/lib/apps/messages";
import { getCountdownState } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import type { CreateAppInput, UpdateAppInput } from "@/lib/apps/validation";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const appSelect =
  "id, user_id, name, platform, launch_date, created_at, updated_at";
const userSelect = "id, email, plan, created_at, updated_at";

export function buildAppLimitState(
  plan: Plan,
  appCount: number
): AppLimitState {
  if (plan === "pro") {
    return {
      plan,
      appCount,
      canCreateApp: true,
      remainingSlots: null
    };
  }

  const remainingSlots = Math.max(0, 1 - appCount);

  return {
    plan,
    appCount,
    canCreateApp: appCount < 1,
    remainingSlots
  };
}

export function resolveAppErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message.includes('relation "public.users" does not exist') ||
      error.message.includes('relation "public.apps" does not exist'))
  ) {
    return appMessages.schemaUnavailable;
  }

  return appMessages.genericError;
}

export async function getUserProfile(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("users")
    .select(userSelect)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as User | null;
}

export async function listAppsForUser(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("apps")
    .select(appSelect)
    .eq("user_id", userId)
    .order("launch_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as App[];
}

export async function getAppByIdForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string
) {
  const { data, error } = await supabase
    .from("apps")
    .select(appSelect)
    .eq("id", appId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as App | null;
}

export async function countAppsForUser(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const { count, error } = await supabase
    .from("apps")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getWorkspaceSnapshot(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const [profile, apps] = await Promise.all([
    getUserProfile(supabase, userId),
    listAppsForUser(supabase, userId)
  ]);

  return {
    profile,
    apps,
    limit: profile ? buildAppLimitState(profile.plan, apps.length) : null
  };
}

export async function getAppCreationState(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const profile = await getUserProfile(supabase, userId);

  if (!profile) {
    return {
      profile: null,
      limit: null
    };
  }

  const appCount = await countAppsForUser(supabase, userId);

  return {
    profile,
    limit: buildAppLimitState(profile.plan, appCount)
  };
}

export async function createAppForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  input: CreateAppInput
) {
  const { profile, limit } = await getAppCreationState(supabase, userId);

  if (!profile || !limit) {
    return {
      ok: false as const,
      message: appMessages.profileUnavailable
    };
  }

  if (!limit.canCreateApp) {
    return {
      ok: false as const,
      message: appMessages.planLimitReached,
      limit
    };
  }

  const { data, error } = await supabase
    .from("apps")
    .insert({
      user_id: userId,
      name: input.name,
      platform: input.platform,
      launch_date: input.launchDate
    })
    .select(appSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const app = data as App;

  // Mirror to products table (same UUID) so the product-based UI can find it
  try {
    // Ensure workspace exists
    const { data: ws } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let workspaceId: string | null = ws?.id ?? null;

    if (!workspaceId) {
      const { data: newWs } = await supabase
        .from("workspaces")
        .insert({ user_id: userId })
        .select("id")
        .single();
      workspaceId = newWs?.id ?? null;
    }

    if (workspaceId) {
      // Check if product with this ID already exists
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("id", app.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("products").insert({
          id: app.id,
          workspace_id: workspaceId,
          product_name: app.name,
          primary_platform: [app.platform],
          launch_date: app.launch_date,
        });
      }
    }
  } catch { /* non-critical — app was created successfully */ }

  return {
    ok: true as const,
    app,
    limit: buildAppLimitState(profile.plan, limit.appCount + 1)
  };
}

export async function deleteAppForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string
) {
  const { data, error } = await supabase
    .from("apps")
    .delete()
    .eq("id", appId)
    .eq("user_id", userId)
    .select(appSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as App | null;
}

export async function updateAppLaunchDateForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  input: UpdateAppInput
) {
  const { data, error } = await supabase
    .from("apps")
    .update({
      launch_date: input.launchDate
    })
    .eq("id", appId)
    .eq("user_id", userId)
    .select(appSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as App | null;
}

export function formatPlatformLabel(platform: App["platform"]) {
  switch (platform) {
    case "ios":
      return "iOS";
    case "android":
      return "Android";
    case "web":
      return "Web";
    default:
      return platform;
  }
}

export function formatLaunchDate(launchDate: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long"
  }).format(new Date(`${launchDate}T00:00:00.000Z`));
}

export function getLaunchCountdown(launchDate: string) {
  return getCountdownState(launchDate).label;
}
