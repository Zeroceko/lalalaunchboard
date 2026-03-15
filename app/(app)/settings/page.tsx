import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { WorkspaceForm } from "@/components/settings/WorkspaceForm";
import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

import { SettingsShell } from "@/components/settings/SettingsShell";

export default async function SettingsPage() {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const [{ data: profile }, { data: workspace }] = await Promise.all([
    supabase.from("users").select("full_name, role_in_company").eq("id", user.id).maybeSingle(),
    supabase
      .from("workspaces")
      .select("id, user_id, company_name, website_url, company_stage, team_size, industry, business_model, target_audience, primary_platform, traction_level, revenue_level, growth_channel, compliance, competitors, uvp, created_at, updated_at")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <SettingsShell
      profileSection={
        <ProfileForm
          initialName={profile?.full_name ?? ""}
          initialRole={profile?.role_in_company ?? ""}
          email={user.email ?? ""}
        />
      }
      workspaceSection={
        <WorkspaceForm workspace={workspace ?? null} workspaceId={workspace?.id ?? null} />
      }
      appearanceSection={<AppearanceSettings />}
    />
  );
}
