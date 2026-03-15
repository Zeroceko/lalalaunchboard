"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ExternalLink, ShieldCheck, Search, Cpu, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  type PreLaunchCategory,
  type PreLaunchItem,
  type PreLaunchPriority
} from "@/lib/prelaunch/items";

// ── Helpers ───────────────────────────────────────────────────────────────────

function LinearProgress({ value, color }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted)/0.6)]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color ?? "hsl(var(--primary))" }}
      />
    </div>
  );
}

function ProgressRing({ value, size = 72 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  const color = value === 100 ? "hsl(152,58%,42%)" : value >= 60 ? "hsl(var(--primary))" : "hsl(38,92%,52%)";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth="6" fill="none"
        strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

// ── Priority badge ────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<PreLaunchPriority, string> = {
  critical: "border-[hsl(350,78%,56%/0.3)] bg-[hsl(350,78%,56%/0.08)] text-[hsl(350,78%,50%)]",
  important: "border-[hsl(38,92%,52%/0.3)] bg-[hsl(38,92%,52%/0.08)] text-[hsl(38,88%,42%)]",
  nice_to_have: "border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.4)] text-[hsl(var(--muted-foreground))]"
};

function PriorityBadge({ priority }: { priority: PreLaunchPriority }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", PRIORITY_STYLES[priority])}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

// ── Category icons ────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<PreLaunchCategory, React.ReactNode> = {
  store_compliance: <ShieldCheck size={14} />,
  aso: <Search size={14} />,
  sector_compliance: <Globe size={14} />,
  technical: <Cpu size={14} />
};

const CATEGORY_COLORS: Record<PreLaunchCategory, string> = {
  store_compliance: "hsl(350,78%,50%)",
  aso: "hsl(221,84%,54%)",
  sector_compliance: "hsl(38,88%,42%)",
  technical: "hsl(265,70%,58%)"
};

// ── Category summary cards ────────────────────────────────────────────────────

function CategorySummaryCards({
  items,
  completedIds,
  activeCategory,
  onSelect
}: {
  items: PreLaunchItem[];
  completedIds: Set<string>;
  activeCategory: PreLaunchCategory | "all";
  onSelect: (c: PreLaunchCategory | "all") => void;
}) {
  const categoryOrder: PreLaunchCategory[] = ["store_compliance", "aso", "sector_compliance", "technical"];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categoryOrder.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        const completed = catItems.filter((i) => completedIds.has(i.id)).length;
        const pct = Math.round((completed / catItems.length) * 100);
        const isActive = activeCategory === cat;
        const color = CATEGORY_COLORS[cat];

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(isActive ? "all" : cat)}
            className={cn(
              "rounded-xl border p-3.5 text-left transition-all",
              isActive
                ? "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] shadow-sm"
                : "border-[hsl(var(--border)/0.5)] bg-background hover:border-[hsl(var(--border)/0.8)] hover:bg-[hsl(var(--muted)/0.2)]"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: color + "18", color }}
              >
                {CATEGORY_ICONS[cat]}
              </span>
              <span className="text-[11px] font-bold" style={{ color: pct === 100 ? "hsl(152,58%,42%)" : color }}>
                {pct}%
              </span>
            </div>
            <p className="mt-2 text-[11.5px] font-semibold text-foreground leading-snug">
              {CATEGORY_LABELS[cat]}
            </p>
            <p className="mt-0.5 text-[10.5px] text-[hsl(var(--muted-foreground))]">
              {completed}/{catItems.length} tamamlandı
            </p>
            <div className="mt-2">
              <LinearProgress value={pct} color={color} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  completed,
  onToggle
}: {
  item: PreLaunchItem;
  completed: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "rounded-xl border transition-all",
      completed
        ? "border-[hsl(152,58%,42%/0.2)] bg-[hsl(152,58%,42%/0.03)]"
        : "border-[hsl(var(--border)/0.6)] bg-background hover:border-[hsl(var(--border)/0.9)]"
    )}>
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.35rem] border transition-colors",
            completed
              ? "border-[hsl(152,58%,42%)] bg-[hsl(152,58%,42%)]"
              : "border-[hsl(var(--border)/0.8)] hover:border-[hsl(var(--primary)/0.6)]"
          )}
        >
          {completed && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              "text-[13.5px] font-semibold leading-snug",
              completed ? "text-[hsl(var(--muted-foreground))] line-through" : "text-foreground"
            )}>
              {item.title}
            </span>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="mt-1 text-[12px] leading-[1.6] text-[hsl(var(--muted-foreground))]">{item.why}</p>
        </div>

        {/* Expand */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted)/0.5)] hover:text-foreground"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[hsl(var(--border)/0.4)] bg-[hsl(var(--muted)/0.15)] px-4 pb-4 pt-3">
          <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground)/0.6)]">
            Nasıl yapılır?
          </p>
          <ol className="space-y-2">
            {item.how.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)] text-[9.5px] font-bold text-[hsl(var(--primary))]">
                  {i + 1}
                </span>
                <span className="text-[12.5px] leading-[1.6] text-[hsl(var(--muted-foreground))]">{step}</span>
              </li>
            ))}
          </ol>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border)/0.5)] bg-background px-3 py-1.5 text-[11px] font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-foreground"
            >
              Resmi kaynak <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({
  category,
  items,
  completedIds,
  onToggle
}: {
  category: PreLaunchCategory;
  items: PreLaunchItem[];
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const completedCount = items.filter((i) => completedIds.has(i.id)).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const [collapsed, setCollapsed] = useState(false);
  const color = CATEGORY_COLORS[category];

  return (
    <section>
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="mb-3 flex w-full items-center gap-3 rounded-xl px-1 py-1 text-left transition-colors hover:bg-[hsl(var(--muted)/0.2)]"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: color + "18", color }}
        >
          {CATEGORY_ICONS[category]}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-foreground">{CATEGORY_LABELS[category]}</span>
            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{completedCount}/{items.length}</span>
            {progress === 100 && (
              <span className="rounded-full bg-[hsl(152,58%,42%/0.12)] px-2 py-0.5 text-[10px] font-bold text-[hsl(152,58%,42%)]">
                ✓ Tamamlandı
              </span>
            )}
          </div>
          <div className="mt-1.5 w-full max-w-[240px]">
            <LinearProgress value={progress} color={color} />
          </div>
        </div>
        <ChevronDown
          size={14}
          className={cn("shrink-0 text-[hsl(var(--muted-foreground))] transition-transform", collapsed && "-rotate-90")}
        />
      </button>

      {!collapsed && (
        <div className="space-y-2 pl-1">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              completed={completedIds.has(item.id)}
              onToggle={() => onToggle(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Main client ───────────────────────────────────────────────────────────────

type FilterPriority = "all" | PreLaunchPriority;

export interface PreLaunchClientProps {
  items: PreLaunchItem[];
  productId: string;
  companyName?: string;
  industryLabel?: string;
  platformLabels?: string[];
  companyStage?: string;
  appName?: string;
  launchDate?: string;
}

export function PreLaunchClient({
  items,
  productId,
  companyName,
  industryLabel,
  platformLabels = [],
}: PreLaunchClientProps) {
  const storageKey = `prelaunch_completed_${productId}`;

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all");
  const [categoryFilter, setCategoryFilter] = useState<PreLaunchCategory | "all">("all");

  useEffect(() => {
    async function loadPersistence() {
      // LocalStorage fallback for non-product views
      if (!productId || productId.startsWith("workspace_")) {
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) setCompletedIds(new Set(JSON.parse(saved) as string[]));
        } catch { /* ignore */ }
        setHydrated(true);
        return;
      }

      // Supabase fetch for product-specific views
      try {
        const res = await fetch(`/api/apps/${productId}/checklist`);
        if (res.ok) {
          const data = await res.json();
          const completed = (data as any[])
            .filter((item) => item.status?.completed)
            .map((item) => item.cms_item_id || item.id);
          setCompletedIds(new Set(completed));
        }
      } catch (error) {
        console.error("Failed to sync pre-launch state:", error);
      } finally {
        setHydrated(true);
      }
    }

    loadPersistence();
  }, [productId, storageKey]);

  const toggleItem = async (id: string) => {
    const nextCompleted = !completedIds.has(id);
    
    // Optimistic update
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

    // LocalStorage sync
    if (!productId || productId.startsWith("workspace_")) {
      try {
        const current = Array.from(completedIds);
        const next = nextCompleted ? [...current, id] : current.filter(x => x !== id);
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch { /* ignore */ }
      return;
    }

    // Supabase sync
    setSyncing(true);
    try {
      await fetch(`/api/apps/${productId}/checklist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted })
      });
    } catch (error) {
      console.error("Failed to sync toggle:", error);
    } finally {
      setSyncing(false);
    }
  };

  const totalCount = items.length;
  const completedCount = completedIds.size;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const criticalItems = items.filter((i) => i.priority === "critical");
  const criticalRemaining = criticalItems.filter((i) => !completedIds.has(i.id));

  // Apply both filters
  const filteredItems = items.filter((i) => {
    if (priorityFilter !== "all" && i.priority !== priorityFilter) return false;
    if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
    return true;
  });

  const categoryOrder: PreLaunchCategory[] = ["store_compliance", "aso", "sector_compliance", "technical"];
  const visibleCategories = categoryOrder.filter((cat) =>
    filteredItems.some((i) => i.category === cat)
  );

  const progressColor = progress === 100 ? "hsl(152,58%,42%)" : progress >= 60 ? "hsl(var(--primary))" : "hsl(38,92%,52%)";

  return (
    <div className="space-y-5">

      {/* ── Overall progress + critical status ── */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        {/* Left: progress */}
        <div className="flex items-center gap-5 rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.6)] px-5 py-4">
          <div className="relative flex shrink-0 items-center justify-center">
            <ProgressRing value={progress} size={72} />
            <div className="absolute flex flex-col items-center">
              <span className="text-[1.1rem] font-black tracking-[-0.04em] text-foreground">{progress}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-[14px] font-bold text-foreground">
                {companyName ? `${companyName} · ` : ""}{industryLabel ?? ""}
                {!companyName && !industryLabel && "Genel Checklist"}
              </p>
              <p className="text-[12px] text-[hsl(var(--muted-foreground))]">
                {completedCount} / {totalCount} madde tamamlandı
                {platformLabels.length > 0 && ` · ${platformLabels.join(", ")}`}
              </p>
            </div>
            <LinearProgress value={progress} color={progressColor} />
            <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
              {progress === 100
                ? "🎉 Tüm maddeler tamamlandı! Store submit'e hazırsın."
                : `${totalCount - completedCount} madde kaldı`}
            </p>
          </div>
        </div>

        {/* Right: critical status */}
        <div className={cn(
          "flex flex-col justify-center rounded-2xl border px-5 py-4 sm:min-w-[200px]",
          criticalRemaining.length > 0
            ? "border-[hsl(350,78%,56%/0.25)] bg-[hsl(350,78%,56%/0.05)]"
            : "border-[hsl(152,58%,42%/0.25)] bg-[hsl(152,58%,42%/0.05)]"
        )}>
          <div className="flex items-center gap-2">
            <span className={`text-[18px] ${criticalRemaining.length > 0 ? "" : ""}`}>
              {criticalRemaining.length > 0 ? "⚠️" : "✅"}
            </span>
            <div>
              <p className={`text-[13px] font-bold ${criticalRemaining.length > 0 ? "text-[hsl(350,78%,50%)]" : "text-[hsl(152,58%,40%)]"}`}>
                {criticalRemaining.length > 0
                  ? `${criticalRemaining.length} kritik risk`
                  : "Kritik riskler temiz"}
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {criticalRemaining.length > 0
                  ? criticalRemaining[0]?.title + (criticalRemaining.length > 1 ? ` +${criticalRemaining.length - 1}` : "")
                  : "Store reject riski yok"}
              </p>
            </div>
          </div>
          {criticalRemaining.length > 0 && (
            <button
              type="button"
              onClick={() => { setPriorityFilter("critical"); setCategoryFilter("all"); }}
              className="mt-3 rounded-lg bg-[hsl(350,78%,56%/0.12)] px-3 py-1.5 text-[11px] font-semibold text-[hsl(350,78%,50%)] transition-colors hover:bg-[hsl(350,78%,56%/0.2)]"
            >
              Kritik maddeleri göster
            </button>
          )}
        </div>
      </div>

      {/* ── Category summary cards (clickable filter) ── */}
      <CategorySummaryCards
        items={items}
        completedIds={completedIds}
        activeCategory={categoryFilter}
        onSelect={setCategoryFilter}
      />

      {/* ── Priority filter pills ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[hsl(var(--muted-foreground)/0.6)]">Öncelik:</span>
        {(["all", "critical", "important", "nice_to_have"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setPriorityFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
              priorityFilter === f
                ? "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                : "border-[hsl(var(--border)/0.5)] bg-background text-[hsl(var(--muted-foreground))] hover:text-foreground"
            )}
          >
            {f === "all" ? "Tümü" : PRIORITY_LABELS[f]}
          </button>
        ))}
        {(categoryFilter !== "all" || priorityFilter !== "all") && (
          <button
            type="button"
            onClick={() => { setPriorityFilter("all"); setCategoryFilter("all"); }}
            className="ml-1 rounded-full border border-[hsl(var(--border)/0.5)] bg-background px-3 py-1 text-[11px] font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-foreground"
          >
            × Filtreyi temizle
          </button>
        )}
      </div>

      {/* ── Checklist ── */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.15)] px-6 py-8 text-center">
          <p className="text-sm font-semibold text-foreground">Bu filtre için madde yok</p>
          <p className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">Farklı bir filtre dene.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleCategories.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <CategorySection
                key={cat}
                category={cat}
                items={catItems}
                completedIds={completedIds}
                onToggle={toggleItem}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
