import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode
} from "react";

import { cn } from "@/lib/utils";

type BadgeTone =
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "clay";

type PanelTone =
  | "default"
  | "tint"
  | "brand"
  | "dark"
  | "success"
  | "warning"
  | "subtle"
  | "clay"
  | "inset";

const signalFillClasses: Record<BadgeTone, string> = {
  brand: "bg-[hsl(var(--primary))]",
  info: "bg-[hsl(var(--info))]",
  success: "bg-[hsl(var(--success))]",
  warning: "bg-[hsl(var(--warning))]",
  danger: "bg-[hsl(var(--destructive))]",
  neutral: "bg-[hsl(var(--muted-foreground))/0.45]",
  clay: "bg-[hsl(var(--clay))]"
};

const badgeToneClasses: Record<BadgeTone, string> = {
  brand:
    "border-[hsl(var(--primary))/0.18] bg-[hsl(var(--brand-soft))/0.98] text-[hsl(var(--primary))]",
  info:
    "border-[hsl(var(--info))/0.18] bg-[hsl(var(--info-soft))/0.98] text-[hsl(var(--info))]",
  success:
    "border-[hsl(var(--success))/0.16] bg-[hsl(var(--success-soft))/0.98] text-[hsl(var(--success))]",
  warning:
    "border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.98] text-[hsl(var(--warning-foreground))]",
  danger:
    "border-[hsl(var(--destructive))/0.16] bg-[hsl(var(--danger-soft))/0.98] text-[hsl(var(--destructive))]",
  neutral:
    "border-[hsl(var(--border))/0.52] bg-[hsl(var(--surface-inset))/0.92] text-[hsl(var(--muted-foreground))]",
  clay:
    "border-[hsl(var(--clay))/0.18] bg-[hsl(var(--clay-soft))/0.98] text-[hsl(var(--clay-foreground))]"
};

const panelToneClasses: Record<PanelTone, string> = {
  default:
    "border-[hsl(var(--border))/0.5] bg-[linear-gradient(180deg,hsl(var(--surface-default-start)/0.97),hsl(var(--surface-default-end)/0.92))] shadow-[0_24px_70px_hsl(var(--shadow-color)/0.08)]",
  tint:
    "border-[hsl(var(--border))/0.5] bg-[linear-gradient(180deg,hsl(var(--surface-tint-start)/0.98),hsl(var(--surface-tint-mid)/0.95)_45%,hsl(var(--surface-tint-end)/0.94))] shadow-[0_24px_70px_hsl(var(--shadow-color)/0.09)]",
  brand:
    "border-[hsl(var(--primary))/0.18] bg-[linear-gradient(180deg,hsl(var(--surface-brand-start)/0.98),hsl(var(--surface-brand-mid)/0.94)_62%,hsl(var(--surface-brand-end)/0.98))] shadow-[0_24px_70px_hsl(var(--shadow-color)/0.1)]",
  dark:
    "border-[hsl(var(--border))/0.6] bg-[linear-gradient(180deg,hsl(var(--surface-dark-start)/0.98),hsl(var(--surface-dark-mid)/0.96)_55%,hsl(var(--surface-dark-end)/0.96))] text-[hsl(var(--surface-dark-foreground))] shadow-[0_30px_90px_hsl(var(--shadow-color)/0.22)]",
  success:
    "border-[hsl(var(--success))/0.18] bg-[linear-gradient(180deg,hsl(var(--surface-success-start)/0.98),hsl(var(--surface-success-mid)/0.94)_62%,hsl(var(--surface-success-end)/0.98))] shadow-[0_24px_70px_hsl(var(--shadow-color)/0.09)]",
  warning:
    "border-[hsl(var(--warning))/0.22] bg-[linear-gradient(180deg,hsl(var(--surface-warning-start)/0.98),hsl(var(--surface-warning-mid)/0.94)_62%,hsl(var(--surface-warning-end)/0.98))] shadow-[0_24px_70px_hsl(var(--shadow-color)/0.09)]",
  subtle:
    "border-[hsl(var(--border))/0.44] bg-[linear-gradient(180deg,hsl(var(--card)/0.78),hsl(var(--card)/0.68))] shadow-[0_18px_44px_hsl(var(--shadow-color)/0.05)]",
  clay:
    "border-[hsl(var(--clay))/0.2] bg-[linear-gradient(180deg,hsl(var(--surface-clay-start)/0.98),hsl(var(--surface-clay-mid)/0.94)_62%,hsl(var(--surface-clay-end)/0.98))] shadow-[0_24px_70px_hsl(var(--shadow-color)/0.09)]",
  inset:
    "border-[hsl(var(--border))/0.42] bg-[hsl(var(--surface-inset))/0.9] shadow-[inset_0_1px_0_hsl(var(--panel-highlight)/0.8)]"
};

