import { describe, expect, it } from "vitest";
import fc from "fast-check";

import type { ChecklistCategory, CmsChecklistItem } from "@/types";

import { calculateProgress, checklistCategoryOrder } from "@/lib/progress";

const categoryArbitrary = fc.constantFrom<ChecklistCategory>(
  ...checklistCategoryOrder
);

const checklistItemArbitrary = fc.record<CmsChecklistItem>({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 30 }),
  description: fc.string({ maxLength: 50 }),
  category: categoryArbitrary,
  guideText: fc.string({ maxLength: 80 }),
  toolLinks: fc.constant([]),
  order: fc.integer({ min: 0, max: 100 })
});

describe("calculateProgress", () => {
  it("matches rounded completion ratios overall and per category", () => {
    // Feature: pre-post-launch-os, Property 12: Progress hesaplama dogrulugu
    const scenarioArbitrary = fc
      .uniqueArray(checklistItemArbitrary, {
        minLength: 1,
        maxLength: 20,
        selector: (item) => item.id
      })
      .chain((items) =>
        fc.record({
          items: fc.constant(items),
          completedIds: fc.subarray(
            items.map((item) => item.id),
            {
              minLength: 0,
              maxLength: items.length
            }
          )
        })
      );

    fc.assert(
      fc.property(scenarioArbitrary, ({ items, completedIds }) => {
        const completedSet = new Set(completedIds);
        const statuses = items.map((item) => ({
          cms_item_id: item.id,
          completed: completedSet.has(item.id)
        }));

        const progress = calculateProgress(items, statuses);
        const expectedCompletedCount = items.filter((item) =>
          completedSet.has(item.id)
        ).length;
        const expectedOverall = Math.round(
          (expectedCompletedCount / items.length) * 100
        );

        expect(progress.completedCount).toBe(expectedCompletedCount);
        expect(progress.totalCount).toBe(items.length);
        expect(progress.overall).toBe(expectedOverall);

        checklistCategoryOrder.forEach((category) => {
          const categoryItems = items.filter((item) => item.category === category);
          const categoryCompleted = categoryItems.filter((item) =>
            completedSet.has(item.id)
          ).length;
          const expectedCategoryProgress =
            categoryItems.length === 0
              ? 0
              : Math.round((categoryCompleted / categoryItems.length) * 100);

          expect(progress.byCategory[category]).toBe(expectedCategoryProgress);
        });
      }),
      {
        numRuns: 100
      }
    );
  });
});
