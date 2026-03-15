import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Rocket, CheckSquare, Zap, BarChart2, Calendar, Pencil } from "lucide-react";

import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getProductByIdForUser } from "@/lib/products/service";
import { generatePreLaunchItems } from "@/lib/prelaunch/items";

const PLATFORM_LABELS: Record<string, string> = { ios: "iOS", android: "Android", web: "Web" };
const PLATFORM_COLORS: Record<string, string> = {
  ios: "hsl(350,78%,56%)",
  android: "hsl(152,58%,42%)",
  web: "hsl(221,84%,54%)"
};

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const product = await getProductByIdForUser(supabase, user.id, params.id);
  if (!product) notFound();

  const items = generatePreLaunchItems({
    industry: product.industry,
    platforms: product.primary_platform?.map(String),
    compliance: product.compliance,
    company_stage: product.company_stage
  });
  const criticalCount = items.filter(i => i.priority === "critical").length;
  const daysLeft = Math.ceil((new Date(product.launch_date).getTime() - Date.now()) / 86400000);
  const platforms = product.primary_platform ?? [];

  return (
    <div className="h-full overflow-y-auto bg-background">

      {/* Header */}
      <div className="border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] px-6 py-5">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/products"
            className="mb-4 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} /> Tüm ürünler
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Platform + industry badges */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {platforms.map(p => (
                  <span
                    key={p}
                    className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{ borderColor: PLATFORM_COLORS[p] + "50", backgroundColor: PLATFORM_COLORS[p] + "12", color: PLATFORM_COLORS[p] }}
                  >
                    {PLATFORM_LABELS[p] ?? p}
                  </span>
                ))}
                {product.industry && (
                  <span className="rounded-full border border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.08)] px-2.5 py-0.5 text-[11px] font-semibold text-[hsl(var(--primary))]">
                    {product.industry}
                  </span>
                )}
                {product.company_stage && (
                  <span className="rounded-full border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.4)] px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {product.company_stage}
                  </span>
                )}
              </div>

              <h1 className="text-[1.6rem] font-black tracking-[-0.04em] text-foreground">
                {product.product_name}
              </h1>

              <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                <Calendar size={11} />
                {new Date(product.launch_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                {daysLeft > 0
                  ? <span className="ml-1 font-semibold text-foreground">{daysLeft} gün kaldı</span>
                  : <span className="ml-1 font-semibold text-[hsl(152,58%,42%)]">🚀 Yayında</span>
                }
              </div>
            </div>

            <Link
              href={`/products/${product.id}/edit`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[hsl(var(--border)/0.6)] bg-background px-3.5 py-2 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-[hsl(var(--border))] hover:text-foreground"
            >
              <Pencil size={12} /> Düzenle
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">

        {/* Nav tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NavTile
            href={`/products/${product.id}/pre-launch`}
            icon={<Rocket size={20} />}
            label="Pre-Launch"
            description={criticalCount > 0 ? `${criticalCount} kritik risk` : "Riskler temiz ✓"}
            color="hsl(350,78%,50%)"
            urgent={criticalCount > 0}
          />
          <NavTile
            href={`/app/${product.id}`}
            icon={<CheckSquare size={20} />}
            label="Checklist"
            description="Hazırlık listesi"
            color="hsl(221,84%,54%)"
          />
          <NavTile
            href={`/app/${product.id}/post-launch`}
            icon={<Zap size={20} />}
            label="Growth Routine"
            description="Haftalık görevler"
            color="hsl(152,58%,42%)"
          />
          <NavTile
            href={`/app/${product.id}/export`}
            icon={<BarChart2 size={20} />}
            label="Export"
            description="Rapor al"
            color="hsl(265,70%,58%)"
          />
        </div>

        {/* Info grid */}
        {(product.business_model || product.target_audience || (product.compliance ?? []).length > 0 || product.uvp) && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.business_model && (
              <InfoCard label="İş Modeli" value={product.business_model} />
            )}
            {product.target_audience && (
              <InfoCard label="Hedef Kitle" value={product.target_audience} />
            )}
            {(product.compliance ?? []).length > 0 && (
              <InfoCard label="Compliance" value={(product.compliance ?? []).join(", ")} />
            )}
            {product.uvp && (
              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">Değer Önermesi</p>
                <p className="text-[13px] leading-relaxed text-foreground">{product.uvp}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state: no context yet */}
        {!product.industry && !product.business_model && !product.uvp && (
          <div className="rounded-2xl border border-dashed border-[hsl(var(--border)/0.5)] px-6 py-8 text-center">
            <p className="text-[13px] font-semibold text-foreground">Ürün bilgileri eksik</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Sektör, compliance ve UVP ekleyerek pre-launch checklistini kişiselleştir.
            </p>
            <Link
              href={`/products/${product.id}/edit`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90"
            >
              <Pencil size={12} /> Ürünü düzenle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function NavTile({ href, icon, label, description, color, urgent }: {
  href: string; icon: React.ReactNode; label: string;
  description: string; color: string; urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 rounded-2xl border border-[hsl(var(--border)/0.5)] bg-background p-4 transition-all hover:border-[hsl(var(--border)/0.9)] hover:shadow-sm"
    >
      {urgent && <span className="absolute right-3 top-3 flex h-2 w-2 rounded-full bg-[hsl(350,78%,56%)]" />}
      <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: color + "15", color }}>
        {icon}
      </span>
      <div>
        <p className="text-[13px] font-bold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-4 py-3">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">{label}</p>
      <p className="text-[13px] font-semibold text-foreground">{value}</p>
    </div>
  );
}
