"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/shared/ToastProvider";

import {
  STAGE_ENTRIES,
  TEAM_SIZE_ENTRIES,
  GROWTH_CHANNEL_ENTRIES,
} from "@/lib/workspaces/options";
import type { Workspace } from "@/types";

/* ── helpers ── */
const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all";

/* ── Chevron ── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75"
      className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Single dropdown ── */
function SingleSelect({
  entries, value, onChange, placeholder, searchable
}: {
  entries: [string, string][];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(([k, l]) => l.toLowerCase().includes(q) || k.toLowerCase().includes(q));
  }, [entries, query, searchable]);

  const label = value ? entries.find(([k]) => k === value)?.[1] : null;

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all ${
          open ? "border-primary/50 ring-2 ring-primary/20" : "border-border hover:bg-muted/30"
        }`}>
        <span className={label ? "text-foreground font-medium" : "text-muted-foreground"}>{label ?? placeholder}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          {searchable && (
            <div className="border-b border-border p-2">
              <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara..." className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none" />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto">
            {filtered.map(([key, lbl]) => (
              <button key={key} type="button"
                onClick={() => { onChange(key === value ? "" : key); setOpen(false); setQuery(""); }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  value === key ? "bg-primary/8 text-primary font-medium" : "hover:bg-muted/60 text-foreground"
                }`}>
                <span>{lbl}</span>
                {value === key && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
                    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="h-2.5 w-2.5">
                      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Field ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════ */
interface Props {
  workspace: Workspace | null;
  workspaceId: string | null;
}

export function WorkspaceForm({ workspace, workspaceId }: Props) {
  const router = useRouter();
  const { pushToast } = useToast();

  const [companyName, setCompanyName] = useState(workspace?.company_name ?? "");
  const [stage, setStage] = useState(workspace?.company_stage ?? "");
  const [teamSize, setTeamSize] = useState(workspace?.team_size ?? "");
  const [growthChannel, setGrowthChannel] = useState(workspace?.growth_channel ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(workspace?.website_url ?? "");

  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) { pushToast({ title: "Şirket adı zorunludur", variant: "destructive" }); return; }
    setLoading(true);

    try {
      const payload = {
        company_name: companyName,
        company_stage: stage || undefined,
        team_size: teamSize || undefined,
        growth_channel: growthChannel || undefined,
        website_url: websiteUrl || undefined,
      };

      let res: Response;
      if (workspaceId) {
        res = await fetch(`/api/workspaces/${workspaceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!data.ok) { pushToast({ title: data.message ?? "Bir hata oluştu", variant: "destructive" }); return; }
      pushToast({ title: "Şirket profili kaydedildi", description: "Değişiklikler AI önerilerinize yansıyacak.", variant: "success" });
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <form id="workspace" onSubmit={handleSave} className="space-y-5">
      <div className="rounded-xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.3)] px-4 py-3 text-[12px] text-muted-foreground">
        💡 Sektör, platform, iş modeli, UVP ve rakip bilgileri <strong>ürün bazlı</strong> — her ürünün kendi sayfasından düzenlenebilir.
      </div>

      <Field label="Şirket Adı" hint="*">
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Inc." className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Büyüme Aşaması">
          <SingleSelect entries={STAGE_ENTRIES} value={stage} onChange={setStage} placeholder="Seç..." />
        </Field>
        <Field label="Takım Büyüklüğü">
          <SingleSelect entries={TEAM_SIZE_ENTRIES} value={teamSize} onChange={setTeamSize} placeholder="Seç..." />
        </Field>
      </div>

      <Field label="Büyüme Kanalı">
        <SingleSelect entries={GROWTH_CHANNEL_ENTRIES} value={growthChannel} onChange={setGrowthChannel} placeholder="Seç..." searchable />
      </Field>

      <Field label="Website">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-muted-foreground">https://</span>
          <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="acme.com"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-16 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
        </div>
      </Field>

      <button type="submit" disabled={loading}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
