import Link from "next/link";

import { ChecklistWorkspaceClient } from "@/components/checklist/ChecklistWorkspaceClient";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { requireSessionContext } from "@/lib/auth/session";
import { getChecklistWorkspace } from "@/lib/checklist/service";

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

        <ChecklistWorkspaceClient
          app={app}
          initialItems={workspace.items}
          contentSource={workspace.contentSource}
        />
      </main>
    );
  } catch {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <WorkspaceNotice
          eyebrow="Schema bekleniyor"
          title="Checklist workspace veritabanini bekliyor."
          description="Hosted Supabase projesine migration push tamamlandiginda bu ekran gercek checklist verisiyle calisacak."
          actionHref={`/app/${params.id}`}
          actionLabel="Yeniden dene"
        />
      </main>
    );
  }
}
