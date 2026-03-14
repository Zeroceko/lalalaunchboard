import type { ChecklistItemWithStatus } from "@/types";

import { ChecklistItem } from "@/components/checklist/ChecklistItem";
import { ProgressBar } from "@/components/checklist/ProgressBar";
import { LaunchBadge, LaunchPanel } from "@/components/ui/LaunchKit";

interface ChecklistCategoryProps {
  appId: string;
  title: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  items: ChecklistItemWithStatus[];
}

export function ChecklistCategory({
  appId,
  title,
  progress,
  completedCount,
  totalCount,
  items
}: ChecklistCategoryProps) {
  return (
    <LaunchPanel className="overflow-hidden p-0">
      <div className="border-b border-[hsl(var(--border))/0.48] bg-[linear-gradient(180deg,hsl(var(--surface-default-start)/0.98),hsl(var(--surface-default-end)/0.93))] px-6 py-6 lg:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <LaunchBadge tone={progress === 100 ? "success" : "clay"}>
              {title}
            </LaunchBadge>
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
              {completedCount}/{totalCount} tamamlandi
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {progress === 100
                ? "Bu lane tamamen kapanmis durumda. Sonraki asamaya rahatca gecebilirsin."
                : "Bu lane icinde hala tamamlanmasi gereken acik item'lar var. Deliverable ve kaynak baglantilarini eksiksiz kapatmaya odaklan."}
            </p>
          </div>

          <div className="w-full max-w-md rounded-[1.4rem] border border-[hsl(var(--border))/0.56] bg-[hsl(var(--card))/0.92] p-4 shadow-[0_10px_26px_hsl(var(--shadow-color)/0.06)]">
            <ProgressBar value={progress} label="Lane progress" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:p-7">
        {items.map((item) => (
          <ChecklistItem key={item.id} appId={appId} item={item} />
        ))}
      </div>
    </LaunchPanel>
  );
}
