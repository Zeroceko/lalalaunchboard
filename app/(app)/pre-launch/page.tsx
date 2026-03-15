import { Settings } from "lucide-react";
import Link from "next/link";

import { PreLaunchClient } from "@/components/pre-launch/PreLaunchClient";
import { requireSessionContext } from "@/lib/auth/session";
import { generatePreLaunchItems } from "@/lib/prelaunch/items";
import { createClient } from "@/lib/supabase/server";

const PLATFORM_LABELS: Record<string, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web"
};

const PLATFORM_COLORS: Record<string, string> = {
  ios: "hsl(350,78%,56%)",
  android: "hsl(152,58%,42%)",
  web: "hsl(221,84%,54%)"
};

const STAGE_LABELS: Record<string, string> = {
  "Pre-launch": "Pre-launch",
  "MVP": "MVP",
  "Seed": "Seed",
  "Series A": "Series A"
};

export default async function PreLaunchPage() {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const [{ data: workspace }, { data: apps }] = await Promise.all([
    supabase
      .from("workspaces")
      .select("id, company_name, industry, primary_platform, compliance, company_stage, target_audience, uvp")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("apps")
      .select("id, name, platform, launch_date")
      .eq("user_id", user.id)
      .order("launch_date", { ascending: true })
      .limit(1)
  ]);

  const primaryApp = apps?.[0] ?? null;

  const daysLeft = primaryApp
    ? Math.ceil((new Date(primaryApp.launch_date).getTime() - Date.now()) / 86400000)
    : null;

  const items = generatePreLaunchItems({
    industry: workspace?.industry,
    platforms: workspace?.primary_platform,
    compliance: workspace?.compliance,
    company_stage: workspace?.company_stage
  });

  const platforms = workspace?.primary_platform ?? [];
  const complianceTags = workspace?.compliance ?? [];
  const hasWorkspace = Boolean(workspace?.company_name || workspace?.industry);

  return (
    <div className="h-full overflow-y-auto bg-background">

      {/* ── Hero header ── */}
      <div className="border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.5)]">
        <div className="mx-auto max-w-5xl px-6 py-7">

          {/* Top row: app name + launch countdown */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              {/* Eyebrow */}
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground)/0.7)]">
                Pre-Launch Checklist
              </p>
              {/* Company / App name */}
              <h1 className="text-[1.5rem] font-black tracking-[-0.04em] text-foreground leading-tight">
                {workspace?.company_name
                  ? workspace.company_name
                  : primaryApp?.name
                  ? primaryApp.name
                  : "Şirket Profili Eksik"}
              </h1>
              {/* Sub-info */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {workspace?.industry && (
                  <span className="rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.08)] px-2.5 py-0.5 text-[11px] font-semibold text-[hsl(var(--primary))]">
                    {workspace.industry}
                  </span>
                )}
                {workspace?.company_stage && (
                  <span className="rounded-full border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.4)] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(var(--muted-foreground))]">
                    {STAGE_LABELS[workspace.company_stage] ?? workspace.company_stage}
                  </span>
                )}
                {platforms.map((p: string) => (
                  <span
                    key={p}
                    className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      borderColor: PLATFORM_COLORS[p] + "40",
                      backgroundColor: PLATFORM_COLORS[p] + "12",
                      color: PLATFORM_COLORS[p]
                    }}
                  >
                    {PLATFORM_LABELS[p] ?? p}
                  </span>
                ))}
                {complianceTags.map((c: string) => (
                  <span
                    key={c}
                    className="rounded-full border border-[hsl(38,92%,52%/0.3)] bg-[hsl(38,92%,52%/0.08)] px-2.5 py-0.5 text-[11px] font-semibold text-[hsl(38,88%,42%)]"
                  >
                    {c}
                  </span>
                ))}
                {!hasWorkspace && (
                  <Link
                    href="/settings"
                    className="flex items-center gap-1 rounded-full border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.3)] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-foreground"
                  >
                    <Settings size={10} />
                    Profil ekle
                  </Link>
                )}
              </div>
            </div>

            {/* Launch countdown */}
            {primaryApp && daysLeft !== null && (
              <div className="shrink-0 overflow-hidden rounded-2xl border border-[hsl(var(--border)/0.5)] bg-background px-5 py-4 text-center sm:min-w-[140px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground)/0.7)]">
                  {daysLeft > 0 ? "Launch'a kalan" : "Durum"}
                </p>
                <p className={`mt-1 text-[2rem] font-black tracking-[-0.05em] ${daysLeft > 0 ? "text-foreground" : "text-[hsl(152,58%,42%)]"}`}>
                  {daysLeft > 0 ? daysLeft : "🚀"}
                </p>
                <p className="text-[10.5px] font-medium text-[hsl(var(--muted-foreground))]">
                  {daysLeft > 0 ? "gün" : "Yayında"}
                </p>
                <div className="mt-2.5 border-t border-[hsl(var(--border)/0.4)] pt-2.5">
                  <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground)/0.6)]">{primaryApp.name}</p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground)/0.5)]">
                    {new Date(primaryApp.launch_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Context cards row */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ContextCard
              label="Hedef Kitle"
              value={workspace?.target_audience || "—"}
              empty={!workspace?.target_audience}
            />
            <ContextCard
              label="Toplam Madde"
              value={items.length > 0 ? `${items.length} madde` : "—"}
              empty={items.length === 0}
            />
            <ContextCard
              label="Kritik Riskler"
              value={`${items.filter(i => i.priority === "critical").length} kritik`}
              highlight
              empty={items.filter(i => i.priority === "critical").length === 0}
            />
            <ContextCard
              label="Sektör Compliance"
              value={items.filter(i => i.category === "sector_compliance").length > 0
                ? `${items.filter(i => i.category === "sector_compliance").length} özel madde`
                : "Genel liste"}
              empty={false}
            />
          </div>

          {/* Personalisation notice */}
          {hasWorkspace && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[hsl(var(--primary)/0.15)] bg-[hsl(var(--primary)/0.05)] px-4 py-2.5">
              <span className="text-[11px] font-semibold text-[hsl(var(--primary))]">✦</span>
              <p className="text-[11.5px] text-[hsl(var(--muted-foreground))]">
                Bu liste{workspace?.industry && ` <strong>${workspace.industry}</strong>`} sektörü ve{" "}
                {platforms.length > 0
                  ? platforms.map((p: string) => PLATFORM_LABELS[p] ?? p).join(" + ")
                  : "seçili platform"}{" "}
                için kişiselleştirildi.{" "}
                <Link href="/settings" className="font-semibold text-[hsl(var(--primary))] hover:underline">
                  Profili güncelle →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Checklist ── */}
      <div className="mx-auto max-w-5xl px-6 py-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.2)] px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[hsl(var(--border)/0.5)] bg-background">
              <Settings size={22} className="text-muted-foreground" />
            </div>
            <p className="text-[15px] font-bold text-foreground">Profil bilgileri eksik</p>
            <p className="mt-2 text-[13px] leading-6 text-[hsl(var(--muted-foreground))]">
              Kişiselleştirilmiş checklist için sektör ve platform bilgilerini ekle.
            </p>
            <Link
              href="/settings"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[hsl(var(--primary-strong))]"
            >
              <Settings size={13} />
              Ayarlara git
            </Link>
          </div>
        ) : (
          <PreLaunchClient
            items={items}
            productId={`workspace_${workspace?.id ?? "default"}`}
            companyName={workspace?.company_name ?? undefined}
            industryLabel={workspace?.industry ?? undefined}
            platformLabels={platforms.map((p: string) => PLATFORM_LABELS[p] ?? p)}
            companyStage={workspace?.company_stage ?? undefined}
            appName={primaryApp?.name ?? undefined}
            launchDate={primaryApp?.launch_date ?? undefined}
          />
        )}
      </div>
    </div>
  );
}

// ── Context card helper ───────────────────────────────────────────────────────
function ContextCard({
  label,
  value,
  highlight = false,
  empty = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
  empty?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground)/0.6)]">
        {label}
      </p>
      <p className={`mt-1 text-[13px] font-bold leading-snug ${
        empty
          ? "text-[hsl(var(--muted-foreground)/0.4)]"
          : highlight
          ? "text-[hsl(350,78%,50%)]"
          : "text-foreground"
      }`}>
        {value}
      </p>
    </div>
  );
}
