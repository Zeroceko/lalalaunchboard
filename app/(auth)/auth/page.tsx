import Link from "next/link";

import { AuthTabs } from "@/components/auth/AuthTabs";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
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

  const isRegister = initialTab === "register";

  const leftQuote = locale === "tr"
    ? `"${isRegister ? "Lalalaunchboard ile ilk board'umuzu kurduğumuzda, launch haftamız hiç bu kadar organize geçmemişti. Tek araç, tam netlik." : "Birden fazla aracı bir kenara bırakıp tek bir yüzeye geçtiğimizde her şey netleşti. Launch artık panik değil, ritim."}"`
    : `"${isRegister ? "When we set up our first board on Lalalaunchboard, our launch week was the most organized we had ever experienced. One tool, full clarity." : "When we dropped multiple tools and moved to a single surface, everything became clear. Launch is now rhythm, not panic."}"`;

  const quoteAuthor = isRegister ? "Selin K., Kurucu" : "Mert A., Ürün Müdürü";
  const quoteAuthorEn = isRegister ? "Selin K., Founder" : "Mert A., Product Manager";

  const benefits = locale === "tr"
    ? [
        "Hazırlık, launch ve growth tek yüzeyde",
        "KPI band + live countdown",
        "Platform başına ayrı board yönetimi",
        "Akıllı Markdown / PDF export"
      ]
    : [
        "Prep, launch, and growth on one surface",
        "KPI band + live countdown",
        "Separate board per platform",
        "Smart Markdown / PDF export"
      ];

  return (
    <div className="flex min-h-screen bg-background">
      {redirectedToProtectedRoute ? (
        <ToastTrigger
          toastKey={`auth-redirect-${searchParams?.next}`}
          title={dictionary.authPage.redirectNoticeTitle}
          description={dictionary.authPage.redirectNoticeDescription}
          variant="info"
        />
      ) : null}

      {/* ── Left: Brand panel ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[460px] xl:w-[520px] shrink-0 flex-col">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,hsl(224,28%,9%),hsl(232,30%,11%)_50%,hsl(222,26%,8%))]" />

        {/* Aurora blur decorations */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[hsl(221,84%,54%/0.22)] blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[hsl(265,80%,60%/0.14)] blur-[80px]" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between px-10 py-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <span className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-[hsl(var(--primary))] shadow-[0_2px_12px_hsl(var(--primary)/0.4)] transition-shadow group-hover:shadow-[0_4px_20px_hsl(var(--primary)/0.5)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 11V5.5L7 2.5l4.5 3V11a.8.8 0 01-.8.8H3.3a.8.8 0 01-.8-.8z" fill="white" />
              </svg>
            </span>
            <span className="text-[0.9rem] font-semibold text-white/90">
              Lalalaunchboard
            </span>
          </Link>

          {/* Middle: value + benefits */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--surface-dark-muted))]">
                {locale === "tr" ? "Neden seçiyorlar?" : "Why teams choose us"}
              </p>
              <h2 className="text-balance text-[1.9rem] font-bold leading-[1.1] tracking-[-0.05em] text-white">
                {locale === "tr"
                  ? "Lansman düzeni, sabahın ilk anından itibaren."
                  : "Launch clarity, from the very first morning."}
              </h2>
            </div>

            {/* Benefits list */}
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.2)]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="hsl(217,90%,70%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[0.875rem] text-white/80">{b}</span>
                </li>
              ))}
            </ul>

            {/* Mini product preview */}
            <div className="overflow-hidden rounded-[1rem] border border-[hsl(var(--surface-dark-foreground)/0.1)] bg-[hsl(var(--surface-dark-foreground)/0.05)]">
              <div className="border-b border-[hsl(var(--surface-dark-foreground)/0.08)] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400/60" />
                  <span className="ml-2 text-[10px] text-[hsl(var(--surface-dark-muted))]">Dashboard</span>
                </div>
              </div>
              <div className="space-y-2 p-4">
                {[
                  { label: "FocusFlow iOS", val: "68%", sub: "14 gün" },
                  { label: "PixelSync Web", val: "34%", sub: "31 gün" }
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white/80">{row.label}</span>
                        <span className="text-[10px] text-[hsl(var(--surface-dark-muted))]">{row.sub}</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-[hsl(var(--surface-dark-foreground)/0.08)]">
                        <div
                          className="h-full rounded-full bg-[hsl(var(--primary))]"
                          style={{ width: row.val }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: testimonial */}
          <div className="rounded-[0.85rem] border border-[hsl(var(--surface-dark-foreground)/0.1)] bg-[hsl(var(--surface-dark-foreground)/0.05)] p-4">
            <p className="text-[0.875rem] italic leading-6 text-white/70">
              {leftQuote}
            </p>
            <p className="mt-2.5 text-[11px] font-semibold text-[hsl(var(--surface-dark-muted))]">
              — {locale === "tr" ? quoteAuthor : quoteAuthorEn}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile only) */}
        <div className="flex items-center justify-between border-b border-[hsl(var(--border)/0.5)] px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-[0.45rem] bg-[hsl(var(--primary))] text-white">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 9V4l4-2.5L10 4v5a.8.8 0 01-.8.8H2.8A.8.8 0 012 9z" fill="currentColor" />
              </svg>
            </span>
            <span className="text-[0.875rem] font-semibold text-foreground">Lalalaunchboard</span>
          </Link>
          <LocaleSwitcher locale={locale} />
        </div>

        {/* Form centered */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[400px]">
            {/* Desktop top: locale + back (hidden on mobile — above handles it) */}
            <div className="mb-8 hidden items-center justify-between lg:flex">
              <Link href="/" className="text-[0.8125rem] text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors">
                ← {locale === "tr" ? "Ana sayfaya dön" : "Back to home"}
              </Link>
              <LocaleSwitcher locale={locale} />
            </div>

            <AuthTabs initialTab={initialTab} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