const metricToneClasses: Record<BadgeTone, string> = {
  brand:
    "border-[hsl(var(--primary))/0.18] bg-[linear-gradient(180deg,hsl(var(--surface-brand-start)/0.98),hsl(var(--surface-brand-end)/0.96))]",
  info:
    "border-[hsl(var(--info))/0.18] bg-[linear-gradient(180deg,hsl(var(--info-soft))/0.98),hsl(var(--card)/0.96))]",
  success:
    "border-[hsl(var(--success))/0.18] bg-[linear-gradient(180deg,hsl(var(--surface-success-start)/0.98),hsl(var(--card)/0.96))]",
  warning:
    "border-[hsl(var(--warning))/0.22] bg-[linear-gradient(180deg,hsl(var(--surface-warning-start)/0.98),hsl(var(--card)/0.96))]",
  danger:
    "border-[hsl(var(--destructive))/0.18] bg-[linear-gradient(180deg,hsl(var(--danger-soft))/0.98),hsl(var(--card)/0.96))]",
  neutral:
    "border-[hsl(var(--border))/0.5] bg-[linear-gradient(180deg,hsl(var(--card)/0.98),hsl(var(--surface-default-end)/0.94))]",
  clay:
    "border-[hsl(var(--clay))/0.18] bg-[linear-gradient(180deg,hsl(var(--surface-clay-start)/0.98),hsl(var(--card)/0.96))]"
};

const metricHaloClasses: Record<BadgeTone, string> = {
  brand: "border-[hsl(var(--primary))/0.16] bg-[hsl(var(--brand-soft))/0.95]",
  info: "border-[hsl(var(--info))/0.16] bg-[hsl(var(--info-soft))/0.95]",
  success: "border-[hsl(var(--success))/0.16] bg-[hsl(var(--success-soft))/0.95]",
  warning: "border-[hsl(var(--warning))/0.2] bg-[hsl(var(--amber-soft))/0.95]",
  danger: "border-[hsl(var(--destructive))/0.16] bg-[hsl(var(--danger-soft))/0.95]",
  neutral: "border-[hsl(var(--border))/0.5] bg-[hsl(var(--surface-inset))/0.95]",
  clay: "border-[hsl(var(--clay))/0.16] bg-[hsl(var(--clay-soft))/0.95]"
};

export const launchButtonStyles = {
  primary:
    "launch-button inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-strong)))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[0_18px_42px_hsl(var(--shadow-color)/0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_hsl(var(--shadow-color)/0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--primary))/0.18]",
  secondary:
    "launch-button inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))/0.52] bg-[hsl(var(--card))/0.9] px-5 py-3 text-sm font-semibold text-foreground shadow-[0_12px_30px_hsl(var(--shadow-color)/0.08)] transition duration-200 hover:-translate-y-0.5 hover:bg-[hsl(var(--card))/0.98] hover:shadow-[0_16px_36px_hsl(var(--shadow-color)/0.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--foreground))/0.08]",
  subtle:
    "launch-button inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))/0.48] bg-[hsl(var(--surface-inset))/0.9] px-5 py-3 text-sm font-semibold text-[hsl(var(--muted-foreground))] transition duration-200 hover:-translate-y-0.5 hover:bg-[hsl(var(--card))/0.95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--foreground))/0.08]",
  dark:
    "launch-button inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--surface-dark-start)),hsl(var(--surface-dark-end)))] px-5 py-3 text-sm font-semibold text-[hsl(var(--surface-dark-foreground))] shadow-[0_18px_42px_hsl(var(--shadow-color)/0.2)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_hsl(var(--shadow-color)/0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--foreground))/0.14]",
  accent:
    "launch-button inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--clay)),hsl(var(--accent)))] px-5 py-3 text-sm font-semibold text-[hsl(var(--accent-foreground))] shadow-[0_18px_42px_hsl(var(--shadow-color)/0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_hsl(var(--shadow-color)/0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--clay))/0.2]"
} as const;

