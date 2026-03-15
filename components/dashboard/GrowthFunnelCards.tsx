import React from "react";
import { type GrowthMetric } from "@/lib/data/growth-metrics";
import { type GrowthConfig } from "./GrowthSetupFlow";
import { LaunchBadge } from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  Eye, 
  Download, 
  Zap, 
  RotateCcw, 
  Share2,
  TrendingUp 
} from "lucide-react";

interface GrowthFunnelCardsProps {
  latestData: GrowthMetric;
  allData: GrowthMetric[];
  config: GrowthConfig;
  className?: string;
}

const funnelStages = [
  { id: "awareness", label: "Awareness", icon: Eye, color: "hsl(221,84%,54%)" },
  { id: "acquisition", label: "Acquisition", icon: Download, color: "hsl(265,80%,58%)", convKey: "toAcquisition" },
  { id: "activation", label: "Activation", icon: Zap, color: "hsl(152,58%,42%)", convKey: "toActivation" },
  { id: "retention", label: "Retention", icon: RotateCcw, color: "hsl(38,92%,52%)", convKey: "toRetention" },
  { id: "referral", label: "Referral", icon: Share2, color: "hsl(350,78%,56%)", convKey: "toReferral" },
];

export function GrowthFunnelCards({ latestData, allData, config, className }: GrowthFunnelCardsProps) {
  const formatNumber = (num: number) => new Intl.NumberFormat("tr-TR").format(num);
  const formatPercent = (num: number | undefined) => (num === undefined || isNaN(num) ? "0%" : `${num.toFixed(1)}%`);

  // Calculate actual growth (Acquisition) vs previous period
  const getGrowthStats = () => {
    const currentIndex = allData.findIndex(d => d.week === latestData.week);
    if (currentIndex <= 0) return null;
    
    const currentVal = latestData.acquisition;
    const previousVal = allData[currentIndex - 1].acquisition;
    
    if (previousVal === 0) return null;
    
    const actualGrowth = ((currentVal - previousVal) / previousVal) * 100;
    const isTargetMet = actualGrowth >= config.targetGrowth;
    
    return { actualGrowth, isTargetMet };
  };

  const growthStats = getGrowthStats();

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
            Büyüme Kanalları & Dönüşüm
          </p>
          <h2 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground">
            {config.interval === "weekly" ? "Haftalık" : "Aylık"} {latestData.week} Özeti
          </h2>
        </div>

        {growthStats && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-700">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Hedef Büyüme</span>
              <span className="text-[11px] font-black text-primary">%{config.targetGrowth}</span>
            </div>
            <div className={cn(
              "flex flex-col items-center justify-center rounded-xl border px-3 py-1.5 backdrop-blur-sm",
              growthStats.isTargetMet 
                ? "border-success/30 bg-success/5 text-success shadow-[0_4px_12px_hsl(var(--success)/0.1)]" 
                : "border-[hsl(var(--border)/0.5)] bg-muted/20 text-muted-foreground"
            )}>
              <span className="text-[9px] font-bold uppercase tracking-wider">Gerçekleşen</span>
              <div className="flex items-center gap-1">
                <TrendingUp className={cn("w-3 h-3", growthStats.actualGrowth < 0 && "rotate-180")} />
                <span className="text-xs font-black">%{growthStats.actualGrowth.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {funnelStages.map((stage, index) => {
          const Icon = stage.icon;
          const value = latestData[stage.id as keyof GrowthMetric] as number;
          const conversion = stage.convKey ? latestData.conversions[stage.convKey as keyof typeof latestData.conversions] : null;

          return (
            <div key={stage.id} className="group relative rounded-[1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-4 backdrop-blur-sm transition hover:bg-[hsl(var(--card))]">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-0.5">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                    {stage.label}
                  </p>
                  <p className="text-[1.4rem] font-black tracking-[-0.06em] text-foreground">
                    {formatNumber(value)}
                  </p>
                </div>
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border)/0.5)] bg-muted/30"
                  style={{ color: stage.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                      {config.metricNames[stage.id as keyof GrowthConfig["metricNames"]]}
                   </span>
                   {conversion !== null && (
                     <span className="rounded-full bg-[hsl(var(--primary)/0.08)] px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--primary))]">
                       {formatPercent(conversion)}
                     </span>
                   )}
                </div>
                {/* Visual Progress Bar (Dashboard style) */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted)/0.5)]">
                  <div 
                    className="h-full rounded-full transition-all" 
                    style={{ 
                      width: conversion !== null ? `${Math.min(100, conversion)}%` : "100%", 
                      background: stage.color 
                    }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
