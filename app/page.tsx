import Link from "next/link";
import { redirect } from "next/navigation";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveRequestLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  if (hasSupabaseEnv()) {
    try {
      const { user } = await getSessionContext();
      if (user) redirect("/dashboard");
    } catch (error) {
      console.warn("HomePage session check:", error);
    }
  }

  const locale = resolveRequestLocale();
  const dictionary = getDictionary(locale);
  const { common } = dictionary;

  // ── copy (yeni premium version) ─────────────────────────────────────────
  const heroEyebrow = locale === "tr" ? "Launch OS · Beta'da" : "Launch OS · In Beta";
  const heroTitle =
    locale === "tr"
      ? "Lansman öncesi düzen. Lansman sonrası ritim."
      : "Structure before launch. Rhythm after.";
  const heroSub =
    locale === "tr"
      ? "Uygulama lansmanınızı yönetmek için tek çalışma yüzeyi. Hazırlık, launch ve büyüme — hepsi tek panoda."
      : "The single operating surface for app launches. Prep, go-live, and growth — all on one board.";
  const primaryCta = locale === "tr" ? "Ücretsiz başla" : "Start for free";
  const secondaryCta = locale === "tr" ? "Demo izle" : "Watch demo";

  const statsData = [
    { label: locale === "tr" ? "Onaylı kurucu" : "Founders approved", value: "500+" },
    { label: locale === "tr" ? "Launch board" : "Launch boards", value: "1 200+" },
    { label: locale === "tr" ? "Ortalama tasarruf" : "Avg. time saved", value: "6 saat/gün" }
  ];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
      title: locale === "tr" ? "Komuta Merkezi" : "Command Center",
      body:
        locale === "tr"
          ? "KPI bandı, checklist ve geri sayım aynı ekranda. Ekibin odağını dağıtmadan ilerler."
          : "KPI band, checklist, and countdown in one view. Your team moves without losing focus.",
      accent: "brand"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: locale === "tr" ? "Çoklu Board" : "Multi-Board",
      body:
        locale === "tr"
          ? "iOS, Android, web — her platform için ayrı board. Tüm ürünleri tek dashboarddan yönet."
          : "iOS, Android, web — a board per platform. Manage all products from one dashboard.",
      accent: "violet"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: locale === "tr" ? "Growth Takibi" : "Growth Tracking",
      body:
        locale === "tr"
          ? "Launch bittikten sonra da ritim bitmez. Deney notları ve büyüme adımları aynı sistemde."
          : "Rhythm doesn't stop at launch. Experiment notes and growth steps live in the same system.",
      accent: "emerald"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: locale === "tr" ? "Teslim Yönetimi" : "Deliverable Hub",
      body:
        locale === "tr"
          ? "Store meta, görseller, release notları — hiçbir kritik dosya kaçmaz, hepsi boardda görünür."
          : "Store meta, screenshots, release notes — nothing critical slips through. All visible on the board.",
      accent: "amber"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
      ),
      title: locale === "tr" ? "Canlı Geri Sayım" : "Live Countdown",
      body:
        locale === "tr"
          ? "Launch tarihi her gün yeniden okunur. Takım her sabah nerede olduğunu bilir."
          : "Launch date is always front and center. The team knows exactly where they are each morning.",
      accent: "rose"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" />
        </svg>
      ),
      title: locale === "tr" ? "Akıllı Export" : "Smart Export",
      body:
        locale === "tr"
          ? "Board verilerini Markdown veya PDF olarak export et. Yatırımcı brifingleri artık saniyeler içinde."
          : "Export board data as Markdown or PDF. Investor briefings now take seconds.",
      accent: "brand"
    }
  ];

  const accentMap: Record<string, string> = {
    brand: "hsl(var(--primary))",
    violet: "hsl(265 90% 62%)",
    emerald: "hsl(152 58% 42%)",
    amber: "hsl(38 92% 52%)",
    rose: "hsl(350 80% 58%)"
  };

  const testimonials = [
    {
      quote:
        locale === "tr"
          ? "Lalalaunchboard, 3 farklı aracı tek borota topladı. Launch haftamız hiç bu kadar sakin geçmemişti."
          : "Lalalaunchboard consolidated 3 separate tools into one board. Our launch week was calmer than ever.",
      author: "Selin K.",
      role: locale === "tr" ? "Kurucu, Mobil Uygulama" : "Founder, Mobile App"
    },
    {
      quote:
        locale === "tr"
          ? "Control desk fikri harika. Hangi aşamada olduklarını sormak yerine herkes kendi boardına bakıyor."
          : "The control desk concept is brilliant. Instead of asking where we are, everyone just checks the board.",
      author: "Mert A.",
      role: locale === "tr" ? "Ürün Müdürü, SaaS" : "Product Manager, SaaS"
    },
    {
      quote:
        locale === "tr"
          ? "Growth aşamasına geçtikten sonra da aynı sistemde devam ettik. Sıfırdan başlamak zorunda kalmadık."
          : "We transitioned into growth phase and kept the same system. No starting over from scratch.",
      author: "Ayşe D.",
      role: locale === "tr" ? "CPO, B2B Startup" : "CPO, B2B Startup"
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border)/0.6)] bg-[hsl(var(--background)/0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-3.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-[hsl(var(--primary))] shadow-[0_2px_8px_hsl(var(--primary)/0.35)] transition-shadow group-hover:shadow-[0_4px_16px_hsl(var(--primary)/0.4)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 11V5.5L7 2.5l4.5 3V11a.8.8 0 01-.8.8H3.3a.8.8 0 01-.8-.8z" fill="white" />
              </svg>
            </span>
            <span className="text-[0.9rem] font-semibold tracking-[-0.025em] text-foreground">
              Lalalaunchboard
            </span>
          </Link>

          {/* Nav links (desktop) */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {[
              { label: locale === "tr" ? "Özellikler" : "Features", href: "#features" },
              { label: locale === "tr" ? "Fiyatlandırma" : "Pricing", href: "/pricing" },
              { label: locale === "tr" ? "Blog" : "Blog", href: "#" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[0.6rem] px-3.5 py-2 text-[0.8125rem] font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted)/0.7)] hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-2">
            <LocaleSwitcher locale={locale} />
            <Link
              href="/auth?tab=login"
              className="hidden rounded-[0.6rem] px-3.5 py-2 text-[0.8125rem] font-medium text-[hsl(var(--muted-foreground))] transition hover:text-foreground sm:block"
            >
              {common.signInLabel}
            </Link>
            <Link
              href="/auth?tab=register"
              className="flex items-center gap-1.5 rounded-[0.6rem] bg-[hsl(var(--primary))] px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_1px_2px_hsl(0,0%,0%/0.12)] transition hover:bg-[hsl(var(--primary-strong))] hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)]"
            >
              {primaryCta}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
                <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* ════════════════════════════════════════════
            HERO — Aurora spotlight
        ════════════════════════════════════════════ */}
        <section className="hero-aurora relative mx-auto max-w-[1160px] px-6 pb-16 pt-20 text-center lg:pb-24 lg:pt-28">

          {/* Eyebrow badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/0.22)] bg-[hsl(var(--primary)/0.06)] px-4 py-1.5">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              {heroEyebrow}
            </span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-balance text-[3rem] font-bold leading-[1.04] tracking-[-0.07em] text-foreground sm:text-[4.25rem] lg:text-[5rem]">
            {heroTitle}
          </h1>

          {/* Sub */}
          <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-[hsl(var(--muted-foreground))]">
            {heroSub}
          </p>

          {/* CTA cluster */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth?tab=register"
              className="flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_hsl(0,0%,0%/0.14),0_8px_24px_hsl(var(--primary)/0.32)] transition hover:bg-[hsl(var(--primary-strong))] hover:shadow-[0_8px_32px_hsl(var(--primary)/0.4)] active:scale-[0.98]"
            >
              {primaryCta}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 rounded-full border border-[hsl(var(--border)/0.8)] bg-[hsl(var(--card)/0.8)] px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--card))]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5.5 5.5l3 1.5-3 1.5V5.5z" fill="currentColor" />
              </svg>
              {secondaryCta}
            </Link>
          </div>

          {/* Trust footnote */}
          <p className="mt-5 text-[11.5px] text-[hsl(var(--muted-foreground)/0.7)]">
            {locale === "tr" ? "Kredi kartı gerekmez • Ücretsiz plan sonsuza kadar ücretsiz" : "No credit card required · Free plan, forever free"}
          </p>

          {/* ── Stats bar ── */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-[hsl(var(--border)/0.5)] rounded-[1.1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.7)] px-2 py-4 backdrop-blur-sm shadow-[0_4px_24px_hsl(var(--shadow-color)/0.06)]">
            {statsData.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5 px-4">
                <span className="text-[1.6rem] font-bold tracking-[-0.05em] text-foreground">
                  {s.value}
                </span>
                <span className="text-center text-[11px] text-[hsl(var(--muted-foreground))]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Product preview screenshot ── */}
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border)/0.5)] shadow-[0_32px_80px_hsl(var(--shadow-color)/0.18),0_0_0_1px_hsl(var(--border)/0.3)] bg-[hsl(var(--card)/0.6)] backdrop-blur-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.4)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                <div className="ml-3 flex-1 rounded-[0.4rem] bg-[hsl(var(--muted)/0.6)] px-3 py-1 text-center text-[11px] text-[hsl(var(--muted-foreground))]">
                  app.lalalaunchboard.com/dashboard
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="flex min-h-[340px] bg-[hsl(var(--background))]">
                {/* Mini sidebar */}
                <div className="hidden w-[160px] shrink-0 border-r border-[hsl(var(--border)/0.5)] bg-[hsl(var(--sidebar-bg))] sm:block">
                  <div className="flex items-center gap-2 border-b border-[hsl(var(--border)/0.4)] px-3 py-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] bg-[hsl(var(--primary))]">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 9V4l4-2.5L10 4v5a.8.8 0 01-.8.8H2.8A.8.8 0 012 9z" fill="white" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-semibold text-foreground">Lalalaunch</span>
                  </div>
                  <div className="space-y-0.5 p-2">
                    {["Dashboard", "Boards", "Growth", "Settings"].map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-1.5 rounded-[0.5rem] px-2 py-1.5 text-[10px] font-medium ${i === 0 ? "bg-[hsl(var(--sidebar-item-active))] text-[hsl(var(--sidebar-item-active-text))]" : "text-[hsl(var(--muted-foreground))]"}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main area */}
                <div className="flex-1 p-5">
                  {/* KPI row */}
                  <div className="mb-4 grid grid-cols-3 gap-2.5">
                    {[
                      { label: "Boards", val: "3", color: "hsl(var(--primary))" },
                      { label: "Geri sayım", val: "14g", color: "hsl(38 92% 52%)" },
                      { label: "Hazırlık", val: "68%", color: "hsl(152 58% 42%)" }
                    ].map((k) => (
                      <div key={k.label} className="rounded-[0.8rem] border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card))] p-3">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{k.label}</p>
                        <p className="mt-1.5 text-xl font-bold tracking-[-0.04em]" style={{ color: k.color }}>{k.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Primary board card */}
                  <div className="overflow-hidden rounded-[0.8rem] bg-[linear-gradient(145deg,hsl(var(--surface-dark-start)/0.97),hsl(var(--surface-dark-end)/0.99))] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--surface-dark-muted))]">ANA BOARD</p>
                        <p className="mt-1 text-sm font-semibold text-[hsl(var(--surface-dark-foreground))]">FocusFlow iOS</p>
                      </div>
                      <span className="rounded-full border border-[hsl(var(--surface-dark-foreground)/0.14)] px-2 py-0.5 text-[8px] font-semibold text-[hsl(var(--surface-dark-muted))]">
                        iOS
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--surface-dark-foreground)/0.1)]">
                      <div className="h-full w-[68%] rounded-full bg-[hsl(var(--primary))]" />
                    </div>
                    <p className="mt-1.5 text-[8px] text-[hsl(var(--surface-dark-muted))]">Hazırlık %68 · 14 gün kaldı</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="relative -mt-4 flex justify-end px-6">
              <div className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card)/0.95)] px-3 py-1.5 text-[11px] font-medium text-foreground shadow-[0_4px_12px_hsl(var(--shadow-color)/0.1)] backdrop-blur-sm">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="hsl(var(--success))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[hsl(var(--success))]">{locale === "tr" ? "Launch günü geldi!" : "Launch day arrived!"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            LOGOS / SOCIAL PROOF BAR
        ════════════════════════════════════════════ */}
        <section className="border-y border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.3)]">
          <div className="mx-auto max-w-[1160px] px-6 py-5">
            <p className="mb-4 text-center text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground)/0.6)]">
              {locale === "tr" ? "Kullanan kurucuların geçmişi" : "Trusted by founders from"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {["Notion alums", "Figma alums", "Stripe alums", "Linear alums", "Vercel alums"].map((co) => (
                <span
                  key={co}
                  className="text-[12.5px] font-semibold tracking-[-0.01em] text-[hsl(var(--muted-foreground)/0.45)]"
                >
                  {co}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURES — 3-col grid
        ════════════════════════════════════════════ */}
        <section id="features" className="mx-auto max-w-[1160px] px-6 py-24">
          {/* Section header */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
              {locale === "tr" ? "Özellikler" : "Features"}
            </p>
            <h2 className="text-balance text-[2.25rem] font-bold tracking-[-0.06em] text-foreground sm:text-[2.75rem]">
              {locale === "tr"
                ? "Lansmandan büyümeye — her şey tek sistemde"
                : "From launch to growth — everything in one system"}
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-7 text-[hsl(var(--muted-foreground))]">
              {locale === "tr"
                ? "Birden fazla araca dağılmak yerine, karar vermeyi hızlandıran birkaç net yüzey."
                : "Instead of sprawling across tools, you get a few focused surfaces that speed up decisions."}
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="glow-card group relative overflow-hidden rounded-[1.1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm"
              >
                {/* Icon */}
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-[0.65rem] border border-[hsl(var(--border)/0.5)]"
                  style={{ color: accentMap[f.accent], background: `${accentMap[f.accent]}14` }}
                >
                  {f.icon}
                </div>

                {/* Subtle glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${accentMap[f.accent]}0d, transparent 55%)`
                  }}
                />

                <h3 className="mb-2 text-[1rem] font-semibold tracking-[-0.025em] text-foreground">
                  {f.title}
                </h3>
                <p className="text-[0.875rem] leading-6 text-[hsl(var(--muted-foreground))]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS — numbered steps
        ════════════════════════════════════════════ */}
        <section className="border-t border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.25)]">
          <div className="mx-auto max-w-[1160px] px-6 py-24">
            <div className="mb-14 text-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
                {locale === "tr" ? "Nasıl çalışır?" : "How it works"}
              </p>
              <h2 className="text-balance text-[2.25rem] font-bold tracking-[-0.06em] text-foreground sm:text-[2.75rem]">
                {locale === "tr" ? "3 adımda hedefe" : "Reach the goal in 3 steps"}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: locale === "tr" ? "Board'unu kur" : "Set up your board",
                  body: locale === "tr"
                    ? "Ürün adı, platformu ve launch tarihi al. Sistem anında yapılacaklar ve geri sayım akışını oluşturur."
                    : "Add product name, platform, and launch date. The system instantly builds your checklist and countdown flow."
                },
                {
                  num: "02",
                  title: locale === "tr" ? "Hazırlık ritmine gir" : "Get into prep rhythm",
                  body: locale === "tr"
                    ? "Checklist, teslimler ve takvim aynı yerde ilerler. Ekibin neye odaklanacağını her sabah görür."
                    : "Checklist, deliverables, and calendar move together. Your team sees exactly where to focus every morning."
                },
                {
                  num: "03",
                  title: locale === "tr" ? "Launch ve büyüt" : "Launch and grow",
                  body: locale === "tr"
                    ? "Launch günü, yayın bildirimi ve growth adımları aynı sistemin içinde devam eder."
                    : "Launch day, announcement, and growth steps all continue inside the same system without starting over."
                }
              ].map((step) => (
                <div key={step.num} className="relative flex flex-col gap-4 rounded-[1.1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.7)] p-6">
                  <span className="text-[3.5rem] font-black leading-none tracking-[-0.1em] text-[hsl(var(--primary)/0.12)]">
                    {step.num}
                  </span>
                  <div className="-mt-2 space-y-2">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-[0.875rem] leading-6 text-[hsl(var(--muted-foreground))]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[1160px] px-6 py-24">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
              {locale === "tr" ? "Kurucular ne diyor?" : "What founders say"}
            </p>
            <h2 className="text-balance text-[2.25rem] font-bold tracking-[-0.06em] text-foreground sm:text-[2.75rem]">
              {locale === "tr" ? "Gerçek sonuçlar, gerçek ekiplerden" : "Real results from real teams"}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="flex flex-col gap-5 rounded-[1.1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="hsl(38 92% 52%)" aria-hidden>
                      <path d="M7 1l1.76 3.57L13 5.24l-3 2.93.7 4.14L7 10.18l-3.7 2.13.7-4.14L1 5.24l4.24-.67L7 1z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="flex-1 text-[0.9rem] leading-7 text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[11px] font-bold text-[hsl(var(--primary))]">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[0.8125rem] font-semibold text-foreground">{t.author}</p>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CTA — Dark gradient band
        ════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[1160px] px-6 pb-24">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,hsl(224,28%,9%),hsl(235,28%,12%)_40%,hsl(222,26%,10%))] px-8 py-14 shadow-[0_24px_68px_hsl(var(--shadow-color)/0.24)] sm:px-14">
            {/* Aurora glow inside CTA */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[hsl(var(--primary)/0.18)] blur-[80px]" />
              <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-[hsl(265,80%,60%/0.12)] blur-[60px]" />
            </div>

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-xl space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--surface-dark-muted))]">
                  {locale === "tr" ? "Hemen başla" : "Get started now"}
                </p>
                <h2 className="text-balance text-[2rem] font-bold leading-[1.08] tracking-[-0.06em] text-white sm:text-[2.6rem]">
                  {locale === "tr"
                    ? "İlk board'unu aç. Lansman gününde hazır ol."
                    : "Open your first board. Be ready on launch day."}
                </h2>
                <p className="text-[0.9375rem] leading-7 text-[hsl(var(--surface-dark-muted))]">
                  {locale === "tr"
                    ? "Kayıt ol, board'unu kur, launch ritmini başlat. Kredi kartı gerekmez."
                    : "Sign up, set up your board, start your launch rhythm. No credit card needed."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/auth?tab=register"
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[hsl(224,28%,9%)] transition hover:bg-[hsl(0,0%,94%)] hover:shadow-[0_4px_24px_hsl(0,0%,100%/0.18)]"
                >
                  {primaryCta}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/auth?tab=login"
                  className="flex items-center justify-center rounded-full border border-[hsl(var(--surface-dark-foreground)/0.18)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--surface-dark-foreground)/0.08)]"
                >
                  {common.signInLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="border-t border-[hsl(var(--border)/0.5)]">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] bg-[hsl(var(--primary))]">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 9V4l4-2.5L10 4v5a.8.8 0 01-.8.8H2.8A.8.8 0 012 9z" fill="white" />
              </svg>
            </span>
            <span className="text-[0.8rem] font-semibold text-foreground">Lalalaunchboard</span>
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            {[
              { label: locale === "tr" ? "Fiyatlandırma" : "Pricing", href: "/pricing" },
              { label: locale === "tr" ? "Gizlilik" : "Privacy", href: "#" },
              { label: locale === "tr" ? "Koşullar" : "Terms", href: "#" }
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-[0.8rem] text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <p className="text-[0.8rem] text-[hsl(var(--muted-foreground))]">
              © 2026 Lalalaunchboard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
