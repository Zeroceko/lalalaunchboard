import "server-only";

import type {
  RoutineLog,
  CmsRoutineTask,
  RoutineTaskWithLog,
  RoutineWorkspace
} from "@/types";

import { getAppByIdForUser } from "@/lib/apps/service";
import { getRoutineTasksData } from "@/lib/contentful/client";
import { routineMessages } from "@/lib/routine/messages";
import { createClient } from "@/lib/supabase/server";
import type { RoutineLogInput } from "@/lib/routine/validation";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const routineLogSelect =
  "id, app_id, cms_task_id, week_number, completed, logged_at";

export function getCurrentWeekNumber(referenceDate = new Date()) {
  const utcDate = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    )
  );
  const day = utcDate.getUTCDay() || 7;

  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function normalizeWeekNumber(value?: string | number | null) {
  const week =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isInteger(week) || week < 1 || week > 53) {
    return getCurrentWeekNumber();
  }

  return week;
}

export function resolveRoutineErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message.includes('relation "public.routine_logs" does not exist') ||
      error.message.includes('relation "public.apps" does not exist'))
  ) {
    return routineMessages.schemaUnavailable;
  }

  return routineMessages.genericError;
}

export async function listRoutineLogsForWeek(
  supabase: ServerSupabaseClient,
  appId: string,
  weekNumber: number
) {
  const { data, error } = await supabase
    .from("routine_logs")
    .select(routineLogSelect)
    .eq("app_id", appId)
    .eq("week_number", weekNumber)
    .order("logged_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RoutineLog[];
}

export function mergeRoutineTasksWithLogs(
  cmsTasks: CmsRoutineTask[],
  logs: RoutineLog[]
): {
  tasks: RoutineTaskWithLog[];
  completedCount: number;
  totalCount: number;
} {
  const logByTaskId = new Map(
    logs.map((log) => [log.cms_task_id, log] as const)
  );

  const tasks: RoutineTaskWithLog[] = cmsTasks.map((task) => ({
    ...task,
    log: logByTaskId.get(task.id) ?? null
  }));

  const completedCount = tasks.filter((task) => task.log?.completed).length;

  return {
    tasks,
    completedCount,
    totalCount: tasks.length
  };
}

export async function getRoutineWorkspace(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  weekNumber: number
): Promise<RoutineWorkspace> {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return {
      app: null,
      tasks: [],
      weekNumber,
      completedCount: 0,
      totalCount: 0,
      contentSource: "fallback"
    };
  }

  const [{ items: cmsTasks, source }, logs] = await Promise.all([
    getRoutineTasksData(),
    listRoutineLogsForWeek(supabase, appId, weekNumber)
  ]);
  const merged = mergeRoutineTasksWithLogs(cmsTasks, logs);

  return {
    app,
    tasks: merged.tasks,
    weekNumber,
    completedCount: merged.completedCount,
    totalCount: merged.totalCount,
    contentSource: source
  };
}

export async function upsertRoutineLogForUser(
  supabase: ServerSupabaseClient,
  userId: string,
  appId: string,
  input: RoutineLogInput
) {
  const app = await getAppByIdForUser(supabase, userId, appId);

  if (!app) {
    return null;
  }

  const { data, error } = await supabase
    .from("routine_logs")
    .upsert(
      {
        app_id: appId,
        cms_task_id: input.taskId,
        week_number: input.weekNumber,
        completed: input.completed
      },
      {
        onConflict: "app_id,cms_task_id,week_number"
      }
    )
    .select(routineLogSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as RoutineLog;
}
