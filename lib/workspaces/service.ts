import "server-only";

import type { Workspace } from "@/types";

import { createClient } from "@/lib/supabase/server";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "@/lib/workspaces/validation";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const workspaceSelect =
  "id, user_id, company_name, website_url, company_stage, team_size, industry, business_model, target_audience, primary_platform, traction_level, revenue_level, growth_channel, compliance, competitors, uvp, created_at, updated_at";

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

export async function createWorkspace(
  supabase: ServerSupabaseClient,
  userId: string,
  input: CreateWorkspaceInput
) {
  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      user_id: userId,
      company_name: input.company_name,
      website_url: input.website_url || null,
      company_stage: input.company_stage ?? null,
      team_size: input.team_size ?? null,
      industry: input.industry ?? null,
      business_model: input.business_model ?? null,
      target_audience: input.target_audience ?? null,
      primary_platform: input.primary_platform ?? null,
      traction_level: input.traction_level ?? null,
      revenue_level: input.revenue_level ?? null,
      growth_channel: input.growth_channel ?? null,
      compliance: input.compliance ?? null,
      competitors: input.competitors ?? null,
      uvp: input.uvp ?? null
    })
    .select(workspaceSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Workspace;
}

export async function updateWorkspace(
  supabase: ServerSupabaseClient,
  userId: string,
  workspaceId: string,
  input: UpdateWorkspaceInput
) {
  const updatePayload: Record<string, unknown> = {};
  if (input.company_name !== undefined) updatePayload.company_name = input.company_name;
  if (input.website_url !== undefined) updatePayload.website_url = input.website_url || null;
  if (input.company_stage !== undefined) updatePayload.company_stage = input.company_stage;
  if (input.team_size !== undefined) updatePayload.team_size = input.team_size;
  if (input.industry !== undefined) updatePayload.industry = input.industry;
  if (input.business_model !== undefined) updatePayload.business_model = input.business_model;
  if (input.target_audience !== undefined) updatePayload.target_audience = input.target_audience;
  if (input.primary_platform !== undefined) updatePayload.primary_platform = input.primary_platform;
  if (input.traction_level !== undefined) updatePayload.traction_level = input.traction_level;
  if (input.revenue_level !== undefined) updatePayload.revenue_level = input.revenue_level;
  if (input.growth_channel !== undefined) updatePayload.growth_channel = input.growth_channel;
  if (input.compliance !== undefined) updatePayload.compliance = input.compliance;
  if (input.competitors !== undefined) updatePayload.competitors = input.competitors;
  if (input.uvp !== undefined) updatePayload.uvp = input.uvp;

  const { data, error } = await supabase
    .from("workspaces")
    .update(updatePayload)
    .eq("id", workspaceId)
    .eq("user_id", userId)
    .select(workspaceSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as Workspace | null;
}
