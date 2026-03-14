import Link from "next/link";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import {
  LaunchBadge,
  LaunchPage,
  LaunchPanel,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveRequestLocale } from "@/lib/i18n/server";

export default async function PricingPage() {
  const locale = resolveRequestLocale();
  const dictionary = getDictionary(locale);
  const { common, pricing } = dictionary;

  let user: { id: string } | null = null;

  if (hasSupabaseEnv()) {
    try {
      const session = await getSessionContext();
      user = session.user ? { id: session.user.id } : null;
    } catch (error) {
      console.warn("PricingPage session check failed; rendering pricing.", error);
    }
  }

  const starterHref = user ? "/dashboard" : "/auth?tab=register";
  const proPrimaryHref = user ? "/settings" : "/auth?tab=register";
  const enterpriseHref = "mailto:hello@lalalaunchboard.com?subject=Lalalaunchboard%20Enterprise";

  const plans = [
    {
      key: "starter",
      tone: "default" as const,
      data: pricing.plans.starter,
      primaryHref: starterHref,
      secondaryHref: "/"
    },
    {
      key: "pro",
      tone: "brand" as const,
      data: pricing.plans.pro,
      primaryHref: proPrimaryHref,
      secondaryHref: proPrimaryHref
    },
    {
      key: "enterprise",
      tone: "tint" as const,
      data: pricing.plans.enterprise,
      primaryHref: enterpriseHref,
      secondaryHref: enterpriseHref
    }
  ];

  return (
    <LaunchPage className="min-h-screen max-w-[1180px] py-6 sm:py-8">
      <div className="space-y-16 sm:space-y-20">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              Lalalaunchboard
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {pricing.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <Link href="/" className={launchButtonStyles.subtle}>
              {common.homeLabel}
            </Link>
            {user ? (
              <Link href="/dashboard" className={launchButtonStyles.secondary}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
                  {common.signInLabel}
                </Link>
                <Link
                  href="/auth?tab=register"
                  className={launchButtonStyles.primary}
                >
                  {common.signUpLabel}
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="space-y-8">
          <LaunchSectionHeader
            eyebrow={pricing.eyebrow}
            title={pricing.title}
            description={pricing.description}
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => {
              const isRecommended = plan.key === "pro";
              const planTone = isRecommended ? "brand" : plan.tone;
              const primaryStyle = isRecommended
                ? launchButtonStyles.primary
                : launchButtonStyles.secondary;

              return (
                <LaunchPanel
                  key={plan.key}
                  tone={planTone}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3">
                    <LaunchBadge tone={isRecommended ? "brand" : "neutral"}>
                      {plan.data.badge}
                    </LaunchBadge>
                    {isRecommended ? (
                      <LaunchBadge tone="success">{pricing.recommendedLabel}</LaunchBadge>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {plan.data.name}
                    </h2>
                    <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                      {plan.data.description}
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.7] px-5 py-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                      {plan.data.badge}
                    </p>
                    <div className="mt-3 flex items-baseline justify-between gap-4">
                      <p className="text-4xl font-semibold tracking-tight text-foreground">
                        {plan.data.price}
                      </p>
                      <p className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                        {plan.data.priceDetail}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.data.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary))]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    <Link href={plan.primaryHref} className={primaryStyle}>
                      {plan.data.ctaLabel}
                    </Link>
                    {plan.data.secondaryCtaLabel ? (
                      <Link href={plan.secondaryHref} className={launchButtonStyles.subtle}>
                        {plan.data.secondaryCtaLabel}
                      </Link>
                    ) : null}
                  </div>
                </LaunchPanel>
              );
            })}
          </div>

          <LaunchPanel tone="default" className="space-y-3">
            <LaunchBadge tone="neutral">Not</LaunchBadge>
            <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {pricing.footnote}
            </p>
          </LaunchPanel>
        </section>
      </div>
    </LaunchPage>
  );
}

