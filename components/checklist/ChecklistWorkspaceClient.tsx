"use client";

import { useState } from "react";

import { ChecklistCategory } from "@/components/checklist/ChecklistCategory";
import { ProgressBar } from "@/components/checklist/ProgressBar";
import { useToast } from "@/components/shared/ToastProvider";
import { WorkspaceHero } from "@/components/shared/WorkspaceHero";
import { WorkspaceSectionNav } from "@/components/shared/WorkspaceSectionNav";
import { LaunchMetricCard } from "@/components/ui/LaunchKit";
import { formatLaunchDate, formatPlatformLabel } from "@/lib/apps/presentation";
import {
  calculateProgressFromItems,
  getNextCriticalItem,
  groupChecklistItems
} from "@/lib/progress";
import type {
  App,
  ChecklistActionResult,
  ChecklistItemStatus,
  ChecklistItemWithStatus,
  ContentSource,
  Deliverable
} from "@/types";

interface ChecklistWorkspaceClientProps {
  app: App;
  initialItems: ChecklistItemWithStatus[];
  contentSource: ContentSource;
}

function buildOptimisticStatus(
  item: ChecklistItemWithStatus,
  appId: string,
  completed: boolean
): ChecklistItemStatus {
  const now = new Date().toISOString();

  return item.status
    ? {
        ...item.status,
        completed,
        completed_at: completed ? now : null,
        updated_at: now
      }
    : {
        id: `optimistic-${item.id}`,
        app_id: appId,
        cms_item_id: item.id,
        completed,
        completed_at: completed ? now : null,
        updated_at: now
      };
}

export function ChecklistWorkspaceClient({
  app,
  initialItems,
  contentSource
}: ChecklistWorkspaceClientProps) {
  const { pushToast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [pendingItemIds, setPendingItemIds] = useState<string[]>([]);

  const progress = calculateProgressFromItems(items);
  const groupedItems = groupChecklistItems(items);
  const deliverableCount = items.reduce(
    (total, item) => total + item.deliverables.length,
    0
  );
  const resourceCount = items.reduce(
    (total, item) => total + item.toolLinks.length,
    0
  );
  const remainingCount = progress.totalCount - progress.completedCount;
  const launchDateLabel = formatLaunchDate(app.launch_date);
  const nextCriticalItem = getNextCriticalItem(items);

  async function handleToggle(itemId: string) {
    const previousItems = items;
    const currentItem = previousItems.find((item) => item.id === itemId);

    if (!currentItem) {
      return;
    }

    const nextCompleted = !(currentItem.status?.completed ?? false);

    setPendingItemIds((current) => [...current, itemId]);
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: buildOptimisticStatus(item, app.id, nextCompleted)
            }
          : item
      )
    );

    try {
      const response = await fetch(`/api/apps/${app.id}/checklist/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: nextCompleted
        })
      });
      const result = (await response.json()) as ChecklistActionResult;

      if (!response.ok || !result.ok || !result.status) {
        setItems(previousItems);
        pushToast({
          title: "Checklist guncellenemedi",
          description: result.message ?? "Guncelleme basarisiz, tekrar dene.",
          variant: "destructive"
        });
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status: result.status ?? item.status
              }
            : item
        )
      );
      pushToast({
        title: "Kaydedildi",
        description: nextCompleted
          ? "Checklist item'i tamamlandi olarak guncellendi."
          : "Checklist item'i yeniden acik duruma alindi.",
        variant: "success"
      });
    } catch {
      setItems(previousItems);
      pushToast({
        title: "Checklist guncellenemedi",
        description: "Guncelleme basarisiz, tekrar dene.",
        variant: "destructive"
      });
    } finally {
      setPendingItemIds((current) => current.filter((id) => id !== itemId));
    }
  }

  function handleDeliverablesChange(itemId: string, deliverables: Deliverable[]) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              deliverables
            }
          : item
      )
    );
  }

  return (
    <div className="space-y-8">
      <WorkspaceSectionNav appId={app.id} />

      <WorkspaceHero
        eyebrow="Pre-launch board"
        title={`${app.name} icin launch prep board`}
        description={`${launchDateLabel} hedefi icin checklist, deliverable ve rehber linklerini tek yerde tut. Bu ekran prep akisinin merkezi gibi calisiyor ve acik kalan hamleleri netlestiriyor.`}
        platformLabel={formatPlatformLabel(app.platform)}
        launchDate={app.launch_date}
        contentSource={contentSource}
        actions={[
          {
            href: "/dashboard",
            label: "Dashboard'a don"
          },
          {
            href: `/app/${app.id}/post-launch`,
            label: "Growth routine'a gec"
          },
          {
            href: `/app/${app.id}/export`,
            label: "Export hazirla",
            variant: "primary"
          }
        ]}
        stats={[
          {
            label: "Overall progress",
            value: `%${progress.overall}`,
            detail: `${progress.completedCount}/${progress.totalCount} item tamamlandi`
          },
          {
            label: "Deliverables",
            value: `${deliverableCount}`,
            detail: "Checklist item'larina bagli somut cikti sayisi"
          },
          {
            label: "Resource links",
            value: `${resourceCount}`,
            detail: "Board icinde acik rehber ve arac kaynagi"
          }
        ]}
        panelEyebrow="Launch posture"
        panelTitle={
          nextCriticalItem
            ? "Siradaki en kritik is"
            : remainingCount === 0
              ? "Board launch-ready"
              : `${remainingCount} acik hareket kaldi`
        }
        panelDescription={
          nextCriticalItem
            ? nextCriticalItem.title
            : remainingCount === 0
              ? "Temel prep item'lari kapanmis durumda. Artik export alabilir ve sonraki ritim ekranina gecebilirsin."
              : "Acik kalan item'lari kategori bazinda kapatip deliverable'lari tamamladikca board daha temiz bir launch durumuna geciyor."
        }
        panelBody={
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-white/72">Prep completion</span>
                <span className="font-semibold text-white">%{progress.overall}</span>
              </div>
              <ProgressBar value={progress.overall} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Categories
                </p>
                <p className="mt-2 text-2xl font-semibold">{groupedItems.length}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Open items
                </p>
                <p className="mt-2 text-2xl font-semibold">{remainingCount}</p>
              </div>
            </div>
            {nextCriticalItem ? (
              <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Next move
                </p>
                <p className="mt-2 text-sm leading-6 text-white/84">
                  {nextCriticalItem.title}
                </p>
              </div>
            ) : null}
          </div>
        }
        panelFootnote="Prep -> Launch -> Grow"
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {groupedItems.map((group) => (
          <LaunchMetricCard
            key={group.category}
            label={group.label}
            value={`%${group.progress}`}
            detail={
              group.progress === 100
                ? "Bu lane tamamen hazir. Sonraki akisa gecmek icin iyi durumdasin."
                : `${group.completedCount}/${group.totalCount} tamamlandi ve lane icinde hala kapanmasi gereken acik item'lar var.`
            }
            tone={
              group.progress === 100
                ? "success"
                : group.progress >= 60
                  ? "brand"
                  : "warning"
            }
          />
        ))}
      </section>

      <div className="grid gap-6">
        {groupedItems.map((group) => (
          <ChecklistCategory
            key={group.category}
            appId={app.id}
            title={group.label}
            progress={group.progress}
            completedCount={group.completedCount}
            totalCount={group.totalCount}
            items={group.items}
            pendingItemIds={pendingItemIds}
            onToggleItem={handleToggle}
            onDeliverablesChange={handleDeliverablesChange}
          />
        ))}
      </div>
    </div>
  );
}
