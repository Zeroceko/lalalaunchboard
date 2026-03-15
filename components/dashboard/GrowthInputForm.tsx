"use client";

import React, { useState } from "react";
import { 
  LaunchPanel, 
  LaunchButton, 
  LaunchInput, 
  LaunchNotice
} from "@/components/ui/LaunchKit";
import { type GrowthMetric } from "@/lib/data/growth-metrics";
import { type GrowthConfig } from "./GrowthSetupFlow";
import { X, Save, PlusCircle, PenLine } from "lucide-react";

interface GrowthInputFormProps {
  onSave: (data: Omit<GrowthMetric, "conversions">) => void;
  onCancel: () => void;
  initialWeek?: number;
  config: GrowthConfig;
}

/* ── Internal Field Row (Settings Style) ── */
function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-start sm:gap-6 py-4 border-b border-[hsl(var(--border)/0.4)] last:border-0">
      <div className="pt-0.5">
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function GrowthInputForm({ onSave, onCancel, initialWeek, config }: GrowthInputFormProps) {
  const [formData, setFormData] = useState({
    week: initialWeek || 1,
    awareness: 0,
    acquisition: 0,
    activation: 0,
    retention: 0,
    referral: 0,
    revenue: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <LaunchPanel tone="tint" className="w-full max-w-xl shadow-[0_32px_120px_hsl(var(--shadow-color)/0.2)] border-[hsl(var(--border)/0.55)] p-0 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="bg-muted/30 px-6 py-4 border-b border-[hsl(var(--border)/0.55)] flex items-center justify-between">
           <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Veri Girişi</h2>
           </div>
           <button 
             onClick={onCancel}
             className="p-1 rounded-lg hover:bg-muted transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2">
          <div className="divide-y divide-[hsl(var(--border)/0.3)]">
            <FieldRow 
              label={config.interval === "weekly" ? "Hafta Numarası" : "Ay Numarası"} 
              hint={`Raporun hangi periyodu temsil ettiği.`}
            >
              <LaunchInput 
                id="week"
                name="week"
                type="number"
                value={formData.week}
                onChange={handleChange}
                required
                className="max-w-[100px]"
              />
            </FieldRow>

            {config.enabledMetrics.awareness && (
              <FieldRow 
                label="1. Awareness" 
                hint={config.metricNames.awareness}
              >
                <LaunchInput 
                  name="awareness"
                  type="number"
                  value={formData.awareness}
                  onChange={handleChange}
                  className="max-w-[180px]"
                />
              </FieldRow>
            )}

            {config.enabledMetrics.acquisition && (
              <FieldRow 
                label="2. Acquisition" 
                hint={config.metricNames.acquisition}
              >
                <LaunchInput 
                  name="acquisition"
                  type="number"
                  value={formData.acquisition}
                  onChange={handleChange}
                  className="max-w-[180px]"
                />
              </FieldRow>
            )}

            {config.enabledMetrics.activation && (
              <FieldRow 
                label="3. Activation" 
                hint={config.metricNames.activation}
              >
                <LaunchInput 
                  name="activation"
                  type="number"
                  value={formData.activation}
                  onChange={handleChange}
                  className="max-w-[180px]"
                />
              </FieldRow>
            )}

            {config.enabledMetrics.retention && (
              <FieldRow 
                label="4. Retention" 
                hint={config.metricNames.retention}
              >
                <LaunchInput 
                  name="retention"
                  type="number"
                  value={formData.retention}
                  onChange={handleChange}
                  className="max-w-[180px]"
                />
              </FieldRow>
            )}

            {config.enabledMetrics.referral && (
              <FieldRow 
                label="5. Referral" 
                hint={config.metricNames.referral}
              >
                <LaunchInput 
                  name="referral"
                  type="number"
                  value={formData.referral}
                  onChange={handleChange}
                  className="max-w-[180px]"
                />
              </FieldRow>
            )}

            {config.enabledMetrics.revenue && (
              <FieldRow 
                label="Revenue ($)" 
                hint={config.metricNames.revenue}
              >
                <LaunchInput 
                  name="revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={handleChange}
                  className="max-w-[180px]"
                />
              </FieldRow>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-[hsl(var(--border)/0.3)] flex items-center justify-end gap-3">
             <LaunchButton type="button" tone="subtle" onClick={onCancel} className="rounded-xl">
               İptal
             </LaunchButton>
             <LaunchButton type="submit" className="gap-2 rounded-xl px-8 h-11">
               <Save className="w-4 h-4" />
               Kaydet & Güncelle
             </LaunchButton>
          </div>
        </form>
      </LaunchPanel>
    </div>
  );
}
