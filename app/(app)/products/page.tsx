import Link from "next/link";
import { Plus } from "lucide-react";

import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getProductSnapshot } from "@/lib/products/service";
import { generatePreLaunchItems } from "@/lib/prelaunch/items";

const PLATFORM_LABELS: Record<string, string> = { ios: "iOS", android: "Android", web: "Web" };
const PLATFORM_COLORS: Record<string, string> = {
  ios: "hsl(350,78%,56%)",
  android: "hsl(152,58%,42%)",
  web: "hsl(221,84%,54%)"
};

export default async function ProductsPage() {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const { products, limit } = await getProductSnapshot(supabase, user.id);

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] px-6 py-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              Ürünlerim
            </p>
            <h1 className="mt-1 text-[1.4rem] font-black tracking-[-0.04em] text-foreground">
              {products.length} ürün
            </h1>
          </div>
          {limit?.canCreateProduct && (
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Yeni Ürün
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[hsl(var(--border)/0.5)] px-8 py-16 text-center">
            <p className="text-[15px] font-bold text-foreground">Henüz ürün yok</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              İlk ürününü oluştur, pre-launch checklistin otomatik hazırlansın.
            </p>
            <Link
              href="/products/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
            >
              <Plus size={14} /> Ürün oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map(p => {
              const days = Math.ceil((new Date(p.launch_date).getTime() - Date.now()) / 86400000);
              const items = generatePreLaunchItems({
                industry: p.industry,
                platforms: p.primary_platform?.map(String),
                compliance: p.compliance,
                company_stage: p.company_stage
              });
              const criticalCount = items.filter(i => i.priority === "critical").length;

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group rounded-2xl border border-[hsl(var(--border)/0.5)] bg-background p-5 transition-all hover:border-[hsl(var(--border)/0.9)] hover:shadow-sm"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-foreground truncate">{p.product_name}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {(p.primary_platform ?? []).map(pl => (
                          <span
                            key={pl}
                            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                            style={{ borderColor: PLATFORM_COLORS[pl] + "40", backgroundColor: PLATFORM_COLORS[pl] + "12", color: PLATFORM_COLORS[pl] }}
                          >
                            {PLATFORM_LABELS[pl] ?? pl}
                          </span>
                        ))}
                        {p.industry && (
                          <span className="rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.08)] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--primary))]">
                            {p.industry}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Countdown */}
                    <div className="shrink-0 text-right">
                      <p className={`text-[1.1rem] font-black tracking-tight ${days > 0 ? "text-foreground" : "text-[hsl(152,58%,42%)]"}`}>
                        {days > 0 ? days : "🚀"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{days > 0 ? "gün" : "yayında"}</p>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--border)/0.4)] pt-3">
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(p.launch_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                    </p>
                    {criticalCount > 0 ? (
                      <span className="rounded-full border border-[hsl(350,78%,56%/0.3)] bg-[hsl(350,78%,56%/0.08)] px-2.5 py-0.5 text-[10px] font-semibold text-[hsl(350,78%,50%)]">
                        {criticalCount} kritik risk
                      </span>
                    ) : (
                      <span className="rounded-full border border-[hsl(152,58%,42%/0.25)] bg-[hsl(152,58%,42%/0.06)] px-2.5 py-0.5 text-[10px] font-semibold text-[hsl(152,58%,40%)]">
                        ✓ Riskler temiz
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!limit?.canCreateProduct && (
          <div className="mt-6 rounded-xl border border-[hsl(38,92%,52%/0.25)] bg-[hsl(38,92%,52%/0.06)] px-4 py-3 flex items-center justify-between">
            <p className="text-[12px] text-muted-foreground">Free planda 1 ürün limiti doldu.</p>
            <Link href="/pricing" className="text-[12px] font-semibold text-[hsl(var(--primary))] hover:underline">
              Pro&apos;ya geç →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
