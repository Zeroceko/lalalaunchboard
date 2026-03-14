import "server-only";

import type {
  ChecklistWorkspace,
  ChecklistItemStatus,
  ChecklistItemWithStatus,
  CmsChecklistItem,
  Deliverable,
  WorkspaceProgress
} from "@/types";

import { getAppByIdForUser } from "@/lib/apps/service";
import { checklistMessages } from "@/lib/checklist/messages";
import { getChecklistItemsData } from "@/lib/contentful/client";
import { calculateProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";
import type { ChecklistStatusInput } from "@/lib/checklist/validation";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const checklistStatusSelect =
  "id, app_id, cms_item_id, completed, completed_at, updated_at";
const deliverableSelect =
  "id, app_id, cms_item_id, type, content, file_name, file_size, created_at";

export function resolveChecklistErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message.includes('relation "public.checklist_item_statuses" does not exist') ||
      error.message.includes('relation "public.deliverables" does not exist') ||
      error.message.includes('relation "public.apps" does not exist'))
  ) {
    return checklistMessages.schemaUnavailable;
  }

  return checklistMessages.genericError;
}

async function listChecklistStatusesForApp(
  supabase: ServerSupabaseClient,
  appId: string
) {
  const { data, error } = await supabase
    .from("checklist_item_statuses")
    .select(checklistStatusSelect)
    .eq("app_id", appId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ChecklistItemStatus[];
}

async function listDeliverablesForApp(
  supabase: ServerSupabaseClient,
  appId: string
) {
  const { data, error } = await supabase
    .from("deliverables")
    .select(deliverableSelect)
    .eq("app_id", appId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Deliverable[];
}

export function mergeChecklistState(
  cmsItems: CmsChecklistItem[],
  statuses: ChecklistItemStatus[],
  deliverables: Deliverable[]
): {
  items: ChecklistItemWithStatus[];
  progress: WorkspaceProgress;
} {
  const statusByItemId = new Map(
    statuses.map((status) => [status.cms_item_id, status] as const)
  );
  const deliverablesByItemId = new Map<string, Deliverable[]>();

  deliverables.forEach((deliverable) => {
    const current = deliverablesByItemId.get(deliverable.cms_item_id) ?? [];
    current.push(deliverable);
    deliverablesByItemId.set(deliverable.cms_item_id, current);
  });

  const items = cmsItems.map((item) => ({
    ...item,
    status: statusByItemId.get(item.id) ?? null,
    deliverables: deliverablesByItemId.get(item.id) ?? []
  }));

  return {
    items,
    progress: calculateProgress(cmsItems, statuses)
  };
}

export async function getChecklistWorkspace(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string
): Promise<ChecklistWorkspace> {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return {
      app: null,
      items: [] as ChecklistItemWithStatus[],
      progress: calculateProgress([], []),
      contentSource: "fallback" as const
    };
  }

  const [{ items: cmsItems, source }, statuses, deliverables] = await Promise.all([
    getChecklistItemsData(),
    listChecklistStatusesForApp(supabase, appId),
    listDeliverablesForApp(supabase, appId)
  ]);
  const merged = mergeChecklistState(cmsItems, statuses, deliverables);

  return {
    app,
    items: merged.items,
    progress: merged.progress,
    contentSource: source
  };
}

export async function updateChecklistItemStatus(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  itemId: string,
  input: ChecklistStatusInput
) {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return null;
  }

  const { data, error } = await supabase
    .from("checklist_item_statuses")
    .upsert(
      {
        app_id: appId,
        cms_item_id: itemId,
        completed: input.completed
      },
      {
        onConflict: "app_id,cms_item_id"
      }
    )
    .select(checklistStatusSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ChecklistItemStatus;
}
