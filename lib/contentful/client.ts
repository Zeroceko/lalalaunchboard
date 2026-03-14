import "server-only";

import { unstable_cache } from "next/cache";
import { createClient, type ContentfulClientApi } from "contentful";
import { z } from "zod";

import type { CmsChecklistItem, CmsRoutineTask, CmsToolLink } from "@/types";

import { getContentfulEnv, hasContentfulEnv } from "@/lib/env";
import {
  fallbackChecklistItems,
  fallbackRoutineTasks
} from "@/lib/contentful/fallback";

let client: ContentfulClientApi<undefined> | null = null;

const checklistCategorySchema = z.enum([
  "store_prep",
  "aso",
  "creative",
  "legal"
]);

const toolLinkSchema = z.object({
  label: z.string().trim().min(1),
  url: z.string().trim().url()
});

const checklistItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().default(""),
  category: checklistCategorySchema,
  guideText: z.string().trim().default(""),
  toolLinks: z.array(toolLinkSchema).default([]),
  order: z.number().int().nonnegative().default(0)
});

const routineTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().default(""),
  frequency: z.literal("weekly").default("weekly"),
  order: z.number().int().nonnegative().default(0)
});

export const CMS_CHECKLIST_TAG = "cms-checklist-items";
export const CMS_ROUTINE_TAG = "cms-routine-tasks";

type ContentSource = "contentful" | "fallback";

interface CmsCollectionResult<T> {
  items: T[];
  source: ContentSource;
}

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}

export function getContentfulClient() {
  if (client) {
    return client;
  }

  const env = getContentfulEnv();

  client = createClient({
    space: env.CONTENTFUL_SPACE_ID,
    accessToken: env.CONTENTFUL_DELIVERY_TOKEN,
    environment: env.CONTENTFUL_ENVIRONMENT
  });

  return client;
}

function normalizeToolLinks(value: unknown): CmsToolLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const parsed = toolLinkSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

function mapChecklistItem(entry: {
  sys: { id: string };
  fields: Record<string, unknown>;
}): CmsChecklistItem | null {
  const parsed = checklistItemSchema.safeParse({
    title: entry.fields.title,
    description: entry.fields.description ?? "",
    category: entry.fields.category,
    guideText: entry.fields.guideText ?? "",
    toolLinks: normalizeToolLinks(entry.fields.toolLinks),
    order: typeof entry.fields.order === "number" ? entry.fields.order : 0
  });

  if (!parsed.success) {
    return null;
  }

  return {
    id: entry.sys.id,
    ...parsed.data
  };
}

function mapRoutineTask(entry: {
  sys: { id: string };
  fields: Record<string, unknown>;
}): CmsRoutineTask | null {
  const parsed = routineTaskSchema.safeParse({
    title: entry.fields.title,
    description: entry.fields.description ?? "",
    frequency: entry.fields.frequency ?? "weekly",
    order: typeof entry.fields.order === "number" ? entry.fields.order : 0
  });

  if (!parsed.success) {
    return null;
  }

  return {
    id: entry.sys.id,
    ...parsed.data
  };
}

async function fetchChecklistItemsFromContentful() {
  const contentful = getContentfulClient();
  const response = await contentful.getEntries({
    content_type: "checklistItem",
    order: ["fields.order"],
    include: 1
  });

  return response.items
    .map((entry) =>
      mapChecklistItem(entry as { sys: { id: string }; fields: Record<string, unknown> })
    )
    .filter(isDefined)
    .sort((left, right) => left.order - right.order);
}

async function fetchRoutineTasksFromContentful() {
  const contentful = getContentfulClient();
  const response = await contentful.getEntries({
    content_type: "routineTask",
    order: ["fields.order"],
    include: 1
  });

  return response.items
    .map((entry) =>
      mapRoutineTask(entry as { sys: { id: string }; fields: Record<string, unknown> })
    )
    .filter(isDefined)
    .sort((left, right) => left.order - right.order);
}

const readChecklistItems = unstable_cache(
  async (): Promise<CmsCollectionResult<CmsChecklistItem>> => {
    if (!hasContentfulEnv()) {
      return {
        items: fallbackChecklistItems,
        source: "fallback"
      };
    }

    try {
      const items = await fetchChecklistItemsFromContentful();

      return {
        items: items.length > 0 ? items : fallbackChecklistItems,
        source: items.length > 0 ? "contentful" : "fallback"
      };
    } catch {
      return {
        items: fallbackChecklistItems,
        source: "fallback"
      };
    }
  },
  [CMS_CHECKLIST_TAG],
  {
    revalidate: 86400,
    tags: [CMS_CHECKLIST_TAG]
  }
);

const readRoutineTasks = unstable_cache(
  async (): Promise<CmsCollectionResult<CmsRoutineTask>> => {
    if (!hasContentfulEnv()) {
      return {
        items: fallbackRoutineTasks,
        source: "fallback"
      };
    }

    try {
      const items = await fetchRoutineTasksFromContentful();

      return {
        items: items.length > 0 ? items : fallbackRoutineTasks,
        source: items.length > 0 ? "contentful" : "fallback"
      };
    } catch {
      return {
        items: fallbackRoutineTasks,
        source: "fallback"
      };
    }
  },
  [CMS_ROUTINE_TAG],
  {
    revalidate: 86400,
    tags: [CMS_ROUTINE_TAG]
  }
);

export async function getChecklistItemsData() {
  return readChecklistItems();
}

export async function getRoutineTasksData() {
  return readRoutineTasks();
}

export async function getChecklistItems() {
  const data = await getChecklistItemsData();
  return data.items;
}

export async function getRoutineTasks() {
  const data = await getRoutineTasksData();
  return data.items;
}