interface LaunchPageProps {
  children: ReactNode;
  className?: string;
}

export function LaunchPage({ children, className }: LaunchPageProps) {
  return (
    <main
      className={cn(
        "relative mx-auto max-w-[1480px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
        className
      )}
    >
      <div className="w-full space-y-10 sm:space-y-12">{children}</div>
    </main>
  );
}

interface LaunchBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function LaunchBadge({
  children,
  tone = "neutral",
  className
}: LaunchBadgeProps) {
  return (
    <span
      data-tone={tone}
      className={cn(
        "launch-badge inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        badgeToneClasses[tone],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", signalFillClasses[tone])} />
      <span>{children}</span>
    </span>
  );
}

interface LaunchPanelProps {
  children: ReactNode;
  className?: string;
  tone?: PanelTone;
}

export function LaunchPanel({
  children,
  className,
  tone = "default"
}: LaunchPanelProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "launch-panel relative overflow-hidden rounded-[1.85rem] border p-6 sm:p-7 lg:p-8",
        panelToneClasses[tone],
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--panel-highlight))/0.8] to-transparent" />
      <div className="relative">{children}</div>
    </section>
  );
}

interface LaunchHeroProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

export function LaunchHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className
}: LaunchHeroProps) {
  return (
    <section
      className={cn(
        "launch-hero relative overflow-hidden rounded-[2.4rem] border border-[hsl(var(--border))/0.5] bg-[linear-gradient(135deg,hsl(var(--hero-start)/0.98),hsl(var(--hero-mid)/0.96)_38%,hsl(var(--hero-end)/0.96)_70%,hsl(var(--hero-start)/0.98))] p-6 shadow-[0_34px_100px_hsl(var(--shadow-color)/0.12)] sm:p-8 lg:p-10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_6%,hsl(var(--bg-glow-brand)/0.18),transparent_28%),radial-gradient(circle_at_88%_10%,hsl(var(--bg-glow-accent)/0.2),transparent_24%),radial-gradient(circle_at_72%_78%,hsl(var(--bg-glow-clay)/0.12),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary))/0.35] to-transparent" />
      <div
        className={cn(
          "relative gap-8 lg:gap-10",
          aside
            ? "grid xl:grid-cols-[minmax(0,1.18fr)_380px] xl:items-stretch"
            : "space-y-6"
        )}
      >
        <div className="space-y-7">
          <div className="space-y-4">
            <LaunchBadge tone="brand">{eyebrow}</LaunchBadge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-balance text-[2.6rem] font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[0.98]">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))] sm:text-lg sm:leading-8">
                {description}
              </p>
            </div>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {aside ? (
          <div className="relative">
            <div className="absolute inset-x-8 top-0 h-16 rounded-full bg-[radial-gradient(circle,hsl(var(--bg-glow-brand)/0.14),transparent_65%)] blur-3xl" />
            <div className="relative">{aside}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface LaunchSectionHeaderProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

export function LaunchSectionHeader({
  eyebrow,
  title,
  description,
  action
}: LaunchSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <LaunchBadge tone="neutral">{eyebrow}</LaunchBadge>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-[2.3rem]">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

interface LaunchMetricCardProps {
  label: string;
  value: ReactNode;
  detail: ReactNode;
  tone?: BadgeTone;
}

export function LaunchMetricCard({
  label,
  value,
  detail,
  tone = "brand"
}: LaunchMetricCardProps) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "launch-metric-card relative overflow-hidden rounded-[1.7rem] border p-6 shadow-[0_22px_54px_hsl(var(--shadow-color)/0.08)]",
        metricToneClasses[tone]
      )}
    >
      <div className="absolute inset-x-5 top-0 h-1.5 rounded-b-full bg-[hsl(var(--foreground))/0.05]">
        <div className={cn("h-full w-[46%] rounded-b-full", signalFillClasses[tone])} />
      </div>
      <div className="flex items-start justify-between gap-4">
        <p className="pt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
          {label}
        </p>
        <span
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border",
            metricHaloClasses[tone]
          )}
        >
          <span className={cn("h-3 w-3 rounded-full", signalFillClasses[tone])} />
        </span>
      </div>
      <p className="mt-4 text-[2.5rem] font-semibold tracking-[-0.05em] text-foreground">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
        {detail}
      </p>
    </div>
  );
}

interface LaunchRailItem {
  title: string;
  description: string;
  badge?: string;
  tone?: BadgeTone;
}

interface LaunchRailListProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  items: LaunchRailItem[];
  className?: string;
}

