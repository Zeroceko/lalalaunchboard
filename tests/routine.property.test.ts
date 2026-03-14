import { describe, expect, it } from "vitest";
import fc from "fast-check";

import type { CmsRoutineTask, RoutineLog } from "@/types";

import { mergeRoutineTasksWithLogs } from "@/lib/routine/service";

const alphaNumericArbitrary = fc
  .array(
    fc.constantFrom(
      ..."abcdefghijklmnopqrstuvwxyz0123456789".split("")
    ),
    {
      minLength: 1,
      maxLength: 18
    }
  )
  .map((characters) => characters.join(""));

const sentenceArbitrary = fc
  .array(alphaNumericArbitrary, { minLength: 1, maxLength: 4 })
  .map((parts) => parts.join(" "));

const isoDateTimeArbitrary = fc
  .integer({
    min: 0,
    max: Date.UTC(2100, 11, 31)
  })
  .map((timestamp) => new Date(timestamp).toISOString());

const routineTaskArbitrary = fc.record<CmsRoutineTask>({
  id: fc.uuid(),
  title: sentenceArbitrary.map((value) => `task ${value}`),
  description: sentenceArbitrary.map((value) => `desc ${value}`),
  frequency: fc.constant("weekly"),
  order: fc.integer({ min: 0, max: 100 })
});

function createRoutineLogsArbitrary(taskIds: string[]) {
  return fc.uniqueArray(
    fc.record<RoutineLog>({
      id: fc.uuid(),
      app_id: fc.uuid(),
      cms_task_id: fc.constantFrom(...taskIds),
      week_number: fc.integer({ min: 1, max: 53 }),
      completed: fc.boolean(),
      logged_at: isoDateTimeArbitrary
    }),
    {
      minLength: 0,
      maxLength: taskIds.length,
      selector: (log) => log.cms_task_id
    }
  );
}

describe("mergeRoutineTasksWithLogs", () => {
  it("maps routine logs back to the correct CMS task without losing task order", () => {
    // Feature: pre-post-launch-os, Property 17: RoutineLog Round-Trip
    const scenarioArbitrary = fc
      .uniqueArray(routineTaskArbitrary, {
        minLength: 1,
        maxLength: 20,
        selector: (task) => task.id
      })
      .chain((tasks) =>
        fc.record({
          tasks: fc.constant(tasks),
          logs: createRoutineLogsArbitrary(tasks.map((task) => task.id))
        })
      );

    fc.assert(
      fc.property(scenarioArbitrary, ({ tasks, logs }) => {
        const merged = mergeRoutineTasksWithLogs(tasks, logs);

        expect(merged.totalCount).toBe(tasks.length);
        expect(merged.tasks.map((task) => task.id)).toEqual(
          tasks.map((task) => task.id)
        );

        merged.tasks.forEach((task) => {
          const expectedLog =
            logs.find((log) => log.cms_task_id === task.id) ?? null;
          expect(task.log).toEqual(expectedLog);
        });

        expect(merged.completedCount).toBe(
          logs.filter((log) => log.completed).length
        );
      }),
      {
        numRuns: 100
      }
    );
  });
});
