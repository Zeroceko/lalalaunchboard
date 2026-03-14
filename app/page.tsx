import Link from "next/link";
import { redirect } from "next/navigation";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import {
  LaunchBadge,
  LaunchPage,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveRequestLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  if (hasSupabaseEnv()) {
    try {
      const { user } = await getSessionContext();
      if (user) {
        redirect("/dashboard");
      }
    } catch (error) {
      console.warn("HomePage session check failed; rendering landing.", error);
    }
  }

  const locale = resolveRequestLocale();
  const dictionary = getDictionary(locale);
  const { common, landing } = dictionary;

  return (
    <LaunchPage className="min-h-screen max-w-[1180px] py-6 sm:py-8">
      <div className="space-y-16 sm:space-y-20">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              Lalalaunchboard
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {landing.topTagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
              {common.signInLabel}
            </Link>
            <Link href="/auth?tab=register" className={launchButtonStyles.primary}>
              {common.signUpLabel}
            </Link>
          </div>
        </header>

        <section className="grid gap-10 xl:grid-cols-[minmax(0,1.05fr)_410px] xl:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <LaunchBadge tone="brand">{landing.heroEyebrow}</LaunchBadge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-balance text-[3.1rem] font-semibold tracking-[-0.07em] text-foreground sm:text-[4.4rem] sm:leading-[0.95]">
                  {landing.heroTitle}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[hsl(var(--muted-foreground))]">
                  {landing.heroDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth?tab=register" className={launchButtonStyles.primary}>
                {landing.heroPrimaryCta}
              </Link>
              <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
                {landing.heroSecondaryCta}
              </Link>
            </div>

            <ul className="grid gap-3 text-sm text-[hsl(var(--muted-foreground))] sm:grid-cols-3">
              {landing.heroPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-[1.4rem] bg-[hsl(var(--card))/0.46] px-4 py-4 shadow-[0_14px_34px_hsl(var(--shadow-color)/0.04)] backdrop-blur"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -left-6 top-8 h-24 w-24 rounded-full bg-[hsl(var(--bg-glow-clay))/0.18] blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[hsl(var(--bg-glow-brand))/0.18] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.4rem] border border-[hsl(var(--border))/0.5] bg-[linear-gradient(160deg,hsl(var(--surface-dark-start)/0.96),hsl(var(--surface-dark-mid)/0.98)_50%,hsl(var(--surface-dark-end)/0.96))] p-6 text-[hsl(var(--surface-dark-foreground))] shadow-[0_30px_90px_hsl(var(--shadow-color)/0.18)]">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--surface-dark-muted))]">
                      {landing.showcasePreviewLabel}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                      FocusFlow
                    </h2>
                  </div>
                  <span className="rounded-full border border-[hsl(var(--surface-dark-foreground))/0.16] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--surface-dark-muted))]">
                    {landing.showcaseStats[1]?.value}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--surface-dark-foreground))/0.08]">
                  <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)))]" />
                </div>

                <div className="space-y-3">
                  {landing.showcaseStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="grid gap-1 rounded-[1.45rem] bg-[hsl(var(--surface-dark-foreground))/0.05] px-4 py-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--surface-dark-muted))]">
                        {stat.label}
                      </p>
                      <p className="text-xl font-semibold tracking-[-0.04em]">
                        {stat.value}
                      </p>
                      <p className="text-sm leading-6 text-[hsl(var(--surface-dark-muted))]">
                        {stat.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-3">
            <LaunchBadge tone="neutral">{landing.journeyEyebrow}</LaunchBadge>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2.7rem]">
              {landing.journeyTitle}
            </h2>
            <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
              {landing.journeyDescription}
            </p>
          </div>

          <div className="divide-y divide-[hsl(var(--border))/0.58]">
            {landing.journeySteps.map((step) => (
              <article
                key={step.label}
                className="grid gap-4 py-6 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-8"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[hsl(var(--muted-foreground))]">
                  {step.label}
                </p>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="space-y-8">
            <div className="space-y-3">
              <LaunchBadge tone="clay">{landing.productEyebrow}</LaunchBadge>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2.7rem]">
                {landing.productTitle}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
                {landing.productDescription}
              </p>
            </div>

            <div className="divide-y divide-[hsl(var(--border))/0.58]">
              {landing.productHighlights.map((item) => (
                <article key={item.title} className="space-y-2 py-6">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[hsl(var(--border))/0.52] bg-[linear-gradient(180deg,hsl(var(--card))/0.84),hsl(var(--surface-default-end))/0.9)] p-6 shadow-[0_24px_70px_hsl(var(--shadow-color)/0.08)]">
            <div className="space-y-4">
              <LaunchBadge tone="info">{landing.showcaseEyebrow}</LaunchBadge>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {landing.showcaseTitle}
                </h3>
                <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                  {landing.showcaseDescription}
                </p>
              </div>

              <div className="space-y-3 pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--muted-foreground))]">
                  {landing.showcaseListTitle}
                </p>
                <ul className="space-y-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {landing.showcaseList.map((item) => (
                    <li key={item} className="rounded-[1.2rem] bg-[hsl(var(--surface-inset))/0.72] px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.6rem] bg-[linear-gradient(145deg,hsl(var(--surface-dark-start)),hsl(var(--surface-dark-mid))_55%,hsl(var(--surface-dark-end)))] px-6 py-8 shadow-[0_34px_90px_hsl(var(--shadow-color)/0.2)] sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
            <div className="space-y-4">
              <LaunchBadge
                tone="warning"
                className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
              >
                {landing.ctaEyebrow}
              </LaunchBadge>
              <div className="space-y-3">
                <h2 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] text-[hsl(var(--surface-dark-foreground))]">
                  {landing.ctaTitle}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[hsl(var(--surface-dark-muted))]">
                  {landing.ctaDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/auth?tab=register" className={launchButtonStyles.primary}>
                {common.signUpLabel}
              </Link>
              <Link href="/auth?tab=login" className={launchButtonStyles.secondary}>
                {common.signInLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LaunchPage>
  );
}