export function LaunchRailList({
  eyebrow,
  title,
  description,
  items,
  className
}: LaunchRailListProps) {
  return (
    <LaunchPanel tone="tint" className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <LaunchBadge tone="clay">{eyebrow}</LaunchBadge>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const tone = item.tone ?? "neutral";

          return (
            <div
              key={item.title}
              data-tone={tone}
              className="launch-glass-widget rounded-[1.45rem] border border-[hsl(var(--border))/0.62] bg-[hsl(var(--card))/0.92] px-5 py-[1.125rem] shadow-[0_10px_26px_hsl(var(--shadow-color)/0.07)]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.95rem] border text-sm font-semibold",
                    metricHaloClasses[tone]
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full", signalFillClasses[tone])} />
                </span>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {String(index + 1).padStart(2, "0")} {item.title}
                    </p>
                    {item.badge ? (
                      <LaunchBadge tone={tone} className="bg-[hsl(var(--card))/0.96]">
                        {item.badge}
                      </LaunchBadge>
                    ) : null}
                  </div>
                  <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </LaunchPanel>
  );
}

interface LaunchMiniStatProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function LaunchMiniStat({
  label,
  value,
  detail,
  tone = "neutral",
  className
}: LaunchMiniStatProps) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "launch-mini-stat rounded-[1.35rem] border p-4 shadow-[0_14px_34px_hsl(var(--shadow-color)/0.06)] sm:p-5",
        metricToneClasses[tone],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
          {label}
        </p>
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-[0.85rem] border",
            metricHaloClasses[tone]
          )}
        >
          <span className={cn("h-2.5 w-2.5 rounded-full", signalFillClasses[tone])} />
        </span>
      </div>
      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-foreground">
        {value}
      </p>
      {detail ? (
        <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

interface LaunchFieldShellProps {
  label: ReactNode;
  hint: ReactNode;
  error?: string;
  fieldId?: string;
  children: ReactNode;
}

export function LaunchFieldShell({
  label,
  hint,
  error,
  fieldId,
  children
}: LaunchFieldShellProps) {
  const content = (
    <>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">{hint}</p>
    </>
  );

  return (
    <div className="space-y-3">
      {fieldId ? (
        <label htmlFor={fieldId} className="block space-y-1.5">
          {content}
        </label>
      ) : (
        <div className="space-y-1.5">{content}</div>
      )}
      {children}
      {error ? <p className="text-sm text-[hsl(var(--destructive))]">{error}</p> : null}
    </div>
  );
}

export function LaunchInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "launch-input w-full rounded-[1.35rem] border border-[hsl(var(--border))/0.72] bg-[hsl(var(--surface-inset))/0.82] px-4 py-3.5 text-foreground outline-none shadow-[inset_0_1px_0_hsl(var(--panel-highlight)/0.9),0_10px_28px_hsl(var(--shadow-color)/0.06)] transition duration-200 placeholder:text-[hsl(var(--muted-foreground))/0.75] focus:border-[hsl(var(--primary))/0.36] focus:bg-[hsl(var(--card))/0.96] focus:ring-4 focus:ring-[hsl(var(--primary))/0.12]",
        className
      )}
    />
  );
}

