import type { ReactNode } from "react";
import Link from "next/link";

import { CountdownBadge } from "@/components/shared/CountdownBadge";
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
    <section className="grid gap-6 rounded-[2rem] border border-foreground/10 bg-white/88 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.95fr)] lg:p-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            {platformLabel}
          </span>
          <CountdownBadge launchDate={launchDate} />
          {contentSource === "fallback" ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              Local CMS fallback
            </span>
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {title}
            </h1>
          </div>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-[1.02rem]">
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
                  "inline-flex rounded-full px-5 py-3 text-sm font-semibold transition",
                  action.variant === "primary"
                    ? "bg-primary text-primary-foreground shadow-[0_18px_30px_rgba(30,64,175,0.18)] hover:opacity-95"
                    : "border border-foreground/10 bg-white text-foreground hover:bg-secondary/40"
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
                className="rounded-[1.5rem] border border-foreground/10 bg-secondary/45 px-4 py-4"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.85rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="space-y-5">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/55">
              {panelEyebrow}
            </p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-balance">
              {panelTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              {panelDescription}
            </p>
          </div>

          {panelBody ? (
            <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
              {panelBody}
            </div>
          ) : null}

          {panelFootnote ? (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/48">
              {panelFootnote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
