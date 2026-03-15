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
  Share2 
} from "lucide-react";

interface GrowthFunnelCardsProps {
  latestData: GrowthMetric;
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

export function GrowthFunnelCards({ latestData, config, className }: GrowthFunnelCardsProps) {
  const formatNumber = (num: number) => new Intl.NumberFormat("tr-TR").format(num);
  const formatPercent = (num: number | undefined) => (num === undefined || isNaN(num) ? "0%" : `${num.toFixed(1)}%`);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
          Büyüme Kanalları & Dönüşüm
        </p>
        <h2 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground">
          Haftalık {config.interval === "weekly" ? "Hafta" : "Ay"} {latestData.week} Özeti
        </h2>
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
