import type { Deliverable, ExportFormat, ChecklistWorkspace } from "@/types";

import {
  formatLaunchDate,
  formatPlatformLabel
} from "@/lib/apps/service";
import {
  checklistCategoryLabels,
  groupChecklistItems
} from "@/lib/progress";

const slugReplacements: Record<string, string> = {
  İ: "I",
  ı: "i",
  Ş: "S",
  ş: "s",
  Ğ: "G",
  ğ: "g",
  Ü: "U",
  ü: "u",
  Ö: "O",
  ö: "o",
  Ç: "C",
  ç: "c"
};

function slugifyAppName(name: string) {
  const replaced = Array.from(name)
    .map((char) => slugReplacements[char] ?? char)
    .join("");

  const slug = replaced
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "workspace";
}

export function buildExportFileName(appName: string, format: ExportFormat) {
  const extension = format === "markdown" ? "md" : "pdf";
  return `${slugifyAppName(appName)}-pre-launch-raporu.${extension}`;
}

function formatDeliverable(deliverable: Deliverable) {
  if (deliverable.type === "file") {
    const label = deliverable.file_name || "Dosya";
    return `${label}${deliverable.file_size ? ` (${deliverable.file_size} bayt)` : ""}`;
  }

  return deliverable.content;
}

export function buildMarkdownExport(workspace: ChecklistWorkspace) {
  if (!workspace.app) {
    return "";
  }

  const groupedItems = groupChecklistItems(workspace.items);
  const lines = [
    `# ${workspace.app.name} Pre-Launch Raporu`,
    "",
    `- Platform: ${formatPlatformLabel(workspace.app.platform)}`,
    `- Lansman Tarihi: ${formatLaunchDate(workspace.app.launch_date)}`,
    `- Genel Ilerleme: %${workspace.progress.overall}`,
    `- Tamamlanan Item: ${workspace.progress.completedCount}/${workspace.progress.totalCount}`,
    "",
    "## Checklist"
  ];

  groupedItems.forEach((group) => {
    lines.push("");
    lines.push(
      `### ${checklistCategoryLabels[group.category]} (%${group.progress})`
    );

    group.items.forEach((item) => {
      lines.push(
        `- [${item.status?.completed ? "x" : " "}] ${item.title}`
      );
      lines.push(`  - Aciklama: ${item.description}`);

      if (item.deliverables.length > 0) {
        lines.push("  - Deliverables:");
        item.deliverables.forEach((deliverable) => {
          lines.push(
            `    - ${deliverable.type.toUpperCase()}: ${formatDeliverable(deliverable)}`
          );
        });
      }
    });
  });

  return `${lines.join("\n")}\n`;
}
