import "server-only";

import type { App, AppLimitState, User } from "@/types";

import { getChecklistItemsData, getRoutineTasksData } from "@/lib/contentful/client";
import { getCurrentWeekNumber } from "@/lib/routine/service";
import { createClient } from "@/lib/supabase/server";
import {
  getWorkspaceSnapshot,
  resolveAppErrorMessage
} from "@/lib/apps/service";
import { appMessages } from "@/lib/apps/messages";
import { getCountdownState } from "@/lib/progress";

type ServerSupabaseClient = ReturnType<typeof createClient>;

const checklistStatusSummarySelect = "app_id, completed";
const deliverableSummarySelect = "app_id";
const routineLogSummarySelect = "app_id, completed";

type PanelTone = "brand" | "success" | "warning" | "danger" | "neutral" | "clay";

export interface PortfolioBoardSummary {
  app: App;
  countdown: ReturnType<typeof getCountdownState>;
  checklistProgress: number;
  checklistCompletedCount: number;
  checklistTotalCount: number;
  deliverableCount: number;
  routineProgress: number;
  routineCompletedCount: number;
  routineTotalCount: number;
  healthLabel: string;
  healthTone: PanelTone;
  nextMove: string;
  priorityScore: number;
}

export interface PortfolioTotals {
  activeBoards: number;
  averageChecklistProgress: number;
  totalDeliverables: number;
  dueSoonCount: number;
  atRiskCount: number;
  averageRoutineProgress: number;
}

export interface PortfolioManagementSnapshot {
  profile: User | null;
  limit: AppLimitState | null;
  boards: PortfolioBoardSummary[];
  totals: PortfolioTotals;
  weekNumber: number;
  checklistSource: "contentful" | "fallback";
  routineSource: "contentful" | "fallback";
}

function toPercentage(completedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}

function buildCountMap<T extends { app_id: string }>(
  rows: T[],
  predicate?: (row: T) => boolean
) {
  const result = new Map<string, number>();

  rows.forEach((row) => {
    if (predicate && !predicate(row)) {
      return;
    }

    result.set(row.app_id, (result.get(row.app_id) ?? 0) + 1);
  });

  return result;
}

function getBoardHealth(
  countdown: ReturnType<typeof getCountdownState>,
  checklistProgress: number,
  deliverableCount: number,
  routineProgress: number
) {
  if (countdown.daysRemaining < 0) {
    return {
      label: "Post-launch",
      tone: routineProgress >= 50 ? "success" : "clay"
    } satisfies { label: string; tone: PanelTone };
  }

  if (
    (countdown.daysRemaining <= 7 && checklistProgress < 70) ||
    (countdown.daysRemaining <= 14 && checklistProgress < 50)
  ) {
    return {
      label: "Riskli",
      tone: "danger"
    } satisfies { label: string; tone: PanelTone };
  }

  if (checklistProgress >= 80 && deliverableCount >= 3) {
    return {
      label: "Hazir",
      tone: "success"
    } satisfies { label: string; tone: PanelTone };
  }

  if (checklistProgress >= 45) {
    return {
      label: "Ilerliyor",
      tone: "brand"
    } satisfies { label: string; tone: PanelTone };
  }

  return {
    label: "Kuruluyor",
    tone: "warning"
  } satisfies { label: string; tone: PanelTone };
}

function getNextMove(
  countdown: ReturnType<typeof getCountdownState>,
  checklistProgress: number,
  deliverableCount: number,
  routineProgress: number
) {
  if (countdown.daysRemaining < 0) {
    return "Post-launch rutini, haftalik kontrol ve export ozetiyle ivmeyi koru.";
  }

  if (checklistProgress < 25) {
    return "Ilk checklist bloklarini tamamlayip board'u calisan bir launch tabanina cevir.";
  }

  if (deliverableCount < 2) {
    return "Link, not ve dosya deliverable'larini toplayip item detaylarini doldur.";
  }

  if (countdown.daysRemaining <= 7 && checklistProgress < 80) {
    return "Launch oncesi acik maddeleri kapat, kritik deliverable'lari finalle ve export raporunu hazirla.";
  }

  if (routineProgress < 50) {
    return "Bu haftanin growth rutinini yakalayip post-launch ritmini simdiden kur.";
  }

  return "Checklist, routine ve export akislarini ayni board uzerinde duzenli guncel tut.";
}

function getPriorityScore(
  countdown: ReturnType<typeof getCountdownState>,
  checklistProgress: number,
  deliverableCount: number,
  routineProgress: number
) {
  let score = 100 - checklistProgress;

  if (countdown.daysRemaining < 0) {
    score += 8;
  } else if (countdown.daysRemaining <= 7) {
    score += 42;
  } else if (countdown.daysRemaining <= 14) {
    score += 26;
  } else if (countdown.daysRemaining <= 30) {
    score += 12;
  }

  if (deliverableCount === 0) {
    score += 16;
  } else if (deliverableCount < 3) {
    score += 8;
  }

  if (routineProgress < 50) {
    score += 10;
  }

  return score;
}

