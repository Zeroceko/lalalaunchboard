"use client";

import React, { useState } from "react";
import { 
  LaunchPanel, 
  LaunchButton, 
  LaunchInput, 
  LaunchChoiceCard,
  LaunchBadge
} from "@/components/ui/LaunchKit";
import { 
  Calendar, 
  Settings2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  LayoutDashboard,
  Target
} from "lucide-react";

export type GrowthInterval = "weekly" | "monthly";

export type GrowthConfig = {
  interval: GrowthInterval;
  metricNames: {
    awareness: string;
    acquisition: string;
    activation: string;
    retention: string;
    referral: string;
    revenue: string;
  };
  targetGrowth: number;
};

/* ── Internal Field Row (Settings Style) ── */
function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-6 py-5 border-b border-[hsl(var(--border)/0.4)] last:border-0">
      <div className="pt-0.5">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ── Internal Section Header (Settings Style) ── */
function SectionHeader({ icon: Icon, title, description, badge }: { icon: any; title: string; description: string; badge?: string }) {
  return (
    <div className="flex items-start gap-3.5 pb-6 border-b border-[hsl(var(--border)/0.5)] mb-2">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[hsl(var(--border)/0.5)] bg-muted/60 text-muted-foreground">
        <Icon size={16} />
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          {badge && <LaunchBadge tone="brand" className="text-[9px] px-2 py-0">{badge}</LaunchBadge>}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface GrowthSetupFlowProps {
  onComplete: (config: GrowthConfig) => void;
}

export function GrowthSetupFlow({ onComplete }: GrowthSetupFlowProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<GrowthConfig>({
    interval: "weekly",
    metricNames: {
      awareness: "Awareness",
      acquisition: "Acquisition",
      activation: "Activation",
      retention: "Retention",
      referral: "Referral",
      revenue: "Revenue",
    },
    targetGrowth: 5
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleMetricNameChange = (key: keyof GrowthConfig["metricNames"], value: string) => {
    setConfig(prev => ({
      ...prev,
      metricNames: {
        ...prev.metricNames,
        [key]: value
      }
    }));
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <LaunchPanel tone="tint" className="w-full max-w-2xl border-[hsl(var(--border)/0.55)] p-0 overflow-hidden shadow-lg">
        
        {/* Header (Internal Style) */}
        <div className="bg-muted/30 px-8 py-5 border-b border-[hsl(var(--border)/0.55)] flex items-center justify-between">
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
               <Target className="w-4 h-4 text-primary" />
               Growth Engine Setup
            </h1>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               Step {step} of 3
            </span>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <SectionHeader 
                icon={Calendar} 
                title="Tracking Rhythm" 
                description="Select how often you want to log and visualize your growth data."
                badge="Haftalık/Aylık"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
                <LaunchChoiceCard
                  label="Weekly Rhythm"
                  hint="Ideal for early-stage startups tracking rapid iterations."
                  selected={config.interval === "weekly"}
                  onSelect={() => setConfig(prev => ({ ...prev, interval: "weekly" }))}
                />
                <LaunchChoiceCard
                  label="Monthly Rhythm"
                  hint="Best for established products focusing on long-term trends."
                  selected={config.interval === "monthly"}
                  onSelect={() => setConfig(prev => ({ ...prev, interval: "monthly" }))}
                  tone="clay"
                />
              </div>

              <div className="pt-10 flex justify-end">
                <LaunchButton onClick={nextStep} className="gap-2 px-8 rounded-xl h-11">
                  Metrik Tanımlarına Geç <ArrowRight className="w-4 h-4" />
                </LaunchButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <SectionHeader 
                icon={Settings2} 
                title="Metric Definitions" 
                description="Customize the names of each AARRR stage to match your product&apos;s specific goals."
              />

              <div className="divide-y divide-[hsl(var(--border)/0.4)]">
                <FieldRow label="Awareness" hint="How do people first hear about you?">
                  <LaunchInput 
                    placeholder="e.g. Website Visits"
                    value={config.metricNames.awareness} 
                    onChange={(e) => handleMetricNameChange("awareness", e.target.value)}
                    className="max-w-md"
                  />
                </FieldRow>
                <FieldRow label="Acquisition" hint="Who is actually checking you out?">
                  <LaunchInput 
                    placeholder="e.g. Signups"
                    value={config.metricNames.acquisition} 
                    onChange={(e) => handleMetricNameChange("acquisition", e.target.value)}
                    className="max-w-md"
                  />
                </FieldRow>
                <FieldRow label="Activation" hint="When do they see the core value?">
                  <LaunchInput 
                    placeholder="e.g. First Content Created"
                    value={config.metricNames.activation} 
                    onChange={(e) => handleMetricNameChange("activation", e.target.value)}
                    className="max-w-md"
                  />
                </FieldRow>
                <FieldRow label="Retention" hint="How many are coming back?">
                  <LaunchInput 
                    placeholder="e.g. 30-Day Active Users"
                    value={config.metricNames.retention} 
                    onChange={(e) => handleMetricNameChange("retention", e.target.value)}
                    className="max-w-md"
                  />
                </FieldRow>
                <FieldRow label="Referral" hint="Are they inviting others?">
                  <LaunchInput 
                    placeholder="e.g. Invites Sent"
                    value={config.metricNames.referral} 
                    onChange={(e) => handleMetricNameChange("referral", e.target.value)}
                    className="max-w-md"
                  />
                </FieldRow>
                <FieldRow label="Revenue" hint="What is the financial metric?">
                  <LaunchInput 
                    placeholder="e.g. Monthly Recurring Revenue ($)"
                    value={config.metricNames.revenue} 
                    onChange={(e) => handleMetricNameChange("revenue", e.target.value)}
                    className="max-w-md"
                  />
                </FieldRow>
                <FieldRow label="Target Growth (%)" hint="What is your desired week-over-week growth goal?">
                  <div className="flex items-center gap-4">
                    <LaunchInput 
                      type="number"
                      placeholder="e.g. 5"
                      value={config.targetGrowth} 
                      onChange={(e) => setConfig(prev => ({ ...prev, targetGrowth: Number(e.target.value) }))}
                      className="max-w-[120px]"
                    />
                    <span className="text-sm font-bold text-primary">%</span>
                  </div>
                </FieldRow>
              </div>

              <div className="pt-10 flex items-center justify-between">
                <LaunchButton tone="subtle" onClick={prevStep} className="rounded-xl">Geri</LaunchButton>
                <LaunchButton onClick={nextStep} className="gap-2 px-8 rounded-xl h-11">
                  Tamamla <ArrowRight className="w-4 h-4" />
                </LaunchButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                 <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Ready to Launch Growth OS</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                   Your {config.interval} tracking is configured. You can now start logging metrics and visualizing your product&apos;s journey.
                </p>
              </div>

              <div className="pt-6">
                <LaunchButton onClick={() => onComplete(config)} className="w-full gap-2 h-12 text-base rounded-[1rem] shadow-[0_8px_30px_hsl(var(--primary)/0.25)]">
                  <LayoutDashboard className="w-4 h-4" />
                  Paneli Görüntüle
                </LaunchButton>
              </div>
            </div>
          )}
        </div>
      </LaunchPanel>
    </div>
  );
}
