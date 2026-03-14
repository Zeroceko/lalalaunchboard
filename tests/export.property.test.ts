import { describe, expect, it } from "vitest";
import fc from "fast-check";

import type {
  App,
  ChecklistCategory,
  ChecklistItemStatus,
  ChecklistWorkspace,
  CmsChecklistItem,
  Deliverable,
  DeliverableType,
  Platform
} from "@/types";

import { formatLaunchDate, formatPlatformLabel } from "@/lib/apps/service";
import { mergeChecklistState } from "@/lib/checklist/service";
import { buildExportFileName, buildMarkdownExport } from "@/lib/export";
import { checklistCategoryLabels, checklistCategoryOrder } from "@/lib/progress";

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

const launchDateArbitrary = fc
  .integer({
    min: Date.UTC(2020, 0, 1),
    max: Date.UTC(2100, 11, 31)
  })
  .map((timestamp) => new Date(timestamp).toISOString().slice(0, 10));

const categoryArbitrary = fc.constantFrom<ChecklistCategory>(
  ...checklistCategoryOrder
);

const platformArbitrary = fc.constantFrom<Platform>("ios", "android", "web");

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
  .map(([host, path]) => `https://${host}.example.com/${path}`);

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
        file_size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
        created_at: isoDateTimeArbitrary
      })
    ),
    {
      minLength: 0,
      maxLength: 25
    }
  );
}

function formatDeliverableLine(deliverable: Deliverable) {
  if (deliverable.type === "file") {
    const label = deliverable.file_name || "Dosya";
    return `${label}${deliverable.file_size ? ` (${deliverable.file_size} bayt)` : ""}`;
  }

  return deliverable.content;
}

describe("buildExportFileName", () => {
  it("creates slugged filenames for both export formats", () => {
    // Feature: pre-post-launch-os, Property 19: Export dosya adi formati
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 80 }),
        fc.constantFrom<"pdf" | "markdown">("pdf", "markdown"),
        (appName, format) => {
          const fileName = buildExportFileName(appName, format);
          const extension = format === "pdf" ? ".pdf" : ".md";

          expect(fileName.endsWith(extension)).toBe(true);
          expect(fileName.includes("-pre-launch-raporu")).toBe(true);

          const slug = fileName
            .replace("-pre-launch-raporu", "")
            .replace(extension, "");

          expect(slug.length).toBeGreaterThan(0);
          expect(slug).toMatch(/^[a-z0-9-]+$/);
          expect(slug.startsWith("-")).toBe(false);
          expect(slug.endsWith("-")).toBe(false);
        }
      ),
      {
        numRuns: 100
      }
    );
  });
});

describe("buildMarkdownExport", () => {
  it("keeps app summary, checklist items, and deliverables aligned in the report", () => {
    // Feature: pre-post-launch-os, Property 18: Export Icerik Butunlugu
    const appArbitrary = fc.record<App>({
      id: fc.uuid(),
      user_id: fc.uuid(),
      name: sentenceArbitrary.map((value) => `workspace ${value}`),
      platform: platformArbitrary,
      launch_date: launchDateArbitrary,
      created_at: isoDateTimeArbitrary,
      updated_at: fc.option(isoDateTimeArbitrary, {
        nil: undefined
      })
    });

    const workspaceArbitrary = fc
      .uniqueArray(checklistItemArbitrary, {
        minLength: 1,
        maxLength: 16,
        selector: (item) => item.id
      })
      .chain((cmsItems) =>
        fc.record({
          app: appArbitrary,
          cmsItems: fc.constant(cmsItems),
          statuses: createChecklistStatusArbitrary(
            cmsItems.map((item) => item.id)
          ),
          deliverables: createDeliverableArbitrary(
            cmsItems.map((item) => item.id)
          )
        })
      );

    fc.assert(
      fc.property(
        workspaceArbitrary,
        ({ app, cmsItems, statuses, deliverables }) => {
          const merged = mergeChecklistState(cmsItems, statuses, deliverables);
          const workspace: ChecklistWorkspace = {
            app,
            items: merged.items,
            progress: merged.progress,
            contentSource: "fallback"
          };
          const markdown = buildMarkdownExport(workspace);

          expect(markdown).toContain(`# ${app.name} Pre-Launch Raporu`);
          expect(markdown).toContain(
            `- Platform: ${formatPlatformLabel(app.platform)}`
          );
          expect(markdown).toContain(
            `- Lansman Tarihi: ${formatLaunchDate(app.launch_date)}`
          );
          expect(markdown).toContain(
            `- Genel Ilerleme: %${workspace.progress.overall}`
          );
          expect(markdown).toContain(
            `- Tamamlanan Item: ${workspace.progress.completedCount}/${workspace.progress.totalCount}`
          );

          checklistCategoryOrder.forEach((category) => {
            const categoryItems = workspace.items.filter(
              (item) => item.category === category
            );

            if (categoryItems.length === 0) {
              return;
            }

            const completedCount = categoryItems.filter(
              (item) => item.status?.completed
            ).length;
            const categoryProgress =
              categoryItems.length === 0
                ? 0
                : Math.round((completedCount / categoryItems.length) * 100);

            expect(markdown).toContain(
              `### ${checklistCategoryLabels[category]} (%${categoryProgress})`
            );
          });

          workspace.items.forEach((item) => {
            expect(markdown).toContain(
              `- [${item.status?.completed ? "x" : " "}] ${item.title}`
            );
            expect(markdown).toContain(`  - Aciklama: ${item.description}`);

            item.deliverables.forEach((deliverable) => {
              expect(markdown).toContain(
                `    - ${deliverable.type.toUpperCase()}: ${formatDeliverableLine(deliverable)}`
              );
            });
          });
        }
      ),
      {
        numRuns: 100
      }
    );
  });
});
