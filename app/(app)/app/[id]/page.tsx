import Link from "next/link";

import { ChecklistCategory } from "@/components/checklist/ChecklistCategory";
import { ProgressBar } from "@/components/checklist/ProgressBar";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
import { WorkspaceHero } from "@/components/shared/WorkspaceHero";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { WorkspaceSectionNav } from "@/components/shared/WorkspaceSectionNav";
import { formatLaunchDate, formatPlatformLabel } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";
import { getChecklistWorkspace } from "@/lib/checklist/service";
import { groupChecklistItems } from "@/lib/progress";

export default async function AppChecklistPage({
  params
}: {
  params: { id: string };
}) {
  const { supabase, user } = await requireSessionContext();

  try {
    const workspace = await getChecklistWorkspace(supabase, user.id, params.id);

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

    const app = workspace.app;
    const groupedItems = groupChecklistItems(workspace.items);
    const deliverableCount = workspace.items.reduce(
      (total, item) => total + item.deliverables.length,
      0
    );
    const resourceCount = workspace.items.reduce(
      (total, item) => total + item.toolLinks.length,
      0
    );
    const remainingCount =
      workspace.progress.totalCount - workspace.progress.completedCount;
    const launchDateLabel = formatLaunchDate(app.launch_date);

    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        {workspace.contentSource === "fallback" ? (
          <ToastTrigger
            toastKey={`cms-fallback-checklist-${app.id}`}
            title="Local CMS fallback aktif"
            description="Checklist icerigi su an local fallback veriden geliyor; Contentful baglandiginda otomatik guncellenecek."
            variant="info"
          />
        ) : null}

        <div className="space-y-8">
          <WorkspaceSectionNav appId={app.id} />

          <WorkspaceHero
            eyebrow="Pre-launch board"
            title={`${app.name} icin launch prep board`}
            description={`${launchDateLabel} hedefi icin checklist, deliverable ve rehber linklerini tek yerde tut. Bu ekran prep akisinin merkezi gibi calisiyor ve acik kalan hamleleri netlestiriyor.`}
            platformLabel={formatPlatformLabel(app.platform)}
            launchDate={app.launch_date}
            contentSource={workspace.contentSource}
            actions={[
              {
                href: "/dashboard",
                label: "Dashboard'a don"
              },
              {
                href: `/app/${params.id}/post-launch`,
                label: "Growth routine'a gec"
              },
              {
                href: `/app/${params.id}/export`,
                label: "Export hazirla",
                variant: "primary"
              }
            ]}
            stats={[
              {
                label: "Overall progress",
                value: `%${workspace.progress.overall}`,
                detail: `${workspace.progress.completedCount}/${workspace.progress.totalCount} item tamamlandi`
              },
              {
                label: "Deliverables",
                value: `${deliverableCount}`,
                detail: "Checklist item'larina bagli somut cikti sayisi"
              },
              {
                label: "Resource links",
                value: `${resourceCount}`,
                detail: "Board icinde acik rehber ve arac kaynagi"
              }
            ]}
            panelEyebrow="Launch posture"
            panelTitle={
              remainingCount === 0
                ? "Board launch-ready"
                : `${remainingCount} acik hareket kaldi`
            }
            panelDescription={
              remainingCount === 0
                ? "Temel prep item'lari kapanmis durumda. Artik export alabilir ve sonraki ritim ekranina gecebilirsin."
                : "Acik kalan item'lari kategori bazinda kapatip deliverable'lari tamamladikca board daha temiz bir launch durumuna geciyor."
            }
            panelBody={
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-white/72">
                      Prep completion
                    </span>
                    <span className="font-semibold text-white">
                      %{workspace.progress.overall}
                    </span>
                  </div>
                  <ProgressBar value={workspace.progress.overall} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                      Categories
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {groupedItems.length}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                      Open items
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {remainingCount}
                    </p>
                  </div>
                </div>
              </div>
            }
            panelFootnote="Prep -> Launch -> Grow"
          />

          <section className="grid gap-4 xl:grid-cols-4">
            {groupedItems.map((group) => (
              <div
                key={group.category}
                className="rounded-[1.6rem] border border-foreground/10 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground/48">
                  {group.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  %{group.progress}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {group.completedCount}/{group.totalCount} item tamamlandi
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {group.progress === 100
                    ? "Bu lane tamamen hazir. Sonraki akisa gecmek icin iyi durumdasin."
                    : "Bu lane icinde hala kapanmasi gereken acik item'lar var."}
                </p>
              </div>
            ))}
          </section>

          <div className="grid gap-6">
            {groupedItems.map((group) => (
              <ChecklistCategory
                key={group.category}
                appId={app.id}
                title={group.label}
                progress={group.progress}
                completedCount={group.completedCount}
                totalCount={group.totalCount}
                items={group.items}
              />
            ))}
          </div>
        </div>
      </main>
    );
  } catch {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Schema bekleniyor"
          title="Checklist workspace veritabanini bekliyor."
          description="Hosted Supabase projesine migration push tamamlandiginda bu ekran gercek checklist verisiyle calisacak."
        />
      </main>
    );
  }
}
