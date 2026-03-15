import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const [{ data: profile }, { data: workspace }] = await Promise.all([
    supabase.from("users").select("full_name, role_in_company").eq("id", user.id).maybeSingle(),
    supabase
      .from("workspaces")
      .select("id, company_name, industry, business_model, primary_platform, company_stage, target_audience, team_size, traction_level, revenue_level, growth_channel, compliance, competitors, uvp, website_url")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <OnboardingClient
      initial={{
        fullName: profile?.full_name ?? "",
        role: profile?.role_in_company ?? "",
        workspaceId: workspace?.id ?? null,
        companyName: workspace?.company_name ?? "",
        industry: workspace?.industry ?? "",
        businessModel: workspace?.business_model ?? "",
        platforms: workspace?.primary_platform ?? [],
        stage: workspace?.company_stage ?? "",
        targetAudience: workspace?.target_audience ?? "",
        teamSize: workspace?.team_size ?? "",
        tractionLevel: workspace?.traction_level ?? "",
        revenueLevel: workspace?.revenue_level ?? "",
        growthChannel: workspace?.growth_channel ?? "",
        compliance: workspace?.compliance ?? [],
        competitors: workspace?.competitors ?? [],
        uvp: workspace?.uvp ?? "",
        websiteUrl: workspace?.website_url ?? "",
      }}
    />
  );
}