interface LaunchChoiceCardProps {
  label: string;
  hint: string;
  selected: boolean;
  onSelect: () => void;
  tone?: BadgeTone;
  className?: string;
}

export function LaunchChoiceCard({
  label,
  hint,
  selected,
  onSelect,
  tone = "brand",
  className
}: LaunchChoiceCardProps) {
  return (
    <button
      data-tone={tone}
      data-state={selected ? "selected" : "idle"}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "launch-choice-card group rounded-[1.55rem] border px-5 py-5 text-left transition duration-200 hover:-translate-y-0.5",
        selected
          ? cn(metricToneClasses[tone], "shadow-[0_18px_40px_hsl(var(--shadow-color)/0.1)]")
          : "border-[hsl(var(--border))/0.72] bg-[hsl(var(--card))/0.92] shadow-[0_12px_30px_hsl(var(--shadow-color)/0.06)] hover:bg-[hsl(var(--card))/0.98]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
            {label}
          </p>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            {hint}
          </p>
        </div>
        <span
          className={cn(
            "mt-1 inline-flex h-9 w-9 items-center justify-center rounded-[0.9rem] border",
            selected
              ? metricHaloClasses[tone]
              : "border-[hsl(var(--border))/0.72] bg-[hsl(var(--surface-inset))/0.9]"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              selected ? signalFillClasses[tone] : "bg-[hsl(var(--muted-foreground))/0.35]"
            )}
          />
        </span>
      </div>
    </button>
  );
}

interface LaunchNoticeProps {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  className?: string;
}

const noticeToneClasses: Record<NonNullable<LaunchNoticeProps["tone"]>, string> = {
  info:
    "border-[hsl(var(--info))/0.16] bg-[hsl(var(--info-soft))/0.92] text-[hsl(var(--foreground))]",
  success:
    "border-[hsl(var(--success))/0.16] bg-[hsl(var(--success-soft))/0.92] text-[hsl(var(--foreground))]",
  warning:
    "border-[hsl(var(--warning))/0.18] bg-[hsl(var(--amber-soft))/0.94] text-[hsl(var(--foreground))]",
  danger:
    "border-[hsl(var(--destructive))/0.18] bg-[hsl(var(--danger-soft))/0.92] text-[hsl(var(--destructive))]"
};

export function LaunchNotice({
  children,
  tone = "info",
  className
}: LaunchNoticeProps) {
  return (
    <div
      className={cn(
        "launch-notice rounded-[1.35rem] border px-4 py-4 text-sm leading-6 shadow-[0_10px_28px_hsl(var(--shadow-color)/0.05)]",
        noticeToneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  );
}

interface LaunchActionBarProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
}

export function LaunchActionBar({
  eyebrow,
  title,
  description,
  children
}: LaunchActionBarProps) {
  return (
    <section
      data-tone="dark"
      className="launch-action-bar relative overflow-hidden rounded-[2rem] border border-[hsl(var(--border))/0.64] bg-[linear-gradient(135deg,hsl(var(--surface-dark-start)),hsl(var(--surface-dark-mid))_55%,hsl(var(--surface-dark-end)))] p-7 shadow-[0_28px_80px_hsl(var(--shadow-color)/0.18)] sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,hsl(var(--bg-glow-brand)/0.24),transparent_28%),radial-gradient(circle_at_88%_100%,hsl(var(--bg-glow-accent)/0.18),transparent_28%)]" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <LaunchBadge
            tone="warning"
            className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
          >
            {eyebrow}
          </LaunchBadge>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[hsl(var(--surface-dark-foreground))]">
              {title}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[hsl(var(--surface-dark-muted))]">
              {description}
            </p>
          </div>
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </section>
  );
}

interface LaunchPillListProps {
  items: string[];
  className?: string;
}

export function LaunchPillList({ items, className }: LaunchPillListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {items.map((item) => (
        <LaunchBadge
          key={item}
          tone="neutral"
          className="border-[hsl(var(--border))/0.7] bg-[hsl(var(--card))/0.86] text-[hsl(var(--muted-foreground))]"
        >
          {item}
        </LaunchBadge>
      ))}
    </div>
  );
}

