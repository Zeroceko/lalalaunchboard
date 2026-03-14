import {
  Document,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";

import type { ChecklistWorkspace } from "@/types";

import {
  formatLaunchDate,
  formatPlatformLabel
} from "@/lib/apps/service";
import { groupChecklistItems } from "@/lib/progress";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 11,
    color: "#0f172a",
    lineHeight: 1.5
  },
  header: {
    marginBottom: 20
  },
  eyebrow: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#9a3412",
    marginBottom: 6
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6
  },
  subtitle: {
    color: "#475569"
  },
  metaGrid: {
    flexDirection: "row",
    marginTop: 16
  },
  metaCard: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginRight: 10
  },
  metaLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#64748b",
    marginBottom: 6
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 700
  },
  section: {
    marginTop: 18
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10
  },
  categoryCard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4
  },
  categoryMeta: {
    color: "#475569",
    marginBottom: 8
  },
  itemRow: {
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0"
  },
  itemTitle: {
    fontWeight: 700
  },
  itemDescription: {
    color: "#475569",
    marginTop: 3
  },
  deliverableTitle: {
    marginTop: 6,
    fontWeight: 700
  },
  deliverableRow: {
    color: "#334155",
    marginTop: 2
  }
});

function formatDeliverableLine(deliverable: ChecklistWorkspace["items"][number]["deliverables"][number]) {
  if (deliverable.type === "file") {
    return `${deliverable.file_name || "Dosya"}${deliverable.file_size ? ` (${deliverable.file_size} bayt)` : ""}`;
  }

  return deliverable.content;
}

export function ExportPdfDocument({
  workspace
}: {
  workspace: ChecklistWorkspace;
}) {
  if (!workspace.app) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Workspace bulunamadi.</Text>
        </Page>
      </Document>
    );
  }

  const groupedItems = groupChecklistItems(workspace.items);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Lalalaunchboard Export</Text>
          <Text style={styles.title}>{workspace.app.name}</Text>
          <Text style={styles.subtitle}>
            Prep, launch, and grow - all on one board.
          </Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Platform</Text>
              <Text style={styles.metaValue}>
                {formatPlatformLabel(workspace.app.platform)}
              </Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Lansman Tarihi</Text>
              <Text style={styles.metaValue}>
                {formatLaunchDate(workspace.app.launch_date)}
              </Text>
            </View>
            <View style={[styles.metaCard, { marginRight: 0 }]}>
              <Text style={styles.metaLabel}>Genel Ilerleme</Text>
              <Text style={styles.metaValue}>%{workspace.progress.overall}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist Durumu</Text>

          {groupedItems.map((group) => (
            <View key={group.category} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{group.label}</Text>
              <Text style={styles.categoryMeta}>
                %{group.progress} - {group.completedCount}/{group.totalCount} tamamlandi
              </Text>

              {group.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemTitle}>
                    {item.status?.completed ? "[x]" : "[ ]"} {item.title}
                  </Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>

                  {item.deliverables.length > 0 ? (
                    <View>
                      <Text style={styles.deliverableTitle}>Deliverables</Text>
                      {item.deliverables.map((deliverable) => (
                        <Text key={deliverable.id} style={styles.deliverableRow}>
                          - {deliverable.type.toUpperCase()}: {formatDeliverableLine(deliverable)}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