async function listChecklistStatusSummaries(
  supabase: ServerSupabaseClient,
  appIds: string[]
) {
  if (appIds.length === 0) {
    return [] as { app_id: string; completed: boolean }[];
  }

  const { data, error } = await supabase
    .from("checklist_item_statuses")
    .select(checklistStatusSummarySelect)
    .in("app_id", appIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as { app_id: string; completed: boolean }[];
}

async function listDeliverableSummaries(
  supabase: ServerSupabaseClient,
  appIds: string[]
) {
  if (appIds.length === 0) {
    return [] as { app_id: string }[];
  }

  const { data, error } = await supabase
    .from("deliverables")
    .select(deliverableSummarySelect)
    .in("app_id", appIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as { app_id: string }[];
}

async function listRoutineLogSummaries(
  supabase: ServerSupabaseClient,
  appIds: string[],
  weekNumber: number
) {
  if (appIds.length === 0) {
    return [] as { app_id: string; completed: boolean }[];
  }

  const { data, error } = await supabase
    .from("routine_logs")
    .select(routineLogSummarySelect)
    .in("app_id", appIds)
    .eq("week_number", weekNumber);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as { app_id: string; completed: boolean }[];
}

export function resolvePortfolioErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message.includes('relation "public.checklist_item_statuses" does not exist') ||
      error.message.includes('relation "public.deliverables" does not exist') ||
      error.message.includes('relation "public.routine_logs" does not exist'))
  ) {
    return appMessages.schemaUnavailable;
  }

  return resolveAppErrorMessage(error);
}

export async function getPortfolioManagementSnapshot(
  supabase: ServerSupabaseClient,
  userId: string
): Promise<PortfolioManagementSnapshot> {
  const baseSnapshot = await getWorkspaceSnapshot(supabase, userId);
  const weekNumber = getCurrentWeekNumber();

  if (!baseSnapshot.profile || !baseSnapshot.limit) {
    return {
      profile: baseSnapshot.profile,
      limit: baseSnapshot.limit,
      boards: [],
      totals: {
        activeBoards: 0,
        averageChecklistProgress: 0,
        totalDeliverables: 0,
        dueSoonCount: 0,
        atRiskCount: 0,
        averageRoutineProgress: 0
      },
      weekNumber,
      checklistSource: "fallback",
      routineSource: "fallback"
    };
  }

  const appIds = baseSnapshot.apps.map((app) => app.id);
  const [
    { items: checklistItems, source: checklistSource },
    { items: routineTasks, source: routineSource },
    checklistStatuses,
    deliverables,
    routineLogs
  ] = await Promise.all([
    getChecklistItemsData(),
    getRoutineTasksData(),
    listChecklistStatusSummaries(supabase, appIds),
    listDeliverableSummaries(supabase, appIds),
    listRoutineLogSummaries(supabase, appIds, weekNumber)
  ]);

  const checklistCompletedByApp = buildCountMap(
    checklistStatuses,
    (status) => status.completed
  );
  const deliverableCountByApp = buildCountMap(deliverables);
  const routineCompletedByApp = buildCountMap(
    routineLogs,
    (log) => log.completed
  );

  const checklistTotalCount = checklistItems.length;
  const routineTotalCount = routineTasks.length;

  const boards = baseSnapshot.apps
    .map((app) => {
      const countdown = getCountdownState(app.launch_date);
      const checklistCompletedCount = checklistCompletedByApp.get(app.id) ?? 0;
      const deliverableCount = deliverableCountByApp.get(app.id) ?? 0;
      const routineCompletedCount = routineCompletedByApp.get(app.id) ?? 0;
      const checklistProgress = toPercentage(
        checklistCompletedCount,
        checklistTotalCount
      );
      const routineProgress = toPercentage(
        routineCompletedCount,
        routineTotalCount
      );
      const health = getBoardHealth(
        countdown,
        checklistProgress,
        deliverableCount,
        routineProgress
      );

      return {
        app,
        countdown,
        checklistProgress,
        checklistCompletedCount,
        checklistTotalCount,
        deliverableCount,
        routineProgress,
        routineCompletedCount,
        routineTotalCount,
        healthLabel: health.label,
        healthTone: health.tone,
        nextMove: getNextMove(
          countdown,
          checklistProgress,
          deliverableCount,
          routineProgress
        ),
        priorityScore: getPriorityScore(
          countdown,
          checklistProgress,
          deliverableCount,
          routineProgress
        )
      } satisfies PortfolioBoardSummary;
    })
    .sort((left, right) => {
      if (right.priorityScore !== left.priorityScore) {
        return right.priorityScore - left.priorityScore;
      }

      return left.countdown.daysRemaining - right.countdown.daysRemaining;
    });

  const totals = {
    activeBoards: boards.length,
    averageChecklistProgress:
      boards.length === 0
        ? 0
        : Math.round(
            boards.reduce((sum, board) => sum + board.checklistProgress, 0) /
              boards.length
          ),
    totalDeliverables: boards.reduce(
      (sum, board) => sum + board.deliverableCount,
      0
    ),
    dueSoonCount: boards.filter(
      (board) =>
        board.countdown.daysRemaining >= 0 && board.countdown.daysRemaining <= 14
    ).length,
    atRiskCount: boards.filter((board) => board.healthTone === "danger").length,
    averageRoutineProgress:
      boards.length === 0
        ? 0
        : Math.round(
            boards.reduce((sum, board) => sum + board.routineProgress, 0) /
              boards.length
          )
  } satisfies PortfolioTotals;

  return {
    profile: baseSnapshot.profile,
    limit: baseSnapshot.limit,
    boards,
    totals,
    weekNumber,
    checklistSource,
    routineSource
  };
}
