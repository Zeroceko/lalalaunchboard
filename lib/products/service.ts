import "server-only";

import type { Plan, Product, ProductLimitState, User, Workspace } from "@/types";

import { productMessages } from "@/lib/products/messages";
import { getCountdownState } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import type { CreateProductInput, UpdateProductInput } from "@/lib/products/validation";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const productSelect =
  "id, workspace_id, product_name, business_model, monetization_type, target_audience, primary_platform, launch_date, industry, company_stage, compliance, uvp, competitors, created_at, updated_at";
const userSelect = "id, email, plan, full_name, role_in_company, created_at, updated_at";
const workspaceSelect =
  "id, user_id, company_name, website_url, company_stage, team_size, created_at, updated_at";

export function buildProductLimitState(
  plan: Plan,
  productCount: number
): ProductLimitState {
  if (plan === "pro") {
    return {
      plan,
      productCount,
      canCreateProduct: true,
      remainingSlots: null
    };
  }

  const remainingSlots = Math.max(0, 1 - productCount);

  return {
    plan,
    productCount,
    canCreateProduct: productCount < 1,
    remainingSlots
  };
}

export function resolveProductErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message.includes('relation "public.users" does not exist') ||
      error.message.includes('relation "public.products" does not exist') ||
      error.message.includes('relation "public.workspaces" does not exist'))
  ) {
    return productMessages.schemaUnavailable;
  }

  return productMessages.genericError;
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

export async function getWorkspaceForUser(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("workspaces")
    .select(workspaceSelect)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as Workspace | null;
}

export async function getOrCreateWorkspace(
  supabase: ServerSupabaseClient,
  userId: string
): Promise<Workspace> {
  const existing = await getWorkspaceForUser(supabase, userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("workspaces")
    .insert({ user_id: userId })
    .select(workspaceSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Workspace;
}

export async function listProductsForWorkspace(
  supabase: ServerSupabaseClient,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("workspace_id", workspaceId)
    .order("launch_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Product[];
}

export async function getProductByIdForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  productId: string
) {
  const { data, error } = await supabase
    .from("products")
    .select(`${productSelect}, workspaces!inner(user_id)`)
    .eq("id", productId)
    .eq("workspaces.user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  // Strip the joined workspaces field before returning
  const { workspaces: _ws, ...product } = data as typeof data & { workspaces: unknown };
  return product as Product;
}

export async function countProductsForUser(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const workspace = await getWorkspaceForUser(supabase, userId);
  if (!workspace) return 0;

  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.id);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getProductSnapshot(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const [profile, workspace] = await Promise.all([
    getUserProfile(supabase, userId),
    getWorkspaceForUser(supabase, userId)
  ]);

  if (!workspace) {
    return {
      profile,
      workspace: null,
      products: [] as Product[],
      limit: profile ? buildProductLimitState(profile.plan, 0) : null
    };
  }

  const products = await listProductsForWorkspace(supabase, workspace.id);

  return {
    profile,
    workspace,
    products,
    limit: profile ? buildProductLimitState(profile.plan, products.length) : null
  };
}

export async function getProductCreationState(
  supabase: ServerSupabaseClient,
  userId: string
) {
  const profile = await getUserProfile(supabase, userId);

  if (!profile) {
    return { profile: null, workspace: null, limit: null };
  }

  const productCount = await countProductsForUser(supabase, userId);
  const workspace = await getWorkspaceForUser(supabase, userId);

  return {
    profile,
    workspace,
    limit: buildProductLimitState(profile.plan, productCount)
  };
}

export async function createProductForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  input: CreateProductInput
) {
  const { profile, limit } = await getProductCreationState(supabase, userId);

  if (!profile || !limit) {
    return {
      ok: false as const,
      message: productMessages.profileUnavailable
    };
  }

  if (!limit.canCreateProduct) {
    return {
      ok: false as const,
      message: productMessages.planLimitReached,
      limit
    };
  }

  const workspace = await getOrCreateWorkspace(supabase, userId);

  const { data, error } = await supabase
    .from("products")
    .insert({
      workspace_id: workspace.id,
      product_name: input.product_name,
      primary_platform: input.primary_platform,
      launch_date: input.launch_date,
      business_model: input.business_model ?? null,
      monetization_type: input.monetization_type ?? null,
      target_audience: input.target_audience ?? null,
      industry: input.industry ?? null,
      company_stage: input.company_stage ?? null,
      compliance: input.compliance ?? null,
      uvp: input.uvp ?? null,
      competitors: input.competitors ?? null
    })
    .select(productSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ok: true as const,
    product: data as Product,
    limit: buildProductLimitState(profile.plan, limit.productCount + 1)
  };
}

export async function deleteProductForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  productId: string
) {
  const workspace = await getWorkspaceForUser(supabase, userId);
  if (!workspace) return null;

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("workspace_id", workspace.id)
    .select(productSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as Product | null;
}

export async function updateProductForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  productId: string,
  input: UpdateProductInput
) {
  const workspace = await getWorkspaceForUser(supabase, userId);
  if (!workspace) return null;

  const updatePayload: Record<string, unknown> = {};
  if (input.launch_date !== undefined) updatePayload.launch_date = input.launch_date;
  if (input.business_model !== undefined) updatePayload.business_model = input.business_model;
  if (input.monetization_type !== undefined) updatePayload.monetization_type = input.monetization_type;
  if (input.target_audience !== undefined) updatePayload.target_audience = input.target_audience;
  if (input.primary_platform !== undefined) updatePayload.primary_platform = input.primary_platform;
  if (input.industry !== undefined) updatePayload.industry = input.industry;
  if (input.company_stage !== undefined) updatePayload.company_stage = input.company_stage;
  if (input.compliance !== undefined) updatePayload.compliance = input.compliance;
  if (input.uvp !== undefined) updatePayload.uvp = input.uvp;
  if (input.competitors !== undefined) updatePayload.competitors = input.competitors;

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", productId)
    .eq("workspace_id", workspace.id)
    .select(productSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as Product | null;
}

export function formatPlatformLabel(platform: string) {
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
