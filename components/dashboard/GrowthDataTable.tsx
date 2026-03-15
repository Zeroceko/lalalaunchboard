import React from "react";
import { type GrowthMetric } from "@/lib/data/growth-metrics";
import { type GrowthConfig } from "./GrowthSetupFlow";
import { LaunchPanel } from "@/components/ui/LaunchKit";

interface GrowthDataTableProps {
  data: GrowthMetric[];
  config: GrowthConfig;
}

export function GrowthDataTable({ data, config }: GrowthDataTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("tr-TR").format(num);
  };

  const formatPercent = (num: number | undefined) => {
    if (num === undefined || isNaN(num)) return "0%";
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className="rounded-[1.25rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] overflow-hidden">
      {/* Scrollable area with max height to save space */}
      <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <table className="w-full text-left text-[11px]">
          <thead className="sticky top-0 z-20 bg-[hsl(var(--card))] text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-b border-[hsl(var(--border)/0.55)]">
            <tr>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm">Periyot</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm">{config.metricNames.awareness}</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm border-r border-[hsl(var(--border))/0.3]">Conv.</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm">{config.metricNames.acquisition}</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm border-r border-[hsl(var(--border))/0.3]">Conv.</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm">{config.metricNames.activation}</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm border-r border-[hsl(var(--border))/0.3]">Conv.</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm">{config.metricNames.retention}</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm border-r border-[hsl(var(--border))/0.3]">Conv.</th>
               <th className="px-5 py-3 whitespace-nowrap bg-[hsl(var(--card)/0.95)] backdrop-blur-sm">{config.metricNames.referral}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))/0.3]">
            {data.slice().reverse().map((row) => (
              <tr key={row.week} className="hover:bg-muted/10 transition-colors">
                <td className="px-5 py-2.5 text-foreground font-semibold">
                   {config.interval === "weekly" ? "Hafta" : "Ay"} {row.week}
                </td>
                
                <td className="px-5 py-2.5 text-foreground/80">{formatNumber(row.awareness)}</td>
                <td className="px-5 py-2.5 text-[hsl(var(--primary))] font-bold border-r border-[hsl(var(--border))/0.3]">
                   {formatPercent(row.conversions.toAcquisition)}
                </td>
                
                <td className="px-5 py-2.5 text-foreground/80">{formatNumber(row.acquisition)}</td>
                <td className="px-5 py-2.5 text-[hsl(var(--primary))] font-bold border-r border-[hsl(var(--border))/0.3]">
                   {formatPercent(row.conversions.toActivation)}
                </td>
                
                <td className="px-5 py-2.5 text-foreground/80">{formatNumber(row.activation)}</td>
                <td className="px-5 py-2.5 text-[hsl(var(--primary))] font-bold border-r border-[hsl(var(--border))/0.3]">
                   {formatPercent(row.conversions.toRetention)}
                </td>
 
                 <td className="px-5 py-2.5 text-foreground/80">{formatNumber(row.retention)}</td>
                 <td className="px-5 py-2.5 text-[hsl(var(--primary))] font-bold border-r border-[hsl(var(--border))/0.3]">
                   {formatPercent(row.conversions.toReferral)}
                </td>
 
                 <td className="px-5 py-2.5 text-foreground/80">{formatNumber(row.referral)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
