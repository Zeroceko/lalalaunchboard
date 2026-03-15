"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { LaunchButton } from "@/components/ui/LaunchKit";
import { SECTOR_ENTRIES } from "@/lib/workspaces/sectors";
import {
  BUSINESS_MODEL_ENTRIES,
  PLATFORM_ENTRIES,
  STAGE_ENTRIES,
  TEAM_SIZE_ENTRIES,
  TARGET_AUDIENCE_ENTRIES,
  TRACTION_LEVEL_ENTRIES,
  REVENUE_LEVEL_ENTRIES,
  GROWTH_CHANNEL_ENTRIES,
  COMPLIANCE_ENTRIES,
} from "@/lib/workspaces/options";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
type Step = "profile" | "workspace" | "details";

const STEPS: { id: Step; label: string; caption: string }[] = [
  { id: "profile",   label: "Seni Tanıyalım",  caption: "Kişisel profil" },
  { id: "workspace", label: "Şirketini Kur",    caption: "Workspace kurulumu" },
  { id: "details",   label: "AI'ı Eğit",        caption: "Opsiyonel detaylar" },
];

const ROLES: { key: string; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    key: "Founder",
    label: "Founder / CEO",
    desc: "Şirketi kuruyor veya yönetiyorum",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "Growth",
    label: "Growth / Marketing",
    desc: "Büyüme ve pazarlamayı yönetiyorum",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "Product",
    label: "Product Manager",
    desc: "Ürün stratejisine odaklanıyorum",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "Marketing",
    label: "Pazarlama Uzmanı",
    desc: "Marka ve içerik üretiyorum",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 2.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 8.5-8.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────────────────────── */
function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

/* ─────────────────────────────────────────────────────────────────
   Shared input style
───────────────────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-150";

/* ─────────────────────────────────────────────────────────────────
   Field wrapper
───────────────────────────────────────────────────────────────── */
function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {required && <span className="text-xs text-destructive">*</span>}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Checkmark SVG
───────────────────────────────────────────────────────────────── */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className ?? "h-3 w-3"}
    >
      <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Chevron SVG
