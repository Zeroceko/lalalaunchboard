import Link from "next/link";

import { ExportButton } from "@/components/shared/ExportButton";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
import { WorkspaceHero } from "@/components/shared/WorkspaceHero";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { WorkspaceSectionNav } from "@/components/shared/WorkspaceSectionNav";
import { formatLaunchDate, formatPlatformLabel } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";
import { getChecklistWorkspace } from "@/lib/checklist/service";

export default async function ExportPage({
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

    const deliverableCount = workspace.items.reduce(
      (total, item) => total + item.deliverables.length,
      0
    );
    const launchDateLabel = formatLaunchDate(workspace.app.launch_date);

    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        {workspace.contentSource === "fallback" ? (
          <ToastTrigger
            toastKey={`cms-fallback-export-${workspace.app.id}`}
            title="Local CMS fallback aktif"
            description="Export icerigi su an local fallback checklist verisiyle olusuyor; Contentful baglandiginda otomatik guncellenecek."
            variant="info"
          />
        ) : null}

        <div className="space-y-8">
          <WorkspaceSectionNav appId={workspace.app.id} />

          <WorkspaceHero
            eyebrow="Shareable export"
            title={`${workspace.app.name} board'unu paylasilabilir hale getir`}
            description={`${launchDateLabel} hedefindeki prep ilerlemesini, deliverable durumunu ve checklist ozetini tek tikla rapora donustur. Bu alan ekiple, yatirimciyla veya kendi arsivinle paylasabilecegin temiz ciktilari hazirlar.`}
            platformLabel={formatPlatformLabel(workspace.app.platform)}
            launchDate={workspace.app.launch_date}
            contentSource={workspace.contentSource}
            actions={[
              {
                href: `/app/${workspace.app.id}`,
                label: "Prep board'a don"
              },
              {
                href: `/app/${workspace.app.id}/post-launch`,
                label: "Growth routine"
              },
              {
                href: "/dashboard",
                label: "Dashboard",
                variant: "primary"
              }
            ]}
            stats={[
              {
                label: "Board progress",
                value: `%${workspace.progress.overall}`,
                detail: `${workspace.progress.completedCount}/${workspace.progress.totalCount} item tamamlandi`
              },
              {
                label: "Deliverables",
                value: `${deliverableCount}`,
                detail: "Export icine dahil olabilecek cikti sayisi"
              },
              {
                label: "Formats",
                value: "2",
                detail: "PDF ve Markdown olarak indirilebilir"
              }
            ]}
            panelEyebrow="Export readiness"
            panelTitle="Board to report"
            panelDescription="Teknik state'i sade bir rapora cevirerek ekip icinde hizli paylasim, launch review ya da yatirimci update akisini kolaylastir."
            panelBody={
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                    PDF
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Polished
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                    Markdown
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Portable
                  </p>
                </div>
              </div>
            }
            panelFootnote="Share clean launch status"
          />

          <section className="grid gap-6 md:grid-cols-2">
            <ExportButton
              appId={workspace.app.id}
              format="pdf"
              label="PDF Export"
              description="Workspace adini, genel progress durumunu, checklist item tamamlanmalarini ve deliverable listesini tek bir PDF raporunda indir."
            />
            <ExportButton
              appId={workspace.app.id}
              format="markdown"
              label="Markdown Export"
              description="Ayni raporu sade ve paylasmasi kolay bir Markdown dosyasi olarak indir; ekip notlari veya yatirimci ozeti icin hizli kopyalanabilir format sun."
            />
          </section>
        </div>
      </main>
    );
  } catch {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Schema bekleniyor"
          title="Export veritabanini bekliyor."
          description="Hosted Supabase projesine migration push tamamlandiginda bu ekran gercek workspace verisiyle export alabilecek."
          actionHref={`/app/${params.id}/export`}
          actionLabel="Yeniden dene"
        />
      </main>
    );
  }
}