export function LaunchButton({
  tone = "primary",
  className,
  children,
  ...props
}: {
  tone?: keyof typeof launchButtonStyles;
} & import("react").ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-tone={tone}
      {...props}
      className={cn(
        launchButtonStyles[tone],
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface LaunchSidebarProps {
  children: ReactNode;
  className?: string;
}

export function LaunchSidebar({ children, className }: LaunchSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[220px] shrink-0 flex-col border-r bg-[hsl(var(--sidebar-bg))] border-[hsl(var(--sidebar-border))]",
        className
      )}
    >
      {children}
    </aside>
  );
}

interface LaunchSidebarSectionProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function LaunchSidebarSection({
  children,
  label,
  className
}: LaunchSidebarSectionProps) {
  return (
    <div className={cn("px-3 py-3", className)}>
      {label ? (
        <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground)/0.6)]">
          {label}
        </p>
      ) : null}
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}

interface LaunchSidebarItemProps {
  children: ReactNode;
  href?: string;
  active?: boolean;
  icon?: ReactNode;
  badge?: string | number;
  className?: string;
}

export function LaunchSidebarItem({
  children,
  active,
  icon,
  badge,
  className
}: LaunchSidebarItemProps) {
  return (
    <span
      data-state={active ? "active" : "idle"}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-[0.65rem] px-2.5 py-2 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-[hsl(var(--sidebar-item-active))] text-[hsl(var(--sidebar-item-active-text))]"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] hover:text-foreground",
        className
      )}
    >
      {icon ? (
        <span className="flex h-4 w-4 items-center justify-center opacity-70 group-data-[state=active]:opacity-100">
          {icon}
        </span>
      ) : null}
      <span className="flex-1 truncate">{children}</span>
      {badge !== undefined ? (
        <span className="rounded-full bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[hsl(var(--muted-foreground))]">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

interface LaunchTopBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function LaunchTopBar({
  title,
  subtitle,
  actions,
  className
}: LaunchTopBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between border-b border-[hsl(var(--border)/0.7)] bg-[hsl(var(--background)/0.8)] px-6 py-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="space-y-0.5">
        <h1 className="text-[0.95rem] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

// ─── KPI Band ─────────────────────────────────────────────────────────────────

interface KPIItem {
  label: string;
  value: ReactNode;
  change?: string;
  tone?: BadgeTone;
}

interface LaunchKPIBandProps {
  items: KPIItem[];
  className?: string;
}

export function LaunchKPIBand({ items, className }: LaunchKPIBandProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        items.length === 2 && "grid-cols-2",
        items.length === 3 && "grid-cols-3",
        items.length === 4 && "grid-cols-2 md:grid-cols-4",
        className
      )}
    >
      {items.map((item) => {
        const tone = item.tone ?? "neutral";
        return (
          <div
            key={item.label}
            data-tone={tone}
            className={cn(
              "launch-mini-stat relative overflow-hidden rounded-[1rem] border p-4",
              metricToneClasses[tone]
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              {item.label}
            </p>
            <p className="mt-2.5 text-[1.65rem] font-semibold tracking-[-0.04em] text-foreground leading-none">
              {item.value}
            </p>
            {item.change ? (
              <p className="mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                {item.change}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

