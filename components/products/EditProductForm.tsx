"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

import { useToast } from "@/components/shared/ToastProvider";
import type { Product, ProductActionResult } from "@/types";

const INDUSTRY_OPTIONS = [
  "HealthTech", "FinTech", "EdTech", "E-commerce", "B2B SaaS",
  "Social", "Gaming", "Productivity", "Travel", "HR Tech", "LegalTech", "PropTech", "Diğer"
];

const COMPLIANCE_OPTIONS = [
  "GDPR", "KVKK", "HIPAA", "PCI-DSS", "SOC 2", "ISO 27001",
  "COPPA", "FERPA", "KYC/AML", "eIDAS"
];

const STAGE_OPTIONS = ["Pre-launch", "MVP", "Seed", "Series A", "Growth", "Scale"];

const BUSINESS_MODEL_OPTIONS = ["B2B SaaS", "B2C Mobile", "Marketplace", "E-commerce"];

const PLATFORM_OPTIONS = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "web", label: "Web" }
];

interface Props {
  product: Product;
}

export function EditProductForm({ product }: Props) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    product_name: product.product_name,
    launch_date: product.launch_date,
    primary_platform: product.primary_platform ?? [],
    business_model: product.business_model ?? "",
    target_audience: product.target_audience ?? "",
    industry: product.industry ?? "",
    company_stage: product.company_stage ?? "",
    compliance: product.compliance ?? [],
    uvp: product.uvp ?? "",
    competitors: (product.competitors ?? []).join(", ")
  });

  function togglePlatform(p: string) {
    setForm(f => ({
      ...f,
      primary_platform: f.primary_platform.includes(p as "ios" | "android" | "web")
        ? f.primary_platform.filter(x => x !== p)
        : [...f.primary_platform, p as "ios" | "android" | "web"]
    }));
  }

  function toggleCompliance(c: string) {
    setForm(f => ({
      ...f,
      compliance: f.compliance.includes(c)
        ? f.compliance.filter(x => x !== c)
        : [...f.compliance, c]
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        product_name: form.product_name.trim() || undefined,
        launch_date: form.launch_date || undefined,
        primary_platform: form.primary_platform.length > 0 ? form.primary_platform : undefined,
        business_model: form.business_model || undefined,
        target_audience: form.target_audience.trim() || undefined,
        industry: form.industry.trim() || undefined,
        company_stage: form.company_stage || undefined,
        compliance: form.compliance.length > 0 ? form.compliance : undefined,
        uvp: form.uvp.trim() || undefined,
        competitors: form.competitors.trim()
          ? form.competitors.split(",").map(s => s.trim()).filter(Boolean)
          : undefined
      };

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = (await res.json()) as ProductActionResult;

      if (!res.ok || !result.ok) {
        pushToast({ title: "Kayıt hatası", description: result.message ?? "Bilinmeyen hata", variant: "destructive" });
        return;
      }

      pushToast({ title: "Kaydedildi", description: "Ürün bilgileri güncellendi.", variant: "success" });
      startTransition(() => {
        router.push(`/products/${product.id}`);
        router.refresh();
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const result = (await res.json()) as ProductActionResult;
      if (!res.ok || !result.ok) {
        pushToast({ title: "Silinemedi", description: result.message ?? "Bilinmeyen hata", variant: "destructive" });
        return;
      }
      pushToast({ title: "Silindi", description: "Ürün silindi.", variant: "success" });
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } finally {
      setDeleting(false);
    }
  }

  const charLeft = 280 - form.uvp.length;

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] px-6 py-5">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/products/${product.id}`}
            className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} /> {product.product_name}
          </Link>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
            Ürünü Düzenle
          </p>
          <h1 className="mt-1 text-[1.4rem] font-black tracking-[-0.04em] text-foreground">
            {product.product_name}
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="mx-auto max-w-2xl px-6 py-6 space-y-6">

        {/* Basic info */}
        <Section title="Temel Bilgiler">
          <Field label="Ürün adı" required>
            <input
              className="input-base"
              value={form.product_name}
              onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Launch tarihi" required>
            <input
              type="date"
              className="input-base"
              value={form.launch_date}
              onChange={e => setForm(f => ({ ...f, launch_date: e.target.value }))}
              required
            />
          </Field>
        </Section>

        {/* Platform */}
        <Section title="Platform">
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => togglePlatform(p.value)}
                className={`rounded-xl border px-4 py-2 text-[13px] font-semibold transition-colors ${
                  form.primary_platform.includes(p.value as "ios" | "android" | "web")
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border)/0.5)] bg-background text-muted-foreground hover:border-[hsl(var(--border))]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Context */}
        <Section title="Ürün Bağlamı" description="Bu bilgiler pre-launch checklist'ini kişiselleştirir.">
          <Field label="Sektör">
            <select
              className="input-base"
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            >
              <option value="">Seçin...</option>
              {INDUSTRY_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Şirket aşaması">
            <select
              className="input-base"
              value={form.company_stage}
              onChange={e => setForm(f => ({ ...f, company_stage: e.target.value }))}
            >
              <option value="">Seçin...</option>
              {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="İş modeli">
            <select
              className="input-base"
              value={form.business_model}
              onChange={e => setForm(f => ({ ...f, business_model: e.target.value }))}
            >
              <option value="">Seçin...</option>
              {BUSINESS_MODEL_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Hedef kitle">
            <input
              className="input-base"
              placeholder="Ör. 25-40 yaş, freelancer profesyoneller"
              value={form.target_audience}
              onChange={e => setForm(f => ({ ...f, target_audience: e.target.value }))}
              maxLength={200}
            />
          </Field>
        </Section>

        {/* Compliance */}
        <Section title="Compliance" description="Ürününüzün uyması gereken düzenlemeler.">
          <div className="flex flex-wrap gap-2">
            {COMPLIANCE_OPTIONS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCompliance(c)}
                className={`rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  form.compliance.includes(c)
                    ? "border-[hsl(38,92%,52%/0.4)] bg-[hsl(38,92%,52%/0.1)] text-[hsl(38,88%,35%)]"
                    : "border-[hsl(var(--border)/0.5)] bg-background text-muted-foreground hover:border-[hsl(var(--border))]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>

        {/* UVP + Competitors */}
        <Section title="Değer Önermesi & Rekabet">
          <Field label={`Değer önermesi (${charLeft} karakter kaldı)`}>
            <textarea
              className="input-base min-h-[80px] resize-none"
              placeholder="Bu ürün, [hedef kitle]nin [problem]ini [çözüm] ile çözer."
              value={form.uvp}
              onChange={e => setForm(f => ({ ...f, uvp: e.target.value }))}
              maxLength={280}
            />
          </Field>
          <Field label="Rakipler" hint="Virgülle ayırın">
            <input
              className="input-base"
              placeholder="Ör. Notion, Linear, Asana"
              value={form.competitors}
              onChange={e => setForm(f => ({ ...f, competitors: e.target.value }))}
            />
          </Field>
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isPending}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              confirmDelete
                ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                : "border-[hsl(var(--border)/0.5)] bg-background text-muted-foreground hover:border-red-300 hover:text-red-500"
            }`}
          >
            <Trash2 size={14} />
            {confirmDelete ? "Emin misin? Tekrar tıkla." : "Ürünü sil"}
          </button>

          <button
            type="submit"
            disabled={saving || isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input-base {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border) / 0.5);
          background: hsl(var(--background));
          padding: 0.6rem 0.875rem;
          font-size: 13px;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base:focus {
          border-color: hsl(var(--primary) / 0.6);
        }
      `}</style>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] p-5 space-y-4">
      <div>
        <p className="text-[13px] font-bold text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}