───────────────────────────────────────────────────────────────── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Single-select Dropdown
───────────────────────────────────────────────────────────────── */
function SingleDropdown({
  entries,
  value,
  onChange,
  placeholder,
  searchable,
}: {
  entries: [string, string][];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(([k, l]) => l.toLowerCase().includes(q) || k.toLowerCase().includes(q));
  }, [entries, query, searchable]);

  const selectedLabel = value ? entries.find(([k]) => k === value)?.[1] : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-150 ${
          open
            ? "border-primary/60 ring-2 ring-primary/20 bg-background"
            : "border-border bg-background hover:border-border/80 hover:bg-muted/30"
        }`}
      >
        <span className={selectedLabel ? "text-foreground font-medium" : "text-muted-foreground"}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          {searchable && (
            <div className="border-b border-border p-2">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara..."
                className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">Sonuç bulunamadı</p>
            ) : (
              filtered.map(([key, label]) => {
                const isSelected = value === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChange(key === value ? "" : key);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors duration-100 ${
                      isSelected
                        ? "bg-primary/8 text-primary font-medium"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
                        <CheckIcon className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Multi-select Dropdown
───────────────────────────────────────────────────────────────── */
function MultiDropdown({
  entries,
  selected,
  onChange,
  placeholder,
  max,
  searchable,
}: {
  entries: [string, string][];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  max?: number;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(([k, l]) => l.toLowerCase().includes(q) || k.toLowerCase().includes(q));
  }, [entries, query, searchable]);

  const triggerLabel = useMemo(() => {
    if (selected.length === 0) return null;
    if (selected.length === 1) return entries.find(([k]) => k === selected[0])?.[1];
    return `${selected.length} seçildi`;
  }, [selected, entries]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-150 ${
          open
            ? "border-primary/60 ring-2 ring-primary/20 bg-background"
            : "border-border bg-background hover:border-border/80 hover:bg-muted/30"
        }`}
      >
        <span className={triggerLabel ? "text-foreground font-medium" : "text-muted-foreground"}>
          {triggerLabel ?? placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          {searchable && (
            <div className="border-b border-border p-2">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara..."
                className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">Sonuç bulunamadı</p>
            ) : (
              filtered.map(([key, label]) => {
                const isSelected = selected.includes(key);
                const isDisabled = !isSelected && max !== undefined && selected.length >= max;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onChange(toggle(selected, key))}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-primary/8 text-primary font-medium"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-background"
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-2.5 w-2.5" />}
                    </span>
                    <span className="flex-1">{label}</span>
                  </button>
                );
              })
            )}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-border px-4 py-2.5">
              <span className="text-xs text-muted-foreground">
                {selected.length} seçildi{max ? ` / maks ${max}` : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TagSelect (Sektör — hero multi-tag with search)
───────────────────────────────────────────────────────────────── */
function TagSelect({
  entries,
  selected,
  onChange,
  placeholder,
}: {
  entries: [string, string][];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const available = entries.filter(([k]) => !selected.includes(k));
    if (!q) return available.slice(0, 30);
    return available.filter(([k, l]) => l.toLowerCase().includes(q) || k.toLowerCase().includes(q));
  }, [entries, query, selected]);

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((key) => {
            const label = entries.find(([k]) => k === key)?.[1] ?? key;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {label}
                <button
                  type="button"
                  onClick={() => onChange(selected.filter((k) => k !== key))}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary/20 transition-colors"
                >
                  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-2.5 w-2.5">
                    <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-muted-foreground">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={selected.length > 0 ? "Daha fazla ekle..." : placeholder}
          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
        />
        {open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
            {filtered.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onMouseDown={() => {
                  onChange([...selected, key]);
                  setQuery("");
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted/60 first:rounded-t-xl last:rounded-b-xl"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Left Panel — Step Indicator
───────────────────────────────────────────────────────────────── */
function StepIndicator({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="space-y-0">
      {STEPS.map((s, i) => {
        const done = i < stepIndex;
        const active = i === stepIndex;
        const upcoming = i > stepIndex;
        return (
          <div key={s.id} className="relative flex items-start gap-3.5">
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className={`absolute left-[17px] top-10 h-8 w-px transition-colors duration-500 ${
                  done ? "bg-primary" : "bg-border"
                }`}
              />
            )}
            <div className="pb-8 flex items-start gap-3.5">
              {/* Circle */}
              <div
                className={`relative z-10 mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "border-primary bg-primary text-white shadow-sm"
                    : active
                    ? "border-primary bg-background text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {done ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <span className={`text-xs font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                )}
              </div>
              {/* Text */}
              <div className="pt-1">
                <p
                  className={`text-sm font-semibold leading-none transition-colors ${
                    active ? "text-foreground" : done ? "text-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.caption}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Left Panel — Illustration per step
───────────────────────────────────────────────────────────────── */
function ProfileIllustration() {
  return (
    <div className="w-full rounded-2xl border border-border bg-background/60 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-primary">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="h-2.5 w-24 rounded-full bg-muted" />
          <div className="h-2 w-16 rounded-full bg-muted/60" />
        </div>
      </div>
      <div className="space-y-2 pt-1">
        {["Kişiselleştirilmiş AI önerileri", "Sektöre özel içerikler", "Akıllı önceliklendirme"].map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
              <CheckIcon className="h-2.5 w-2.5 text-primary" />
            </span>
            <span className="text-xs text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspaceIllustration() {
  return (
    <div className="w-full rounded-2xl border border-border bg-background/60 p-5 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">AI bunu öğrenir</p>
      {[
        { label: "HealthTech SaaS", tag: "Sektör", color: "bg-blue-500/15 text-blue-600" },
        { label: "B2B – KOBİ", tag: "Hedef", color: "bg-violet-500/15 text-violet-600" },
        { label: "Pre-Launch", tag: "Aşama", color: "bg-amber-500/15 text-amber-600" },
        { label: "Abonelik", tag: "Model", color: "bg-emerald-500/15 text-emerald-600" },
      ].map(({ label, tag, color }) => (
        <div key={tag} className="flex items-center justify-between gap-2">
          <span className="text-sm text-foreground font-medium">{label}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{tag}</span>
        </div>
      ))}
    </div>
  );
}

function DetailsIllustration() {
  const bars = [40, 60, 75, 90];
  return (
    <div className="w-full rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest">AI Skoru</p>
        <span className="text-2xl font-bold text-primary">90%</span>
      </div>
      <div className="flex items-end gap-1.5 h-10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/30 transition-all"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Rakipler ve değer önermeni eklemek, AI önerilerini <strong className="text-foreground">3× daha spesifik</strong> hale getirir.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Error Banner
───────────────────────────────────────────────────────────────── */
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────── */
interface InitialData {
  fullName: string;
  role: string;
  workspaceId: string | null;
  companyName: string;
  industry: string;
  businessModel: string;
  platforms: string[];
  stage: string;
  targetAudience: string;
  teamSize: string;
  tractionLevel: string;
  revenueLevel: string;
  growthChannel: string;
  compliance: string[];
  competitors: string[];
  uvp: string;
  websiteUrl: string;
}

export default function OnboardingClient({ initial }: { initial: InitialData }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — Profile
  const [fullName, setFullName] = useState(initial.fullName);
  const [role, setRole] = useState(initial.role);

  // Step 2 — Workspace
  const [companyName, setCompanyName] = useState(initial.companyName);
  const [industries, setIndustries] = useState<string[]>(initial.industry ? [initial.industry] : []);
  const [businessModel, setBusinessModel] = useState(initial.businessModel);
  const [platforms, setPlatforms] = useState<string[]>(initial.platforms);
  const [stage, setStage] = useState(initial.stage);

  // Step 3 — Details
  const [targetAudience, setTargetAudience] = useState(initial.targetAudience);
  const [teamSize, setTeamSize] = useState(initial.teamSize);
  const [tractionLevel, setTractionLevel] = useState(initial.tractionLevel);
  const [revenueLevel, setRevenueLevel] = useState(initial.revenueLevel);
  const [growthChannel, setGrowthChannel] = useState(initial.growthChannel);
  const [compliance, setCompliance] = useState<string[]>(initial.compliance);
  const [competitors, setCompetitors] = useState(() => {
    const c = initial.competitors.filter(Boolean);
    return [...c, ...Array(Math.max(0, 3 - c.length)).fill("")].slice(0, 3);
  });
  const [uvp, setUvp] = useState(initial.uvp);
  const [websiteUrl, setWebsiteUrl] = useState(initial.websiteUrl);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const illustrationMap: Record<Step, React.ReactNode> = {
    profile: <ProfileIllustration />,
    workspace: <WorkspaceIllustration />,
    details: <DetailsIllustration />,
  };

  const panelCopyMap: Record<Step, { eyebrow: string; heading: string; body: string }> = {
    profile: {
      eyebrow: "2 dakikada hazır",
      heading: "Hoş geldin!",
      body: "Sana özel bir AI deneyimi oluşturmak için birkaç hızlı soru soracağız. Rolüne ve şirketine göre her şeyi kişiselleştireceğiz.",
    },
    workspace: {
      eyebrow: "Şirket profili",
      heading: "AI'ına bağlam ver",
      body: "Sektörünü ve iş modelini öğrenen bir AI, her önerisini buna göre şekillendirir. Genel tavsiyeler yerine gerçek içgörüler.",
    },
    details: {
      eyebrow: "Opsiyonel ama güçlü",
      heading: "AI'ı tam potansiyeline çıkar",
      body: "Bu adım isteğe bağlı. Fakat ne kadar bilgi verirsen, AI önerilerin o kadar isabetli olur.",
    },
  };

  /* ── Handlers ── */
  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError("Ad Soyad zorunludur"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, role_in_company: role || undefined }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.message ?? "Bir hata oluştu"); return; }
      setStep("workspace");
    } finally { setLoading(false); }
  }

  async function handleWorkspaceSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!companyName.trim()) { setError("Şirket adı zorunludur"); return; }
    setLoading(true);
    try {
      const wsId = initial.workspaceId;
      const res = await fetch(wsId ? `/api/workspaces/${wsId}` : "/api/workspaces", {
        method: wsId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          industry: industries[0] ?? undefined,
          business_model: businessModel || undefined,
          primary_platform: platforms.length ? platforms : undefined,
          company_stage: stage || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.message ?? "Bir hata oluştu"); return; }
      setStep("details");
    } finally { setLoading(false); }
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const wsId = initial.workspaceId;
      if (!wsId) { router.push("/app/new"); return; }
      const filteredCompetitors = competitors.map((c) => c.trim()).filter(Boolean);
      await fetch(`/api/workspaces/${wsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_size: teamSize || undefined,
          target_audience: targetAudience || undefined,
          traction_level: tractionLevel || undefined,
          revenue_level: revenueLevel || undefined,
          growth_channel: growthChannel || undefined,
          compliance: compliance.length ? compliance : undefined,
          competitors: filteredCompetitors.length ? filteredCompetitors : undefined,
          uvp: uvp.trim() || undefined,
          website_url: websiteUrl || undefined,
        }),
      });
      router.push("/app/new");
    } finally { setLoading(false); }
  }

  const copy = panelCopyMap[step];

  return (
    <div className="flex min-h-screen bg-background">

      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="hidden w-80 flex-shrink-0 flex-col border-r border-border bg-muted/20 lg:flex">
        <div className="flex flex-1 flex-col p-8">

          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                  <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" />
                </svg>
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">LaunchBoard</span>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mb-10">
            <StepIndicator stepIndex={stepIndex} />
          </div>

          {/* Contextual copy */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{copy.eyebrow}</p>
            <h2 className="text-xl font-bold text-foreground leading-snug">{copy.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{copy.body}</p>
          </div>

          {/* Illustration */}
          <div className="mt-auto">
            {illustrationMap[step]}
          </div>
        </div>
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <main className="flex flex-1 flex-col overflow-y-auto">

        {/* Mobile progress bar */}
        <div className="flex gap-1 p-4 lg:hidden">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= stepIndex ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <div className="flex flex-1 justify-center px-6 py-12 lg:px-16 lg:py-16">
          <div className="w-full max-w-lg">

            {/* ══ STEP 1 — PROFILE ══ */}
            {step === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                {/* Header */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Adım 1 / 3</p>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">Seni Tanıyalım</h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Rolüne göre AI farklı bir dil ve öneri seti kullanır.
                  </p>
                </div>

                <Field label="Ad Soyad" required>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ayşe Yılmaz"
                    className={inputCls}
                    autoFocus
                  />
                </Field>

                <Field label="Pozisyonun nedir?" hint="— isteğe bağlı">
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((r) => {
                      const isSelected = role === r.key;
                      return (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRole(role === r.key ? "" : r.key)}
                          className={`group relative flex flex-col gap-2.5 rounded-2xl border-2 p-4 text-left transition-all duration-150 ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-background hover:border-border/80 hover:bg-muted/30"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                              <CheckIcon className="h-2.5 w-2.5" />
                            </span>
                          )}
                          <span className={`transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                            {r.icon}
                          </span>
                          <div>
                            <p className={`text-sm font-semibold leading-none ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {r.label}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground leading-snug">{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {error && <ErrorBanner message={error} />}

                <LaunchButton type="submit" tone="primary" disabled={loading} className="w-full">
                  {loading ? "Kaydediliyor..." : "Devam Et →"}
                </LaunchButton>
              </form>
            )}

            {/* ══ STEP 2 — WORKSPACE ══ */}
            {step === "workspace" && (
              <form onSubmit={handleWorkspaceSubmit} className="space-y-7">
                {/* Header */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Adım 2 / 3</p>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">Şirketini Kur</h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    AI, sektörüne ve iş modelini öğrenerek sana özel içgörüler üretir.
                  </p>
                </div>

                <Field label="Şirket / Ürün Adı" required>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className={inputCls}
                    autoFocus
                  />
                </Field>

                <Field label="Sektör" hint="— birden fazla seçebilirsin">
                  <TagSelect
                    entries={SECTOR_ENTRIES}
                    selected={industries}
                    onChange={setIndustries}
                    placeholder="Hangi sektörde çalışıyorsunuz? SaaS, FinTech..."
                  />
                </Field>

                <Field label="İş Modeli" hint="— bir tane seç">
                  <SingleDropdown
                    entries={BUSINESS_MODEL_ENTRIES}
                    value={businessModel}
                    onChange={setBusinessModel}
                    placeholder="Nasıl para kazanıyorsunuz?"
                  />
                </Field>

                <Field label="Platform" hint="— maks 2">
                  <MultiDropdown
                    entries={PLATFORM_ENTRIES}
                    selected={platforms}
                    onChange={setPlatforms}
                    placeholder="Ürününüz nerede çalışıyor?"
                    max={2}
                  />
                </Field>

                <Field label="Büyüme Aşaması">
                  <SingleDropdown
                    entries={STAGE_ENTRIES}
                    value={stage}
                    onChange={setStage}
                    placeholder="Şu anki aşamanız nedir?"
                  />
                </Field>

                {error && <ErrorBanner message={error} />}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("profile")}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/40 disabled:opacity-50"
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                      <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Geri
                  </button>
                  <LaunchButton type="submit" tone="primary" disabled={loading} className="flex-1">
                    {loading ? "Oluşturuluyor..." : "Workspace Oluştur →"}
                  </LaunchButton>
                </div>
              </form>
            )}

            {/* ══ STEP 3 — DETAILS ══ */}
            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-7">
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Adım 3 / 3</p>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Opsiyonel
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">AI&apos;ı Eğit</h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    İstersen atlayabilirsin — her zaman ayarlardan tamamlayabilirsin.
                  </p>
                </div>

                <Field label="Hedef Kitle">
                  <SingleDropdown
                    entries={TARGET_AUDIENCE_ENTRIES}
                    value={targetAudience}
                    onChange={setTargetAudience}
                    placeholder="Kime satıyorsunuz?"
                    searchable
                  />
                </Field>

                <Field label="Takım Büyüklüğü">
                  <SingleDropdown
                    entries={TEAM_SIZE_ENTRIES}
                    value={teamSize}
                    onChange={setTeamSize}
                    placeholder="Kaç kişisiniz?"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Kullanıcı Sayısı">
                    <SingleDropdown
                      entries={TRACTION_LEVEL_ENTRIES}
                      value={tractionLevel}
                      onChange={setTractionLevel}
                      placeholder="Mevcut kullanıcı?"
                    />
                  </Field>
                  <Field label="Gelir (MRR)">
                    <SingleDropdown
                      entries={REVENUE_LEVEL_ENTRIES}
                      value={revenueLevel}
                      onChange={setRevenueLevel}
                      placeholder="Aylık gelir?"
                    />
                  </Field>
                </div>

                <Field label="Birincil Büyüme Kanalı">
                  <SingleDropdown
                    entries={GROWTH_CHANNEL_ENTRIES}
                    value={growthChannel}
                    onChange={setGrowthChannel}
                    placeholder="Nasıl büyüyorsunuz?"
                    searchable
                  />
                </Field>

                <Field label="Regülasyon Gereksinimleri">
                  <MultiDropdown
                    entries={COMPLIANCE_ENTRIES}
                    selected={compliance}
                    onChange={setCompliance}
                    placeholder="GDPR, HIPAA, SOC 2..."
                  />
                </Field>

                {/* Divider */}
                <div className="h-px bg-border" />

                <Field label="Ana Rakipler" hint="— maks 3">
                  <div className="space-y-2.5">
                    {competitors.map((c, i) => (
                      <div key={i} className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-xs font-medium text-muted-foreground">
                          {i + 1}.
                        </span>
                        <input
                          type="text"
                          value={c}
                          onChange={(e) => {
                            const n = [...competitors];
                            n[i] = e.target.value;
                            setCompetitors(n);
                          }}
                          placeholder={`Örn. ${["Notion", "Linear", "Slack"][i]}`}
                          className="w-full rounded-xl border border-border bg-background py-3 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </Field>

                <Field label="Değer Önermesi (UVP)" hint={`${uvp.length} / 280`}>
                  <textarea
                    value={uvp}
                    onChange={(e) => setUvp(e.target.value.slice(0, 280))}
                    placeholder="Ürününüz müşterinize tek cümlede ne vadediyor?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                  />
                </Field>

                <Field label="Website">
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-muted-foreground">
                      https://
                    </span>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="acme.com"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-16 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
                    />
                  </div>
                </Field>

                <div className="flex flex-col gap-3 pt-1">
                  <LaunchButton type="submit" tone="primary" disabled={loading} className="w-full">
                    {loading ? "Kaydediliyor..." : "Hadi Başlayalım →"}
                  </LaunchButton>
                  <button
                    type="button"
                    onClick={() => router.push("/app/new")}
                    disabled={loading}
                    className="w-full rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    Şimdilik atla, sonra tamamlarım
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
