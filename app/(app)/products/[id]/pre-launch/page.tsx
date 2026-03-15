import { notFound } from "next/navigation";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PreLaunchClient } from "@/components/pre-launch/PreLaunchClient";
import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getProductByIdForUser } from "@/lib/products/service";
import { generatePreLaunchItems } from "@/lib/prelaunch/items";

const PLATFORM_LABELS: Record<string, string> = { ios: "iOS", android: "Android", web: "Web" };

export default async function ProductPreLaunchPage({ params }: { params: { id: string } }) {
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

  const platformLabels = (product.primary_platform ?? []).map(
    (p) => PLATFORM_LABELS[String(p)] ?? String(p)
  );

  const daysLeft = Math.ceil(
    (new Date(product.launch_date).getTime() - Date.now()) / 86400000
  );

  return (
    <div className="h-full overflow-y-auto bg-background">

      {/* ── Header ── */}
      <div className="border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/products/${product.id}`}
            className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} /> {product.product_name}
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                Pre-Launch Checklist
              </p>
              <h1 className="mt-1 text-[1.4rem] font-black tracking-[-0.04em] text-foreground">
                {product.product_name}
              </h1>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                {product.industry
                  ? `${product.industry} · Sektöre özel liste`
                  : "Genel liste — ürün detaylarını ekleyerek kişiselleştir"}
                {platformLabels.length > 0 && ` · ${platformLabels.join(", ")}`}
              </p>
            </div>

            {daysLeft > 0 && (
              <div className="shrink-0 rounded-2xl border border-[hsl(var(--border)/0.5)] bg-background px-5 py-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Launch&apos;a kalan</p>
                <p className="text-[1.8rem] font-black tracking-[-0.05em] text-foreground">{daysLeft}</p>
                <p className="text-[10.5px] text-muted-foreground">gün</p>
              </div>
            )}
          </div>

          {/* Missing product info warning */}
          {!product.industry && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[hsl(38,92%,52%/0.25)] bg-[hsl(38,92%,52%/0.06)] px-4 py-2.5">
              <Settings size={13} className="shrink-0 text-[hsl(38,88%,42%)]" />
              <p className="text-[12px] text-muted-foreground">
                Sektör ve compliance bilgisi eksik — liste geneldir.{" "}
                <Link href={`/products/${product.id}/edit`} className="font-semibold text-[hsl(var(--primary))] hover:underline">
                  Ürünü düzenle →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Checklist ── */}
      <div className="mx-auto max-w-5xl px-6 py-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.2)] px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[hsl(var(--border)/0.5)] bg-background">
              <Settings size={22} className="text-muted-foreground" />
            </div>
            <p className="text-[15px] font-bold text-foreground">Ürün bilgileri eksik</p>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Kişiselleştirilmiş checklist için sektör ve platform bilgisi ekle.
            </p>
            <Link
              href={`/products/${product.id}/edit`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Ürünü düzenle
            </Link>
          </div>
        ) : (
          <PreLaunchClient
            items={items}
            productId={product.id}
            companyName={product.product_name}
            industryLabel={product.industry ?? undefined}
            platformLabels={platformLabels}
            companyStage={product.company_stage ?? undefined}
            appName={product.product_name}
            launchDate={product.launch_date}
          />
        )}
      </div>
    </div>
  );
}
