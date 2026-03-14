import "server-only";

import { randomUUID } from "crypto";

import type { Deliverable } from "@/types";

import { getAppByIdForUser } from "@/lib/apps/service";
import { deliverableMessages } from "@/lib/deliverables/messages";
import { createClient } from "@/lib/supabase/server";
import type { DeliverableJsonInput } from "@/lib/deliverables/validation";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const deliverableSelect =
  "id, app_id, cms_item_id, type, content, file_name, file_size, created_at";
export const deliverablesBucket = "deliverables";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

export function resolveDeliverableErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message.includes('relation "public.deliverables" does not exist') ||
      error.message.includes('relation "public.apps" does not exist'))
  ) {
    return deliverableMessages.schemaUnavailable;
  }

  if (
    error instanceof Error &&
    (error.message.includes("Bucket not found") ||
      error.message.includes("The resource was not found"))
  ) {
    return deliverableMessages.fileUploadUnavailable;
  }

  return deliverableMessages.genericError;
}

export async function listDeliverablesForItem(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  itemId: string
) {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return null;
  }

  const { data, error } = await supabase
    .from("deliverables")
    .select(deliverableSelect)
    .eq("app_id", appId)
    .eq("cms_item_id", itemId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Deliverable[];
}

export async function createTextDeliverable(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  itemId: string,
  input: DeliverableJsonInput
) {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return null;
  }

  const { data, error } = await supabase
    .from("deliverables")
    .insert({
      app_id: appId,
      cms_item_id: itemId,
      type: input.type,
      content: input.content
    })
    .select(deliverableSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Deliverable;
}

export async function createFileDeliverable(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  itemId: string,
  file: File
) {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return null;
  }

  const safeName = sanitizeFileName(file.name);
  const path = `${userId}/${appId}/${itemId}/${randomUUID()}-${safeName}`;

  const upload = await supabase.storage
    .from(deliverablesBucket)
    .upload(path, file, {
      upsert: false
    });

  if (upload.error) {
    throw new Error(upload.error.message);
  }

  const { data, error } = await supabase
    .from("deliverables")
    .insert({
      app_id: appId,
      cms_item_id: itemId,
      type: "file",
      content: path,
      file_name: file.name,
      file_size: file.size
    })
    .select(deliverableSelect)
    .single();

  if (error) {
    await supabase.storage.from(deliverablesBucket).remove([path]);
    throw new Error(error.message);
  }

  return data as Deliverable;
}

export async function deleteDeliverableForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  deliverableId: string
) {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return null;
  }

  const { data: deliverable, error: lookupError } = await supabase
    .from("deliverables")
    .select(deliverableSelect)
    .eq("id", deliverableId)
    .eq("app_id", appId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (!deliverable) {
    return null;
  }

  const { error } = await supabase
    .from("deliverables")
    .delete()
    .eq("id", deliverableId)
    .eq("app_id", appId);

  if (error) {
    throw new Error(error.message);
  }

  if (deliverable.type === "file") {
    const remove = await supabase.storage
      .from(deliverablesBucket)
      .remove([deliverable.content]);

    if (remove.error) {
      throw new Error(remove.error.message);
    }
  }

  return deliverable as Deliverable;
}
