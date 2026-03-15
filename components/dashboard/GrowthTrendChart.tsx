"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { type GrowthMetric } from "@/lib/data/growth-metrics";
import { type GrowthConfig } from "./GrowthSetupFlow";
import { LaunchPanel } from "@/components/ui/LaunchKit";

interface GrowthTrendChartProps {
  data: GrowthMetric[];
  config: GrowthConfig;
}

export function GrowthTrendChart({ data, config }: GrowthTrendChartProps) {
  // Smart Filtering: Only show weeks that have at least one numeric value > 0
  const filteredData = data.filter(item => 
    item.awareness > 0 || 
    item.acquisition > 0 || 
    item.activation > 0 || 
    item.retention > 0 || 
    item.referral > 0
  );

  // Format data for Recharts
  const chartData = filteredData.map((item) => ({
    week: `W${item.week}`,
    [config.metricNames.awareness]: item.awareness,
    [config.metricNames.acquisition]: item.acquisition,
    [config.metricNames.activation]: item.activation,
    [config.metricNames.retention]: item.retention,
    [config.metricNames.referral]: item.referral,
  }));

  if (chartData.length === 0) {
    return (
      <LaunchPanel tone="subtle" className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No data logged yet. Start by logging your first week&apos;s metrics.</p>
      </LaunchPanel>
    );
  }

  return (
    <LaunchPanel tone="subtle" className="px-6 py-6 pb-2 border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] backdrop-blur-md">
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
          Büyüme Analizi
        </p>
        <h3 className="text-[0.9375rem] font-semibold tracking-[-0.025em] text-foreground">
          Performans Trendi ({config.interval === "weekly" ? "Haftalık" : "Aylık"})
        </h3>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorAwareness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAcquisition" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActivation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning-foreground))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--warning-foreground))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" vertical={false} />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground)/0.5)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground)/0.5)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} 
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "hsl(var(--card)/0.95)", 
                borderColor: "hsl(var(--border)/0.5)", 
                borderRadius: "16px",
                backdropFilter: "blur(12px)",
                boxShadow: "0 20px 40px hsl(var(--shadow-color)/0.15)"
              }}
              itemStyle={{ fontSize: "12px", padding: "2px 0" }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px", fontSize: "13px" }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
            />
            <Area 
              type="monotone" 
              dataKey={config.metricNames.awareness} 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAwareness)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey={config.metricNames.acquisition} 
              stroke="hsl(var(--info))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAcquisition)" 
              animationDuration={1500}
              animationBegin={200}
            />
            <Area 
              type="monotone" 
              dataKey={config.metricNames.activation} 
              stroke="hsl(var(--warning-foreground))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorActivation)" 
              animationDuration={1500}
              animationBegin={400}
            />
            <Area 
              type="monotone" 
              dataKey={config.metricNames.retention} 
              stroke="hsl(var(--success))" 
              strokeWidth={3}
              fillOpacity={0} 
              animationDuration={1500}
              animationBegin={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </LaunchPanel>
  );
}
