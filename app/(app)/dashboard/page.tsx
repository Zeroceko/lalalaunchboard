import Link from "next/link";

import { AppList } from "@/components/dashboard/AppList";
import { launchButtonStyles } from "@/components/ui/LaunchKit";
import { requireSessionContext } from "@/lib/auth/session";
import type { App } from "@/types";

// ── Inline SVG Sparkline ─────────────────────────────────────────────────────
function Sparkline({
  data,
  color = "hsl(var(--primary))",
  height = 40,
  width = 120
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const polyline = pts.join(" ");
  // Area fill
  const area = `${pts[0].split(",")[0]},${height} ${polyline} ${pts[pts.length - 1].split(",")[0]},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color.replace(/[^a-z0-9]/gi, "")})`} />
      <polyline points={polyline} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBar({
  data,
  color = "hsl(var(--primary))",
  height = 40,
  width = 120
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  const max = Math.max(...data);
  const barW = (width - (data.length - 1) * 3) / data.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden>
      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * (height - 4));
        const x = i * (barW + 3);
        return (
          <rect
            key={i}
            x={x.toFixed(1)}
            y={(height - bh - 2).toFixed(1)}
            width={barW.toFixed(1)}
            height={bh.toFixed(1)}
            rx="2"
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.5}
          />
        );
      })}
    </svg>
  );
}

