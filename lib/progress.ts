import type {
  ChecklistCategory,
  ChecklistItemStatus,
  ChecklistItemWithStatus,
  CmsChecklistItem,
  WorkspaceProgress
} from "@/types";

export const checklistCategoryOrder: ChecklistCategory[] = [
  "store_prep",
  "aso",
  "creative",
  "legal"
];

export const checklistCategoryLabels: Record<ChecklistCategory, string> = {
  store_prep: "Store Prep",
  aso: "ASO",
  creative: "Creative",
  legal: "Legal"
};

function toPercentage(completedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}

export function calculateProgress(
  items: CmsChecklistItem[],
  statuses: Pick<ChecklistItemStatus, "cms_item_id" | "completed">[]
): WorkspaceProgress {
  const completedIds = new Set(
    statuses.filter((status) => status.completed).map((status) => status.cms_item_id)
  );

  const completedCount = items.filter((item) => completedIds.has(item.id)).length;

  const byCategory = checklistCategoryOrder.reduce<
    Record<ChecklistCategory, number>
  >((accumulator, category) => {
    const categoryItems = items.filter((item) => item.category === category);
    const categoryCompletedCount = categoryItems.filter((item) =>
      completedIds.has(item.id)
    ).length;

    accumulator[category] = toPercentage(
      categoryCompletedCount,
      categoryItems.length
    );

    return accumulator;
  }, {
    store_prep: 0,
    aso: 0,
    creative: 0,
    legal: 0
  });

  return {
    overall: toPercentage(completedCount, items.length),
    byCategory,
    completedCount,
    totalCount: items.length
  };
}

export function groupChecklistItems(items: ChecklistItemWithStatus[]) {
  return checklistCategoryOrder.map((category) => {
    const categoryItems = items.filter((item) => item.category === category);
    const completedCount = categoryItems.filter(
      (item) => item.status?.completed
    ).length;

    return {
      category,
      label: checklistCategoryLabels[category],
      items: categoryItems,
      completedCount,
      totalCount: categoryItems.length,
      progress: toPercentage(completedCount, categoryItems.length)
    };
  });
}

export function calculateProgressFromItems(items: ChecklistItemWithStatus[]) {
  const cmsItems: CmsChecklistItem[] = items.map(
    ({ status: _status, deliverables: _deliverables, ...item }) => item
  );
  const statuses = items
    .filter((item) => item.status)
    .map((item) => ({
      cms_item_id: item.id,
      completed: item.status?.completed ?? false
    }));

  return calculateProgress(cmsItems, statuses);
}

export function getNextCriticalItem(items: ChecklistItemWithStatus[]) {
  return [...items]
    .filter((item) => !item.status?.completed)
    .sort((left, right) => {
      const categoryDifference =
        checklistCategoryOrder.indexOf(left.category) -
        checklistCategoryOrder.indexOf(right.category);

      if (categoryDifference !== 0) {
        return categoryDifference;
      }

      return left.order - right.order;
    })[0] ?? null;
}

export function getCountdownState(launchDate: string) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const launchUtc = Date.parse(`${launchDate}T00:00:00.000Z`);
  const daysRemaining = Math.ceil((launchUtc - todayUtc) / millisecondsPerDay);

  if (daysRemaining < 0) {
    return {
      daysRemaining,
      label: "Lansman tarihi geçti",
      tone: "danger" as const
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining,
      label: "Lansman günü",
      tone: "accent" as const
    };
  }

  if (daysRemaining <= 7) {
    return {
      daysRemaining,
      label: `${daysRemaining} gün kaldı`,
      tone: "warning" as const
    };
  }

  return {
    daysRemaining,
    label: `${daysRemaining} gün kaldı`,
    tone: "default" as const
  };
}
