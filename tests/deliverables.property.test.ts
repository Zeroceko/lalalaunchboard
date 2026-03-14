import { describe, expect, it } from "vitest";
import fc from "fast-check";

import type {
  ChecklistCategory,
  ChecklistItemStatus,
  CmsChecklistItem,
  Deliverable,
  DeliverableType
} from "@/types";

import { mergeChecklistState } from "@/lib/checklist/service";
import { deliverableMessages } from "@/lib/deliverables/messages";
import {
  deliverableFileMetadataSchema,
  deliverableJsonSchema,
  getMaxDeliverableFileSize
} from "@/lib/deliverables/validation";
import { checklistCategoryOrder } from "@/lib/progress";

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

const categoryArbitrary = fc.constantFrom<ChecklistCategory>(
  ...checklistCategoryOrder
);

const checklistItemArbitrary = fc.record<CmsChecklistItem>({
  id: fc.uuid(),
  title: sentenceArbitrary.map((value) => `item ${value}`),
  description: sentenceArbitrary.map((value) => `desc ${value}`),
  category: categoryArbitrary,
  guideText: sentenceArbitrary.map((value) => `guide ${value}`),
  toolLinks: fc.constant([]),
  order: fc.integer({ min: 0, max: 100 })
});

const validLinkArbitrary = fc
  .tuple(alphaNumericArbitrary, alphaNumericArbitrary)
  .map(
    ([host, path]) =>
      `https://${host}.example.com/${path}`
  );

const invalidLinkArbitrary = fc
  .tuple(alphaNumericArbitrary, alphaNumericArbitrary)
  .map(([host, path]) => `${host}.example.com/${path}`);

function createChecklistStatusArbitrary(itemIds: string[]) {
  return fc.uniqueArray(
    fc.record<ChecklistItemStatus>({
      id: fc.uuid(),
      app_id: fc.uuid(),
      cms_item_id: fc.constantFrom(...itemIds),
      completed: fc.boolean(),
      completed_at: fc.option(isoDateTimeArbitrary, {
        nil: null
      }),
      updated_at: isoDateTimeArbitrary
    }),
    {
      minLength: 0,
      maxLength: itemIds.length,
      selector: (status) => status.cms_item_id
    }
  );
}

function createDeliverableArbitrary(itemIds: string[]) {
  return fc.array(
    fc.oneof(
      fc.record<Deliverable>({
        id: fc.uuid(),
        app_id: fc.uuid(),
        cms_item_id: fc.constantFrom(...itemIds),
        type: fc.constant<DeliverableType>("link"),
        content: validLinkArbitrary,
        file_name: fc.constant(undefined),
        file_size: fc.constant(undefined),
        created_at: isoDateTimeArbitrary
      }),
      fc.record<Deliverable>({
        id: fc.uuid(),
        app_id: fc.uuid(),
        cms_item_id: fc.constantFrom(...itemIds),
        type: fc.constant<DeliverableType>("note"),
        content: sentenceArbitrary.map((value) => `note ${value}`),
        file_name: fc.constant(undefined),
        file_size: fc.constant(undefined),
        created_at: isoDateTimeArbitrary
      }),
      fc.record<Deliverable>({
        id: fc.uuid(),
        app_id: fc.uuid(),
        cms_item_id: fc.constantFrom(...itemIds),
        type: fc.constant<DeliverableType>("file"),
        content: sentenceArbitrary.map((value) => `uploads/${value}.png`),
        file_name: sentenceArbitrary.map((value) => `${value}.png`),
        file_size: fc.integer({
          min: 1,
          max: getMaxDeliverableFileSize()
        }),
        created_at: isoDateTimeArbitrary
      })
    ),
    {
      minLength: 0,
      maxLength: 25
    }
  );
}

describe("deliverables", () => {
  it("accepts valid links and rejects malformed ones", () => {
    // Feature: pre-post-launch-os, Property 14: URL Dogrulamasi
    fc.assert(
      fc.property(
        fc.oneof(
          validLinkArbitrary.map((value) => ({
            value,
            shouldPass: true
          })),
          invalidLinkArbitrary.map((value) => ({
            value,
            shouldPass: false
          }))
        ),
        ({ value, shouldPass }) => {
          const result = deliverableJsonSchema.safeParse({
            type: "link",
            content: value
          });

          expect(result.success).toBe(shouldPass);

          if (result.success) {
            expect(result.data.content).toBe(value);
          } else {
            expect(result.error.flatten().fieldErrors.content).toContain(
              deliverableMessages.invalidUrl
            );
          }
        }
      ),
      {
        numRuns: 100
      }
    );
  });

  it("enforces the 10 MB file-size boundary", () => {
    // Feature: pre-post-launch-os, Property 15: Dosya Boyutu Siniri
    const maxFileSize = getMaxDeliverableFileSize();

    fc.assert(
      fc.property(
        fc.integer({
          min: 0,
          max: maxFileSize * 2
        }),
        (fileSize) => {
          const result = deliverableFileMetadataSchema.safeParse({
            type: "file",
            fileName: "asset.png",
            fileSize
          });

          if (fileSize >= 1 && fileSize <= maxFileSize) {
            expect(result.success).toBe(true);
            if (result.success) {
              expect(result.data.fileSize).toBe(fileSize);
            }
            return;
          }

          expect(result.success).toBe(false);

          if (!result.success) {
            const message = result.error.flatten().fieldErrors.fileSize?.[0];
            expect(message).toBe(
              fileSize < 1
                ? deliverableMessages.fileRequired
                : deliverableMessages.fileTooLarge
            );
          }
        }
      ),
      {
        numRuns: 100
      }
    );
  });

  it("preserves deliverables under the correct checklist item after merge", () => {
    // Feature: pre-post-launch-os, Property 13: Deliverable Round-Trip
    const scenarioArbitrary = fc
      .uniqueArray(checklistItemArbitrary, {
        minLength: 1,
        maxLength: 20,
        selector: (item) => item.id
      })
      .chain((items) =>
        fc.record({
          items: fc.constant(items),
          statuses: createChecklistStatusArbitrary(
            items.map((item) => item.id)
          ),
          deliverables: createDeliverableArbitrary(
            items.map((item) => item.id)
          )
        })
      );

    fc.assert(
      fc.property(scenarioArbitrary, ({ items, statuses, deliverables }) => {
        const merged = mergeChecklistState(items, statuses, deliverables);

        expect(merged.items).toHaveLength(items.length);
        expect(merged.progress.totalCount).toBe(items.length);

        merged.items.forEach((item) => {
          const expectedStatus =
            statuses.find((status) => status.cms_item_id === item.id) ?? null;
          const expectedDeliverables = deliverables.filter(
            (deliverable) => deliverable.cms_item_id === item.id
          );

          expect(item.status).toEqual(expectedStatus);
          expect(item.deliverables).toEqual(expectedDeliverables);
        });

        expect(
          merged.items.flatMap((item) =>
            deliverables.filter((deliverable) => deliverable.cms_item_id === item.id)
          )
        ).toEqual(merged.items.flatMap((item) => item.deliverables));
      }),
      {
        numRuns: 100
      }
    );
  });
});
