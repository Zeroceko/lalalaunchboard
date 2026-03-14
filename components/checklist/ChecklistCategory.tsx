import type { ChecklistItemWithStatus } from "@/types";

import { ChecklistItem } from "@/components/checklist/ChecklistItem";
import { ProgressBar } from "@/components/checklist/ProgressBar";

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
    <section className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-white/88 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="border-b border-foreground/8 bg-secondary/28 px-6 py-6 lg:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">
              {title}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">
              {completedCount}/{totalCount} tamamlandi
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {progress === 100
                ? "Bu lane tamamen kapanmis durumda. Sonraki asamaya rahatca gecebilirsin."
                : "Bu lane icinde hala tamamlanmasi gereken acik item'lar var. Deliverable ve kaynak baglantilarini eksiksiz kapatmaya odaklan."}
            </p>
          </div>

          <div className="w-full max-w-md rounded-[1.4rem] border border-foreground/10 bg-white/80 p-4">
            <ProgressBar value={progress} label="Lane progress" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:p-7">
        {items.map((item) => (
          <ChecklistItem key={item.id} appId={appId} item={item} />
        ))}
      </div>
    </section>
  );
}
