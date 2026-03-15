"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useToast } from "@/components/shared/ToastProvider";
import type { ProductActionResult, ProductLimitState } from "@/types";

const INDUSTRY_OPTIONS = [
  "HealthTech", "FinTech", "EdTech", "E-commerce", "B2B SaaS",
  "Social", "Gaming", "Productivity", "Travel", "HR Tech", "LegalTech", "PropTech", "Diğer"
];

const STAGE_OPTIONS = ["Pre-launch", "MVP", "Seed", "Series A", "Growth", "Scale"];

const PLATFORM_OPTIONS = [
  { value: "ios", label: "iOS", color: "hsl(350,78%,50%)" },
  { value: "android", label: "Android", color: "hsl(152,58%,42%)" },
  { value: "web", label: "Web", color: "hsl(221,84%,54%)" }
];

function getDefaultLaunchDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

interface Props {
  limit: ProductLimitState;
}

export function NewProductForm({ limit }: Props) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    launch_date: getDefaultLaunchDate(),
    primary_platform: [] as string[],
    industry: "",
    company_stage: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isBlocked = !limit.canCreateProduct;

  function togglePlatform(p: string) {
    setForm(f => ({
      ...f,
      primary_platform: f.primary_platform.includes(p)
        ? f.primary_platform.filter(x => x !== p)
        : [...f.primary_platform, p]
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.product_name.trim()) errs.product_name = "Ürün adı gerekli";
    if (form.primary_platform.length === 0) errs.primary_platform = "En az bir platform seç";
    if (!form.launch_date) errs.launch_date = "Launch tarihi gerekli";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: form.product_name.trim(),
          launch_date: form.launch_date,
          primary_platform: form.primary_platform,
          industry: form.industry || undefined,
          company_stage: form.company_stage || undefined,
        })
      });
      const result = (await res.json()) as ProductActionResult;

      if (!res.ok || !result.ok) {
        pushToast({ title: "Hata", description: result.message ?? "Bilinmeyen hata", variant: "destructive" });
        return;
      }

      pushToast({ title: "Ürün oluşturuldu!", description: "Pre-launch checklistin hazır.", variant: "success" });
      startTransition(() => {
        router.push(`/products/${result.product!.id}`);
        router.refresh();
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">

      {/* Plan badge */}
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.6)] px-3 py-1 text-[11px] font-semibold text-muted-foreground">
          {limit.plan === "pro" ? "Pro Plan · Sınırsız ürün" : `Free Plan · ${limit.remainingSlots} slot kaldı`}
        </span>
        {isBlocked && (
          <Link href="/pricing" className="rounded-full border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.08)] px-3 py-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.15)]">
            Pro'ya geç →
          </Link>
        )}
      </div>

      {isBlocked ? (
        <div className="rounded-2xl border border-[hsl(38,92%,52%/0.3)] bg-[hsl(38,92%,52%/0.06)] p-6 text-center space-y-3">
          <p className="text-[15px] font-bold text-foreground">Ürün limitine ulaştın</p>
          <p className="text-[13px] text-muted-foreground">
            Free planda 1 ürün oluşturabilirsin. Daha fazlası için Pro'ya geç.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Pro planı gör
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Ürün adı */}
          <div className="rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] p-5 space-y-4">
            <p className="text-[13px] font-bold text-foreground">Ürün bilgileri</p>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                Ürün adı <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                placeholder="Ör. Nailfie, FocusFlow, BudgetBuddy"
                value={form.product_name}
                onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                autoFocus
              />
              {errors.product_name && <p className="text-[11px] text-red-500">{errors.product_name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                Launch tarihi <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                value={form.launch_date}
                onChange={e => setForm(f => ({ ...f, launch_date: e.target.value }))}
              />
              {errors.launch_date && <p className="text-[11px] text-red-500">{errors.launch_date}</p>}
            </div>
          </div>

          {/* Platform */}
          <div className="rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] p-5 space-y-3">
            <div>
              <p className="text-[13px] font-bold text-foreground">Platform <span className="text-red-400">*</span></p>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Birden fazla seçebilirsin</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(p => {
                const active = form.primary_platform.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    className="rounded-xl border px-5 py-2.5 text-[13px] font-semibold transition-all"
                    style={active
                      ? { borderColor: p.color + "60", backgroundColor: p.color + "12", color: p.color }
                      : { borderColor: "hsl(var(--border) / 0.5)", backgroundColor: "hsl(var(--background))", color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            {errors.primary_platform && <p className="text-[11px] text-red-500">{errors.primary_platform}</p>}
          </div>

          {/* Context (optional) */}
          <div className="rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] p-5 space-y-4">
            <div>
              <p className="text-[13px] font-bold text-foreground">Bağlam <span className="text-[11px] font-normal text-muted-foreground">(opsiyonel — ama önerilir)</span></p>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Pre-launch checklistini kişiselleştirmek için kullanılır</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">Sektör</label>
              <select
                className="w-full rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                value={form.industry}
                onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              >
                <option value="">Seçin...</option>
                {INDUSTRY_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">Şirket aşaması</label>
              <select
                className="w-full rounded-xl border border-[hsl(var(--border)/0.5)] bg-background px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                value={form.company_stage}
                onChange={e => setForm(f => ({ ...f, company_stage: e.target.value }))}
              >
                <option value="">Seçin...</option>
                {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/dashboard"
              className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← İptal
            </Link>
            <button
              type="submit"
              disabled={saving || isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Oluşturuluyor..." : "Ürünü oluştur →"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