// ── Retention Heatmap strip ──────────────────────────────────────────────────
function RetentionStrip({ values }: { values: number[] }) {
  return (
    <div className="flex gap-1">
      {values.map((v, i) => {
        const opacity = v / 100;
        return (
          <div
            key={i}
            className="group relative flex-1 rounded-[0.25rem] py-1.5 text-center"
            style={{ background: `hsl(var(--primary)/${opacity.toFixed(2)})` }}
          >
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-foreground px-1 py-0.5 text-[9px] font-bold text-background opacity-0 transition-opacity group-hover:opacity-100">
              {v}%
            </span>
            <span className="text-[9px] font-semibold" style={{ color: v > 50 ? "white" : "hsl(var(--foreground))" }}>
              {v}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Funnel step ──────────────────────────────────────────────────────────────
function FunnelStep({
  label,
  count,
  pct,
  color,
  isLast = false
}: {
  label: string;
  count: string;
  pct: number;
  color: string;
  isLast?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold" style={{ color }}>{count}</span>
      </div>
      <div className="h-6 overflow-hidden rounded-[0.35rem] bg-[hsl(var(--muted)/0.5)]">
        <div
          className="h-full rounded-[0.35rem] transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {!isLast && (
        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
          → {pct.toFixed(0)}% devam edi
        </p>
      )}
    </div>
  );
}

// ── Sample data ───────────────────────────────────────────────────────────────
const DAU_DATA = [820, 910, 870, 950, 1020, 990, 1080, 1140, 1060, 1180, 1220, 1310, 1290, 1380];
const MAU_DATA = [5200, 5800, 6100, 6700, 7200, 7600, 8100, 8700, 9200, 9800, 10400, 10900, 11500, 12100];
const MRR_DATA = [1200, 1450, 1800, 2100, 2500, 2800, 3300, 3700, 4100, 4500, 5100, 5600, 6200, 6800];
const INSTALL_DATA = [310, 420, 390, 510, 580, 620, 700, 760, 740, 810, 870, 930, 990, 1040];
const REVIEW_DATA = [12, 18, 14, 22, 28, 24, 31, 38, 35, 42, 48, 44, 53, 57];
const CHURN_DATA = [5.2, 4.8, 4.5, 4.1, 3.9, 3.7, 3.5, 3.3, 3.2, 3.0, 2.9, 2.8, 2.7, 2.6];

const RETENTION = {
  d1: 68,
  d3: 51,
  d7: 38,
  d14: 29,
  d30: 22
};

const FUNNEL = [
  { label: "Uygulama açıldı", count: "12 100", pct: 100, color: "hsl(221,84%,54%)" },
  { label: "Kayıt başladı", count: "5 280", pct: 43.6, color: "hsl(265,80%,58%)" },
  { label: "Kayıt tamamlandı", count: "3 110", pct: 58.9, color: "hsl(152,58%,42%)" },
  { label: "İlk aksiyon", count: "2 040", pct: 65.6, color: "hsl(38,92%,52%)" },
  { label: "Gün-7 aktif", count: "780", pct: 38.2, color: "hsl(350,78%,56%)" }
];

const LAUNCH_PHASES = [
  { label: "Pre-launch hazırlık", start: 0, dur: 45, color: "hsl(221,84%,54%)" },
  { label: "Launch haftası", start: 45, dur: 7, color: "hsl(38,92%,52%)" },
  { label: "Growth Phase 1", start: 52, dur: 30, color: "hsl(152,58%,42%)" },
  { label: "Growth Phase 2", start: 82, dur: 18, color: "hsl(265,80%,58%)" }
];

const PLATFORM_TONE: Record<App["platform"], string> = {
  ios: "hsl(350,78%,56%)",
  android: "hsl(152,58%,42%)",
  web: "hsl(221,84%,54%)"
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  delta,
  positive,
  chart,
  chartColor,
  chartType = "line"
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  chart: number[];
  chartColor?: string;
  chartType?: "line" | "bar";
}) {
  const color = chartColor ?? "hsl(var(--primary))";
  return (
    <div className="flex flex-col gap-3 rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-4 backdrop-blur-sm glow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
            {label}
          </p>
          <p className="text-[1.55rem] font-black tracking-[-0.06em] text-foreground">
            {value}
          </p>
        </div>
        <span
          className={`mt-0.5 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${positive ? "bg-[hsl(152,58%,42%/0.12)] text-[hsl(152,58%,38%)]" : "bg-[hsl(350,78%,56%/0.12)] text-[hsl(350,78%,50%)]"}`}
        >
          {positive ? "↑" : "↓"} {delta}
        </span>
      </div>
      {chartType === "line" ? (
        <Sparkline data={chart} color={color} />
      ) : (
        <MiniBar data={chart} color={color} />
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const { supabase, user } = await requireSessionContext();
  let apps: App[] = [];
  let canCreate = true;

  try {
    const { data } = await supabase
      .from("apps")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    apps = (data as App[]) ?? [];
  } catch {
    /* silently fall back to sample UI */
  }

  // Pick primary app (first or synthetic)
  const primaryApp: App | null = apps[0] ?? {
    id: "demo",
    user_id: user.id,
    name: "FocusFlow",
    platform: "ios" as const,
    launch_date: "2026-04-14",
    created_at: new Date().toISOString()
  };

  const daysLeft = Math.ceil(
    (new Date(primaryApp.launch_date).getTime() - Date.now()) / 86400000
  );

  return (
    <div className="h-full overflow-y-auto bg-background">

      {/* ── Page header ── */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[hsl(var(--border)/0.55)] bg-[hsl(var(--background)/0.9)] px-6 py-4 backdrop-blur-md">
        <div>
          <h1 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">
            {primaryApp.name} · {primaryApp.platform.toUpperCase()} · {daysLeft > 0 ? `${daysLeft} gün kaldı` : "Yayında 🚀"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/app/${primaryApp.id}`} className="rounded-[0.55rem] border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.8)] px-3.5 py-1.5 text-[0.8rem] font-medium text-foreground transition hover:bg-[hsl(var(--muted)/0.7)]">
            Checklist
          </Link>
          <Link href="/app/new" className="flex items-center gap-1.5 rounded-[0.55rem] bg-[hsl(var(--primary))] px-3.5 py-1.5 text-[0.8rem] font-semibold text-white transition hover:bg-[hsl(var(--primary-strong))]">
            + Yeni Board
          </Link>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">

        {/* ════════════════════════════════════
            SECTION 1: Primary KPIs
        ════════════════════════════════════ */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
            Performans Metrikleri
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="DAU"
              value="1 380"
              delta="12.3% bu hafta"
              positive
              chart={DAU_DATA}
              chartColor="hsl(221,84%,58%)"
            />
            <KpiCard
              label="MAU"
              value="12 100"
              delta="8.7% bu ay"
              positive
              chart={MAU_DATA}
              chartColor="hsl(265,80%,60%)"
            />
            <KpiCard
              label="MRR"
              value="$6 800"
              delta="$600 ↑ vs geçen ay"
              positive
              chart={MRR_DATA}
              chartColor="hsl(152,58%,44%)"
            />
            <KpiCard
              label="Churn"
              value="2.6%"
              delta="0.1pp azaldı"
              positive
              chart={CHURN_DATA}
              chartColor="hsl(350,78%,56%)"
            />
          </div>
        </section>

        {/* ════════════════════════════════════
            SECTION 2: Acquisition
        ════════════════════════════════════ */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
            Edinim & Mağaza
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Günlük İndirme"
              value="1 040"
              delta="6.2% bu hafta"
              positive
              chart={INSTALL_DATA}
              chartColor="hsl(38,92%,52%)"
              chartType="bar"
            />
            <KpiCard
              label="Günlük Yorum"
              value="57"
              delta="8% ↑"
              positive
              chart={REVIEW_DATA}
              chartColor="hsl(38,92%,52%)"
            />
            {/* App Store Rating */}
            <div className="flex flex-col gap-3 rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-4">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  App Store Puanı
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[1.55rem] font-black tracking-[-0.06em] text-foreground">4.7</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="11" height="11" viewBox="0 0 14 14" fill={s <= 4 ? "hsl(38,92%,52%)" : "hsl(var(--muted))"} aria-hidden>
                        <path d="M7 1l1.76 3.57L13 5.24l-3 2.93.7 4.14L7 10.18l-3.7 2.13.7-4.14L1 5.24l4.24-.67L7 1z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">1 842 yorum · #12 Verimlilik</p>
              </div>
              <div className="space-y-1">
                {[
                  { stars: 5, pct: 64 },
                  { stars: 4, pct: 22 },
                  { stars: 3, pct: 9 },
                  { stars: 2, pct: 3 },
                  { stars: 1, pct: 2 }
                ].map((r) => (
                  <div key={r.stars} className="flex items-center gap-1.5">
                    <span className="w-2 text-right text-[9px] text-[hsl(var(--muted-foreground))]">{r.stars}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-[hsl(var(--muted)/0.5)] h-1.5">
                      <div className="h-full rounded-full bg-[hsl(38,92%,52%)]" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="w-6 text-[9px] text-[hsl(var(--muted-foreground))]">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NPS */}
            <div className="flex flex-col justify-between gap-3 rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-4">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">NPS Skoru</p>
                <p className="mt-1 text-[1.55rem] font-black tracking-[-0.06em] text-foreground">+52</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Mükemmel (50+ = Excellent)</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Promoters", pct: 67, color: "hsl(152,58%,42%)" },
                  { label: "Passives", pct: 18, color: "hsl(38,92%,52%)" },
                  { label: "Detractors", pct: 15, color: "hsl(350,78%,56%)" }
                ].map((g) => (
                  <div key={g.label} className="flex items-center gap-2">
                    <div className="w-16 text-[10px] text-[hsl(var(--muted-foreground))]">{g.label}</div>
                    <div className="flex-1 overflow-hidden rounded-full bg-[hsl(var(--muted)/0.5)] h-1.5">
                      <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
                    </div>
                    <span className="w-6 text-right text-[10px] font-semibold text-foreground">{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            SECTION 3: Retention + Funnel
        ════════════════════════════════════ */}
        <section className="grid gap-4 lg:grid-cols-2">

          {/* Retention */}
          <div className="rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  Retention Cohort
                </p>
                <p className="mt-0.5 text-[0.9rem] font-semibold text-foreground">
                  D1 → D30 yolculuğu
                </p>
              </div>
              <span className="rounded-full bg-[hsl(var(--primary)/0.1)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(var(--primary))]">
                Mart &apos;26
              </span>
            </div>

            {/* Day labels */}
            <div className="mb-1 flex gap-1 text-center">
              {["D1", "D3", "D7", "D14", "D30"].map((d) => (
                <div key={d} className="flex-1 text-[9.5px] font-semibold text-[hsl(var(--muted-foreground))]">{d}</div>
              ))}
            </div>
            <RetentionStrip values={[RETENTION.d1, RETENTION.d3, RETENTION.d7, RETENTION.d14, RETENTION.d30]} />

            {/* Interpretation */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "D1 (iyi: >60%)", val: `${RETENTION.d1}%`, good: RETENTION.d1 >= 60 },
                { label: "D7 (iyi: >30%)", val: `${RETENTION.d7}%`, good: RETENTION.d7 >= 30 },
                { label: "D30 (iyi: >15%)", val: `${RETENTION.d30}%`, good: RETENTION.d30 >= 15 }
              ].map((r) => (
                <div key={r.label} className={`rounded-[0.65rem] border p-2.5 text-center ${r.good ? "border-[hsl(152,58%,42%/0.3)] bg-[hsl(152,58%,42%/0.06)]" : "border-[hsl(var(--border)/0.5)]"}`}>
                  <p className={`text-[1rem] font-black tracking-[-0.04em] ${r.good ? "text-[hsl(152,58%,40%)]" : "text-[hsl(350,78%,54%)]"}`}>{r.val}</p>
                  <p className="mt-0.5 text-[9px] text-[hsl(var(--muted-foreground))]">{r.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[0.65rem] border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--muted)/0.3)] p-2.5">
              <p className="text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">
                <span className="font-semibold text-foreground">YC benchmark:</span> D7 &gt;30% = güçlü. D7 38% ile sektör ortalamasının üzerisindesin.
              </p>
            </div>
          </div>

          {/* Funnel */}
          <div className="rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
            <div className="mb-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                Aktivasyon Funneli
              </p>
              <p className="mt-0.5 text-[0.9rem] font-semibold text-foreground">
                İlk görünüm → Gün-7 aktif
              </p>
            </div>
            <div className="space-y-3">
              {FUNNEL.map((step, i) => (
                <FunnelStep
                  key={step.label}
                  label={step.label}
                  count={step.count}
                  pct={step.pct}
                  color={step.color}
                  isLast={i === FUNNEL.length - 1}
                />
              ))}
            </div>
            <div className="mt-4 rounded-[0.65rem] border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--muted)/0.3)] p-2.5">
              <p className="text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">
                <span className="font-semibold text-foreground">Aksiyon noktası:</span> Kayıt → İlk aksiyon oranı %65.6 — onboarding akışı güçlü. Gün-7 aktifliği artırmak için push bildirimi dene.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            SECTION 4: Revenue + Launch timeline
        ════════════════════════════════════ */}
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">

          {/* Revenue & unit economics */}
          <div className="rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  Gelir & Birim Ekonomileri
                </p>
                <p className="mt-0.5 text-[0.9rem] font-semibold text-foreground">MRR büyüme trendi</p>
              </div>
              <span className="rounded-full bg-[hsl(152,58%,42%/0.1)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(152,58%,40%)]">
                ↑ %9.7 MoM
              </span>
            </div>

            {/* Full-width sparkline */}
            <div className="w-full">
              <svg width="100%" viewBox="0 0 480 80" fill="none" aria-hidden className="overflow-visible">
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152,58%,42%)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="hsl(152,58%,42%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const W = 480; const H = 72; const pad = 4;
                  const min = Math.min(...MRR_DATA); const max = Math.max(...MRR_DATA);
                  const pts = MRR_DATA.map((v, i) => {
                    const x = (i / (MRR_DATA.length - 1)) * (W - 2);
                    const y = H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  });
                  const area = `${pts[0].split(",")[0]},${H} ${pts.join(" ")} ${pts[pts.length - 1].split(",")[0]},${H}`;
                  return (
                    <>
                      <polygon points={area} fill="url(#mrrGrad)" />
                      <polyline points={pts.join(" ")} stroke="hsl(152,58%,42%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Unit economics grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "ARR", val: "$81 600", sub: "Yıllık gelir" },
                { label: "ARPU", val: "$6.80", sub: "Kullanıcı başı" },
                { label: "LTV", val: "$261", sub: "12 ay ort." },
                { label: "CAC", val: "$42", sub: "Edinim maliyeti" }
              ].map((e) => (
                <div key={e.label} className="rounded-[0.75rem] border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.3)] p-3">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{e.label}</p>
                  <p className="mt-1 text-[1.1rem] font-black tracking-[-0.05em] text-foreground">{e.val}</p>
                  <p className="text-[9px] text-[hsl(var(--muted-foreground))]">{e.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[0.65rem] border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--muted)/0.3)] p-2.5">
              <p className="text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">
                <span className="font-semibold text-foreground">LTV/CAC: 6.2x</span> — Sağlıklı. YC ideal oran: 3x+. Hedef: 8x için CAC&apos;ı $35&apos;e indirmek.
              </p>
            </div>
          </div>

          {/* Control desk */}
          <div className="rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
            <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Bugünün Ajandası
            </p>

            {/* Launch countdown */}
            <div className="mb-4 overflow-hidden rounded-[0.85rem] bg-[linear-gradient(135deg,hsl(224,28%,9%),hsl(232,30%,12%))] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--surface-dark-muted))]">
                    {primaryApp.name}
                  </p>
                  <p className="mt-1 text-[1.4rem] font-black tracking-[-0.06em] text-white">
                    {daysLeft > 0 ? `${daysLeft} gün` : "Yayında!"}
                  </p>
                  <p className="text-[10px] text-[hsl(var(--surface-dark-muted))]">
                    Launch: {new Date(primaryApp.launch_date).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div
                  className="rounded-full border border-[hsl(var(--surface-dark-foreground)/0.15)] px-2 py-0.5 text-[9px] font-semibold text-[hsl(var(--surface-dark-muted))]"
                  style={{ borderColor: PLATFORM_TONE[primaryApp.platform] + "44", color: PLATFORM_TONE[primaryApp.platform] }}
                >
                  {primaryApp.platform.toUpperCase()}
                </div>
              </div>
              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-[9px] text-[hsl(var(--surface-dark-muted))]">
                  <span>Hazırlık</span><span>%68</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--surface-dark-foreground)/0.1)]">
                  <div className="h-full w-[68%] rounded-full bg-[hsl(var(--primary))]" />
                </div>
              </div>
            </div>

            {/* Action list */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                Önerilen adımlar
              </p>
              {[
                { done: true, label: "Store screenshot setini finalleştir" },
                { done: true, label: "App Store descripton copy'si onaylandı" },
                { done: false, label: "TestFlight beta grubuna gönder", urgent: true },
                { done: false, label: "Launch günü e-posta şablonu yaz", urgent: true },
                { done: false, label: "Product Hunt sayfasını oluştur" },
                { done: false, label: "Social announcement thread'ini kuyruğa al" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 rounded-[0.55rem] px-2.5 py-2 hover:bg-[hsl(var(--muted)/0.5)]">
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[0.3rem] border ${item.done ? "border-[hsl(152,58%,42%)] bg-[hsl(152,58%,42%)]" : item.urgent ? "border-[hsl(38,92%,52%)]" : "border-[hsl(var(--border)/0.7)]"}`}>
                    {item.done && (
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[11.5px] ${item.done ? "line-through text-[hsl(var(--muted-foreground)/0.5)]" : item.urgent ? "font-semibold text-foreground" : "text-[hsl(var(--muted-foreground))]"}`}>
                    {item.label}
                  </span>
                  {item.urgent && !item.done && (
                    <span className="ml-auto rounded-full bg-[hsl(38,92%,52%/0.15)] px-1.5 py-0.5 text-[8.5px] font-bold text-[hsl(38,88%,45%)]">
                      Bugün
                    </span>
                  )}
                </div>
              ))}
            </div>

            <Link href={`/app/${primaryApp.id}`} className={launchButtonStyles.primary + " mt-4 w-full justify-center text-xs"}>
              Tam checklist&apos;e git
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════
            SECTION 5: Launch Timeline & All Boards
        ════════════════════════════════════ */}
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">

          {/* Gantt-style launch phases */}
          <div className="rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
            <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Launch Zaman Çizelgesi
            </p>
            <p className="mb-5 text-[0.9rem] font-semibold text-foreground">Ürün yolculuğu — 100 günlük görünüm</p>

            <div className="space-y-3">
              {LAUNCH_PHASES.map((phase) => (
                <div key={phase.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground">{phase.label}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">{phase.dur} gün</span>
                  </div>
                  <div className="h-6 overflow-hidden rounded-[0.35rem] bg-[hsl(var(--muted)/0.4)]">
                    <div
                      className="h-full rounded-[0.35rem] flex items-center pl-2"
                      style={{
                        marginLeft: `${phase.start}%`,
                        width: `${phase.dur}%`,
                        background: phase.color,
                        opacity: 0.85
                      }}
                    >
                      <span className="text-[9px] font-semibold text-white truncate">{phase.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Day marker labels */}
            <div className="mt-2 flex justify-between text-[9px] text-[hsl(var(--muted-foreground))]">
              {["G0", "G25", "G50", "G75", "G100"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5 backdrop-blur-sm">
            <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Platform Dağılımı
            </p>
            <p className="mb-5 text-[0.9rem] font-semibold text-foreground">DAU platform kırılımı</p>

            <div className="space-y-3">
              {[
                { platform: "iOS", pct: 58, dau: "800", color: PLATFORM_TONE.ios },
                { platform: "Android", pct: 30, dau: "414", color: PLATFORM_TONE.android },
                { platform: "Web", pct: 12, dau: "166", color: PLATFORM_TONE.web }
              ].map((p) => (
                <div key={p.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground">{p.platform}</span>
                    <span className="font-semibold text-foreground">{p.dau} DAU · {p.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--muted)/0.5)]">
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[hsl(var(--border)/0.4)] pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                Tüm Boardlar
              </p>
              <AppList apps={apps.length > 0 ? apps : [primaryApp as App]} canCreateApp />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
