import type { ReactNode } from "react";
import Link from "next/link";

import { CountdownBadge } from "@/components/shared/CountdownBadge";
import { LaunchBadge, launchButtonStyles } from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";

interface WorkspaceHeroAction {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

interface WorkspaceHeroStat {
  label: string;
  value: string;
  detail: string;
}

interface WorkspaceHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  platformLabel: string;
  launchDate: string;
  contentSource?: string;
  actions?: WorkspaceHeroAction[];
  stats?: WorkspaceHeroStat[];
  panelEyebrow: string;
  panelTitle: string;
  panelDescription: string;
  panelFootnote?: string;
  panelBody?: ReactNode;
}

export function WorkspaceHero({
  eyebrow,
  title,
  description,
  platformLabel,
  launchDate,
  contentSource,
  actions = [],
  stats = [],
  panelEyebrow,
  panelTitle,
  panelDescription,
  panelFootnote,
  panelBody
}: WorkspaceHeroProps) {
  return (
    <section className="launch-hero relative overflow-hidden rounded-[2.2rem] border border-[hsl(var(--border))/0.5] bg-[linear-gradient(135deg,hsl(var(--hero-start)/0.98),hsl(var(--hero-mid)/0.96)_38%,hsl(var(--hero-end)/0.96)_70%,hsl(var(--hero-start)/0.98))] p-6 shadow-[0_34px_100px_hsl(var(--shadow-color)/0.12)] sm:p-8 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.95fr)] lg:gap-8 lg:p-9">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,hsl(var(--bg-glow-brand)/0.16),transparent_30%),radial-gradient(circle_at_88%_10%,hsl(var(--bg-glow-accent)/0.18),transparent_26%),radial-gradient(circle_at_72%_78%,hsl(var(--bg-glow-clay)/0.1),transparent_24%)]" />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <LaunchBadge tone="brand">{platformLabel}</LaunchBadge>
          <CountdownBadge launchDate={launchDate} />
          {contentSource === "fallback" ? (
            <span className="rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.98] px-3 py-1 text-xs font-semibold text-[hsl(var(--warning-foreground))]">
              Local CMS fallback
            </span>
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
              {title}
            </h1>
          </div>
          <p className="max-w-3xl text-base leading-8 text-[hsl(var(--muted-foreground))] md:text-[1.02rem]">
            {description}
          </p>
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "px-5 py-3 text-sm",
                  action.variant === "primary"
                    ? launchButtonStyles.primary
                    : launchButtonStyles.secondary
                )}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="launch-glass-widget rounded-[1.45rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.9] px-4 py-4 shadow-[0_10px_26px_hsl(var(--shadow-color)/0.07)]"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.9rem] border border-[hsl(var(--border))/0.6] bg-[linear-gradient(180deg,hsl(var(--surface-dark-start)/0.98),hsl(var(--surface-dark-mid)/0.96)_55%,hsl(var(--surface-dark-end)/0.96))] p-6 text-[hsl(var(--surface-dark-foreground))] shadow-[0_30px_90px_hsl(var(--shadow-color)/0.22)]">
        <div className="space-y-5">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--surface-dark-muted))]">
              {panelEyebrow}
            </p>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance">
              {panelTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-[hsl(var(--surface-dark-muted))]">
              {panelDescription}
            </p>
          </div>

          {panelBody ? (
            <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
              {panelBody}
            </div>
          ) : null}

          {panelFootnote ? (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--surface-dark-muted))]">
              {panelFootnote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
