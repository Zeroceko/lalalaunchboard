"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/components/shared/ToastProvider";
import {
  LaunchBadge,
  LaunchMiniStat,
  LaunchNotice,
  LaunchPanel,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import {
  applyThemeState,
  COLOR_MODE_OPTIONS,
  DEFAULT_THEME_STATE,
  getStoredThemeState,
  type ThemeState,
  VISUAL_THEME_OPTIONS
} from "@/components/ui/theme/theme";
import { cn } from "@/lib/utils";

function getVisualThemeLabel(value: ThemeState["visualTheme"]) {
  return (
    VISUAL_THEME_OPTIONS.find((option) => option.value === value)?.label ??
    DEFAULT_THEME_STATE.visualTheme
  );
}

function getColorModeLabel(value: ThemeState["colorMode"]) {
  return (
    COLOR_MODE_OPTIONS.find((option) => option.value === value)?.label ??
    DEFAULT_THEME_STATE.colorMode
  );
}

function CompactChoiceCard({
  label,
  description,
  selected,
  onClick
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[1.1rem] border px-4 py-3 text-left transition",
        selected
          ? "border-[hsl(var(--primary))/0.24] bg-[hsl(var(--brand-soft))/0.92] shadow-[0_10px_24px_hsl(var(--shadow-color)/0.08)]"
          : "border-[hsl(var(--border))/0.56] bg-[hsl(var(--card))/0.9] hover:bg-[hsl(var(--card))/0.98]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs leading-5 text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        </div>
        <span
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 shrink-0 rounded-full border",
            selected
              ? "border-[hsl(var(--primary))/0.18] bg-[hsl(var(--primary))]"
              : "border-[hsl(var(--border))/0.72] bg-[hsl(var(--surface-inset))/0.9]"
          )}
        />
      </div>
    </button>
  );
}

export function AppearanceSettings() {
  const [themeState, setThemeState] = useState<ThemeState>(DEFAULT_THEME_STATE);
  const [ready, setReady] = useState(false);
  const { pushToast } = useToast();

  useEffect(() => {
    const storedState = getStoredThemeState();
    setThemeState(storedState);
    setReady(true);
  }, []);

  const updateThemeState = (partialState: Partial<ThemeState>) => {
    setThemeState((currentState) => {
      const nextState = {
        ...currentState,
        ...partialState
      };

      applyThemeState(nextState);

      // Push to Supabase for cross-device sync
      fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: nextState })
      }).catch(() => {});

      return nextState;
    });
  };

  const handleReset = () => {
    const nextState = DEFAULT_THEME_STATE;
    setThemeState(nextState);
    applyThemeState(nextState);

    // Push reset to Supabase
    fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: nextState })
    }).catch(() => {});

    pushToast({
      title: "Gorunum varsayilanlara dondu",
      description: "Warm Premium ve Acik mod yeniden aktif edildi.",
      variant: "success"
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <LaunchMiniStat
          label="Tema"
          value={getVisualThemeLabel(themeState.visualTheme)}
          detail="Aninda uygulanir"
          tone="brand"
        />
        <LaunchMiniStat
          label="Mod"
          value={getColorModeLabel(themeState.colorMode)}
          detail="Bu cihazda saklanir"
          tone="info"
        />
        <LaunchMiniStat
          label="Durum"
          value={ready ? "Hazir" : "Yukleniyor"}
          detail="Kaydet butonu gerekmez"
          tone="clay"
        />
      </div>

      <LaunchNotice tone="info" className="px-4 py-3 text-sm">
        Tasarim secimlerin aninda uygulanir ve bu cihazda hatirlanir.
      </LaunchNotice>

      <section className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Görünüm paketi</p>
          <p className="mt-0.5 text-xs text-muted-foreground">İki farklı görsel dil arasından seç.</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {VISUAL_THEME_OPTIONS.map((option) => (
            <CompactChoiceCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={themeState.visualTheme === option.value}
              onClick={() => updateThemeState({ visualTheme: option.value })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Renk modu</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Açık veya koyu görünümü seç.</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {COLOR_MODE_OPTIONS.map((option) => (
            <CompactChoiceCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={themeState.colorMode === option.value}
              onClick={() => updateThemeState({ colorMode: option.value })}
            />
          ))}
        </div>
      </section>

      <LaunchPanel tone="subtle" className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <LaunchBadge tone={ready ? "success" : "warning"}>Varsayilan</LaunchBadge>
            <p className="text-sm font-semibold text-foreground">
              Warm Premium + Acik mod
            </p>
            <p className="text-xs leading-5 text-[hsl(var(--muted-foreground))]">
              Istersen tek tikla varsayilan gorunume donebilirsin.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className={cn(launchButtonStyles.secondary, "px-4 py-2 text-sm")}
          >
            Varsayilana don
          </button>
        </div>
      </LaunchPanel>
    </div>
  );
}
