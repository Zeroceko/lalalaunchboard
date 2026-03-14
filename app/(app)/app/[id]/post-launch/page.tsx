import Link from "next/link";

import { RoutineWeekView } from "@/components/post-launch/RoutineWeekView";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
import { WorkspaceHero } from "@/components/shared/WorkspaceHero";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { WorkspaceSectionNav } from "@/components/shared/WorkspaceSectionNav";
import { formatLaunchDate, formatPlatformLabel } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";
import {
  getCurrentWeekNumber,
  getRoutineWorkspace,
  normalizeWeekNumber
} from "@/lib/routine/service";

export default async function PostLaunchPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { week?: string };
}) {
  const { supabase, user } = await requireSessionContext();
  const currentWeek = getCurrentWeekNumber();
  const weekNumber = normalizeWeekNumber(searchParams?.week);

  try {
    const workspace = await getRoutineWorkspace(
      supabase,
      user.id,
      params.id,
      weekNumber
    );

    if (!workspace.app) {
      return (
        <main className="mx-auto max-w-5xl px-6 py-16">
          <WorkspaceNotice
            eyebrow="Workspace bulunamadi"
            title="Bu app workspace'ine erisemiyoruz."
            description="Silinmis olabilir ya da bu workspace sana ait olmayabilir."
            actionHref="/dashboard"
            actionLabel="Dashboard'a don"
          />
        </main>
      );
    }

    const completionRate =
      workspace.totalCount === 0
        ? 0
        : Math.round((workspace.completedCount / workspace.totalCount) * 100);
    const isCurrentWeek = workspace.weekNumber === currentWeek;
    const launchDateLabel = formatLaunchDate(workspace.app.launch_date);

    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        {workspace.contentSource === "fallback" ? (
          <ToastTrigger
            toastKey={`cms-fallback-routine-${workspace.app.id}`}
            title="Local CMS fallback aktif"
            description="Routine task icerigi su an local fallback veriden geliyor; Contentful baglandiginda otomatik guncellenecek."
            variant="info"
          />
        ) : null}

        <div className="space-y-8">
          <WorkspaceSectionNav appId={workspace.app.id} />

          <WorkspaceHero
            eyebrow="Post-launch routine"
            title={`${workspace.app.name} icin growth cadence`}
            description={`${launchDateLabel} sonrasinda haftalik growth, analytics ve feedback akislarini ayni board mantigiyla yurut. Bu ekran launch sonrasi operasyon ritmini dagitmadan tekrar kuruyor.`}
            platformLabel={formatPlatformLabel(workspace.app.platform)}
            launchDate={workspace.app.launch_date}
            contentSource={workspace.contentSource}
            actions={[
              {
                href: `/app/${workspace.app.id}`,
                label: "Prep board'a don"
              },
              {
                href: "/dashboard",
                label: "Dashboard"
              },
              {
                href: `/app/${workspace.app.id}/export`,
                label: "Export hazirla",
                variant: "primary"
              }
            ]}
            stats={[
              {
                label: "Selected week",
                value: `#${workspace.weekNumber}`,
                detail: isCurrentWeek
                  ? "Su an aktif growth haftasindasin"
                  : "Gecmis veya sonraki bir haftayi inceliyorsun"
              },
              {
                label: "Weekly completion",
                value: `%${completionRate}`,
                detail: `${workspace.completedCount}/${workspace.totalCount} task tamamlandi`
              },
              {
                label: "Open tasks",
                value: `${Math.max(
                  workspace.totalCount - workspace.completedCount,
                  0
                )}`,
                detail: "Bu hafta kapanmayi bekleyen growth adimlari"
              }
            ]}
            panelEyebrow="Routine rhythm"
            panelTitle={
              isCurrentWeek
                ? "Current week in motion"
                : `Week ${workspace.weekNumber} snapshot`
            }
            panelDescription={
              isCurrentWeek
                ? "Aktif haftadaki tekrar eden gorevleri duzenli kapatmak, launch sonrasi momentumun dagilmasini onluyor."
                : "Farkli haftalari inceleyerek ritimde hangi alanlarin aksadigini veya tekrar guclendigini gorebilirsin."
            }
            panelBody={
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                    Task count
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {workspace.totalCount}
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                    Week status
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {isCurrentWeek ? "Active" : "Review"}
                  </p>
                </div>
              </div>
            }
            panelFootnote="Keep the cadence after launch"
          />

          <RoutineWeekView
            appId={workspace.app.id}
            weekNumber={workspace.weekNumber}
            currentWeek={currentWeek}
            tasks={workspace.tasks}
            completedCount={workspace.completedCount}
            totalCount={workspace.totalCount}
          />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Schema bekleniyor"
          title="Post-launch routine veritabanini bekliyor."
          description="Hosted Supabase projesine migration push tamamlandiginda bu ekran gercek routine verisiyle calisacak."
        />
      </main>
    );
  }
}
