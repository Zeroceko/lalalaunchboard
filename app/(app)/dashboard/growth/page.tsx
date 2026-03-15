"use client";

import React, { useState, useMemo } from "react";
import { 
  LaunchBadge, 
  LaunchPanel, 
  LaunchButton,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { growthMetrics as initialData, type GrowthMetric } from "@/lib/data/growth-metrics";
import { GrowthFunnelCards } from "@/components/dashboard/GrowthFunnelCards";
import { GrowthTrendChart } from "@/components/dashboard/GrowthTrendChart";
import { GrowthDataTable } from "@/components/dashboard/GrowthDataTable";
import { GrowthInputForm } from "@/components/dashboard/GrowthInputForm";
import { GrowthSetupFlow, type GrowthConfig } from "@/components/dashboard/GrowthSetupFlow";
import { Plus, Calendar, Filter, Share2, Download as DownloadIcon, Zap, Target, TrendingUp, Info } from "lucide-react";
import Link from "next/link";

export default function GrowthDashboardPage() {
  const [data, setData] = useState<GrowthMetric[]>(initialData);
  const [config, setConfig] = useState<GrowthConfig | null>(null);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");

  const handleSetupComplete = (newConfig: GrowthConfig) => {
    setConfig(newConfig);
  };

  // Calculate conversions for new data entries
  const calculateWithConversions = (newItem: Omit<GrowthMetric, "conversions">): GrowthMetric => {
    return {
      ...newItem,
      conversions: {
        toAcquisition: (newItem.acquisition / (newItem.awareness || 1)) * 100,
        toActivation: (newItem.activation / (newItem.acquisition || 1)) * 100,
        toRetention: (newItem.retention / (newItem.activation || 1)) * 100,
        toReferral: (newItem.referral / (newItem.retention || 1)) * 100,
        toRevenue: (newItem.revenue / (newItem.referral || 1)) * 100,
      }
    };
  };

  const handleSaveMetrics = (newMetrics: Omit<GrowthMetric, "conversions">) => {
    const calculated = calculateWithConversions(newMetrics);
    setData(prev => {
      const existingIndex = prev.findIndex(item => item.week === calculated.week);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = calculated;
        return updated;
      }
      return [...prev, calculated].sort((a, b) => a.week - b.week);
    });
    setIsInputOpen(false);
  };

  const activeData = useMemo(() => {
    if (dateFilter === "last4") return data.slice(-4);
    return data;
  }, [data, dateFilter]);

  const latestData = useMemo(() => {
    const sorted = [...activeData].sort((a, b) => b.week - a.week);
    return sorted[0];
  }, [activeData]);

  if (!config) {
    return <GrowthSetupFlow onComplete={handleSetupComplete} />;
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      {/* ── Internal Page Header (Matching Dashboard) ── */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[hsl(var(--border)/0.55)] bg-[hsl(var(--background)/0.9)] px-6 py-4 backdrop-blur-md">
        <div>
          <h1 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Growth OS
          </h1>
          <p className="mt-0.5 text-[11.5px] text-[hsl(var(--muted-foreground))] uppercase tracking-tight font-medium">
             Product Metrics · {config.interval.toUpperCase()} Tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Internal-style Control Bar items integrated into header */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-muted/30 rounded-lg mr-2">
             <button 
               onClick={() => setDateFilter("all")}
               className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${dateFilter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
             >
               TÜMÜ
             </button>
             <button 
               onClick={() => setDateFilter("last4")}
               className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${dateFilter === "last4" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
             >
               SON 4 {config.interval === "weekly" ? "HAFTA" : "AY"}
             </button>
          </div>
          <button 
            onClick={() => setIsInputOpen(true)}
            className="flex items-center gap-1.5 rounded-[0.55rem] bg-[hsl(var(--primary))] px-3.5 py-1.5 text-[0.8rem] font-semibold text-white transition hover:bg-[hsl(var(--primary-strong))]"
          >
            <Plus className="w-3.5 h-3.5" />
            Veri Gir
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-[0.55rem] border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.8)] text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted)/0.7)]">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 max-w-[1600px] mx-auto">
        
        {/* ════════════════════════════════════════════
            SECTION 1: Growth Funnel Analysis
        ════════════════════════════════════════════ */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {latestData ? (
             <GrowthFunnelCards latestData={latestData} config={config} />
          ) : (
            <div className="p-20 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/20">
              <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">Büyüme verisi girişi yapın.</p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           {/* ════════════════════════════════════════════
               SECTION 2: Trend Analysis (Main Chart)
           ════════════════════════════════════════════ */}
           <div className="xl:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Büyüme Trend Analizi</h3>
                 </div>
              </div>
              <LaunchPanel className="p-6 border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] min-h-[440px]">
                <GrowthTrendChart data={data} config={config} />
              </LaunchPanel>
           </div>

           {/* ════════════════════════════════════════════
               SECTION 3: Quick Insights / Action Center
           ════════════════════════════════════════════ */}
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              
              <div className="space-y-4">
                 <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Quick Insights</h3>
                 
                 <div className="space-y-3">
                    <div className="flex items-start gap-4 rounded-[1.25rem] border border-[hsl(var(--border)/0.5)] bg-primary/[0.03] p-4 transition hover:bg-primary/[0.05]">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Zap className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-foreground">Aktivasyon Güçlü</p>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                             Kayıt olan kullanıcıların %{latestData ? latestData.conversions.toActivation.toFixed(0) : 0}&apos;si ana değere ulaşıyor. 
                          </p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-[1.25rem] border border-[hsl(var(--border)/0.5)] bg-muted/10 p-4 transition hover:bg-muted/20">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border">
                          <Info className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-foreground">Yeni Kanallar Dene</p>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                             Referans oranınız benchmarking değerlerinin altında. Viral döngüleri optimize edin.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action items from internal dash logic */}
              <div className="rounded-[1.25rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-5">
                 <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                    Stratejik Adımlar
                 </p>
                 <div className="space-y-2">
                    {[
                      { done: false, label: "A/B Testi: Kayıt Sayfası", urgent: true },
                      { done: false, label: "Referans Programı Kurgusu" },
                      { done: true, label: "Analytics Entegrasyonu" }
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
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 4: Raw Data & History
        ════════════════════════════════════════════ */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Geçmiş Veri Kayıtları</h3>
           </div>
           <GrowthDataTable data={data} config={config} />
        </section>

      </div>

      {/* Input Overlay */}
      {isInputOpen && (
        <GrowthInputForm 
          onSave={handleSaveMetrics} 
          onCancel={() => setIsInputOpen(false)} 
          initialWeek={data.length > 0 ? Math.max(...data.map(d => d.week)) + 1 : 1}
          config={config}
        />
      )}
    </div>
  );
}
