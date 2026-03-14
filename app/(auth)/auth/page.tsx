import Link from "next/link";

import { AuthTabs } from "@/components/auth/AuthTabs";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
import {
  LaunchBadge,
  LaunchPage,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveRequestLocale } from "@/lib/i18n/server";

export default function AuthPage({
  searchParams
}: {
  searchParams?: { reason?: string; next?: string; tab?: string };
}) {
  const locale = resolveRequestLocale();
  const dictionary = getDictionary(locale);
  const redirectedToProtectedRoute =
    searchParams?.reason === "auth" &&
    typeof searchParams.next === "string" &&
    searchParams.next.startsWith("/");

  const initialTab =
    searchParams?.tab === "register" || searchParams?.tab === "signup"
      ? "register"
      : "login";

  return (
    <LaunchPage className="min-h-screen max-w-[1080px] py-6 sm:py-8">
      {redirectedToProtectedRoute ? (
        <ToastTrigger
          toastKey={`auth-redirect-${searchParams?.next}`}
          title={dictionary.authPage.redirectNoticeTitle}
          description={dictionary.authPage.redirectNoticeDescription}
          variant="info"
        />
      ) : null}

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
              Lalalaunchboard
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <LaunchBadge tone="brand">{dictionary.authPage.topBadge}</LaunchBadge>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {dictionary.authPage.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <Link href="/" className={launchButtonStyles.secondary}>
              {dictionary.common.homeLabel}
            </Link>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[2.75rem] border border-[hsl(var(--border))/0.52] bg-[linear-gradient(135deg,hsl(var(--surface-default-start)/0.88),hsl(var(--surface-tint-end)/0.76))] px-5 py-8 shadow-[0_30px_90px_hsl(var(--shadow-color)/0.1)] sm:px-8 sm:py-10 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,hsl(var(--bg-glow-brand)/0.16),transparent_30%),radial-gradient(circle_at_90%_18%,hsl(var(--bg-glow-accent)/0.16),transparent_24%),radial-gradient(circle_at_50%_100%,hsl(var(--bg-glow-clay)/0.14),transparent_26%)]" />
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary))/0.28] to-transparent" />

          <div className="relative mx-auto max-w-[620px]">
            <div className="space-y-3 pb-8 text-center">
              <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-[3.4rem] sm:leading-[0.98]">
                {dictionary.authPage.title}
              </h2>
              <p className="mx-auto max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
                {dictionary.authPage.description}
              </p>
            </div>

            <AuthTabs initialTab={initialTab} locale={locale} />
          </div>
        </section>
      </div>
    </LaunchPage>
  );
}
