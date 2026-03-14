import Link from "next/link";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveRequestLocale } from "@/lib/i18n/server";

// ── Types ────────────────────────────────────────

type FeatureRow = {
  label: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
};

// ── Comparison table rows ─────────────────────────
const tableRows: FeatureRow[] = [
  // Boards
  { label: "Launch boards", starter: "1", pro: "10", enterprise: "Sınırsız" },
  { label: "Platform desteği (iOS · Android · Web)", starter: true, pro: true, enterprise: true },
  { label: "Çoklu varyant (staging, prod)", starter: false, pro: true, enterprise: true },
  { label: "Board arşivi", starter: false, pro: true, enterprise: true },
  // Workspace
  { label: "Ekip üyesi", starter: "1", pro: "5", enterprise: "Sınırsız" },
  { label: "Role-based erişim", starter: false, pro: true, enterprise: true },
  { label: "Ortak çalışma notları", starter: false, pro: true, enterprise: true },
  // Launch tools
  { label: "Hazırlık checklist", starter: true, pro: true, enterprise: true },
  { label: "Teslim takibi", starter: true, pro: true, enterprise: true },
  { label: "Canlı geri sayım", starter: true, pro: true, enterprise: true },
  { label: "Launch günü akış koçu", starter: false, pro: true, enterprise: true },
  { label: "Otomatik Store metadata şablonu", starter: false, pro: true, enterprise: true },
  // Growth & analytics
  { label: "Growth board (post-launch)", starter: false, pro: true, enterprise: true },
  { label: "DAU / MAU takibi", starter: false, pro: true, enterprise: true },
  { label: "Retention grafikleri (D1/D7/D30)", starter: false, pro: true, enterprise: true },
  { label: "Funnel analizi", starter: false, pro: true, enterprise: true },
  { label: "MRR & ARR izleme", starter: false, pro: false, enterprise: true },
  { label: "Özel KPI builder", starter: false, pro: false, enterprise: true },
  // Export & integrations
  { label: "Markdown export", starter: true, pro: true, enterprise: true },
  { label: "PDF deck export", starter: false, pro: true, enterprise: true },
  { label: "Slack notifikasyonu", starter: false, pro: true, enterprise: true },
  { label: "Notion sync", starter: false, pro: false, enterprise: true },
  { label: "API erişimi", starter: false, pro: false, enterprise: true },
  // Support
  { label: "Topluluk desteği", starter: true, pro: true, enterprise: true },
  { label: "Öncelikli e-posta desteği", starter: false, pro: true, enterprise: true },
  { label: "Özel onboarding", starter: false, pro: false, enterprise: true },
  { label: "SLA garantisi", starter: false, pro: false, enterprise: true },
];

const faqs = [
  {
    q: "Free plan ne kadar süre ücretsiz?",
    a: "Sonsuza kadar. Tek board, tüm temel özellikler, kredi kartı gerekmez."
  },
  {
    q: "Pro'ya geçince eski boardlarım kaybolur mu?",
    a: "Hayır. Tüm veriler korunur. Pro'ya geçtikten sonra yeni boardlar açılabilir ve mevcut board zenginleştirilir."
  },
  {
    q: "Ödeme yöntemleri neler?",
    a: "Kredi kartı, banka kartı (Stripe altyapısı). Türkiye'den TL ile ödeme desteği planlanıyor."
  },
  {
    q: "Enterprise fiyatı nasıl belirleniyor?",
    a: "Ekip büyüklüğü, board sayısı ve entegrasyon ihtiyacına göre özel teklif. Formu doldur, 24 saat içinde dönelim."
  },
  {
    q: "Bir ay deneyip iptal edebilir miyim?",
    a: "Evet. İstediğin zaman, istediğin yerden iptal. O ay sonunda plan Free'ye döner, verilerin durur."
  },
  {
    q: "Takımımda birden fazla kurucu var. Her biri ayrı ücret öder mi?",
    a: "Pro plan 5 üyeye kadar tek fiyat. 5 üyeyi geçen takımlar için Enterprise planı daha avantajlı."
  }
];

export default async function PricingPage() {
  const locale = resolveRequestLocale();
  const dict = getDictionary(locale);
  const { common } = dict;

  let user: { id: string } | null = null;
  if (hasSupabaseEnv()) {
    try {
      const session = await getSessionContext();
      user = session.user ? { id: session.user.id } : null;
    } catch (err) {
      console.warn("PricingPage session check:", err);
    }
  }

  const starterHref = user ? "/dashboard" : "/auth?tab=register";
  const proHref = user ? "/settings" : "/auth?tab=register";
  const enterpriseHref =
    "mailto:hello@lalalaunchboard.com?subject=Enterprise%20Plan%20Talebi";

  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border)/0.6)] bg-[hsl(var(--background)/0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-3.5">
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

          <nav className="hidden items-center gap-0.5 md:flex">
            {[
              { label: locale === "tr" ? "Özellikler" : "Features", href: "/#features" },
              { label: locale === "tr" ? "Blog" : "Blog", href: "#" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[0.6rem] px-3.5 py-2 text-[0.8125rem] font-medium text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted)/0.7)] hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher locale={locale} />
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-1.5 rounded-[0.6rem] bg-[hsl(var(--primary))] px-4 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-[hsl(var(--primary-strong))]">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth?tab=login" className="hidden rounded-[0.6rem] px-3.5 py-2 text-[0.8125rem] font-medium text-[hsl(var(--muted-foreground))] transition hover:text-foreground sm:block">
                  {common.signInLabel}
                </Link>
                <Link href="/auth?tab=register" className="flex items-center gap-1.5 rounded-[0.6rem] bg-[hsl(var(--primary))] px-4 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-[hsl(var(--primary-strong))]">
                  {common.signUpLabel}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>

        {/* ── Hero ── */}
        <section className="hero-aurora mx-auto max-w-[1160px] px-6 pb-16 pt-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/0.22)] bg-[hsl(var(--primary)/0.06)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              {locale === "tr" ? "Fiyatlandırma" : "Pricing"}
            </span>
          </div>
          <h1 className="mx-auto max-w-3xl text-balance text-[2.75rem] font-bold leading-[1.06] tracking-[-0.07em] text-foreground sm:text-[3.5rem]">
            {locale === "tr"
              ? "Bir board ile başla. Ekibinle büyü."
              : "Start with one board. Grow with your team."}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-7 text-[hsl(var(--muted-foreground))]">
            {locale === "tr"
              ? "Her aşama için doğru plan. İstediğinde yükselt, hiçbir zaman veri kaybetme."
              : "The right plan for every stage. Upgrade when ready, never lose your data."}
          </p>
        </section>

        {/* ── Pricing cards ── */}
        <section className="mx-auto max-w-[1160px] px-6 pb-20">
          <div className="grid gap-5 lg:grid-cols-3">

            {/* ── FREE ── */}
            <div className="flex flex-col rounded-[1.25rem] border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card)/0.85)] p-7 backdrop-blur-sm">
              <div className="mb-6 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--muted)/0.5)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  Starter
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[3rem] font-black tracking-[-0.08em] text-foreground">{locale === "tr" ? "Ücretsiz" : "Free"}</span>
                  </div>
                  <p className="mt-1 text-[0.875rem] text-[hsl(var(--muted-foreground))]">
                    {locale === "tr" ? "Sonsuza kadar, kredi kartı gerekmez" : "Forever, no credit card required"}
                  </p>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-2.5">
                {[
                  locale === "tr" ? "1 launch board" : "1 launch board",
                  locale === "tr" ? "iOS, Android veya web" : "iOS, Android or web",
                  locale === "tr" ? "Hazırlık checklisti" : "Prep checklist",
                  locale === "tr" ? "Canlı geri sayım" : "Live countdown",
                  locale === "tr" ? "Teslim dosya takibi" : "Deliverable tracking",
                  locale === "tr" ? "Markdown export" : "Markdown export",
                  locale === "tr" ? "Topluluk erişimi" : "Community access"
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.875rem] text-[hsl(var(--muted-foreground))]">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground)/0.5)]" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={starterHref} className="flex items-center justify-center rounded-full border border-[hsl(var(--border)/0.8)] bg-[hsl(var(--muted)/0.4)] px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[hsl(var(--muted)/0.7)]">
                {locale === "tr" ? "Ücretsiz başla" : "Start for free"}
              </Link>
            </div>

            {/* ── PRO (recommended) ── */}
            <div className="relative flex flex-col overflow-hidden rounded-[1.25rem] border border-[hsl(var(--primary)/0.35)] bg-[linear-gradient(160deg,hsl(224,28%,9%),hsl(232,30%,11%))] p-7 shadow-[0_0_0_1px_hsl(var(--primary)/0.1),0_24px_60px_hsl(var(--primary)/0.16)]">
              {/* Aurora inside card */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[hsl(var(--primary)/0.2)] blur-[60px]" />

              {/* Recommended chip */}
              <div className="mb-6 flex items-start justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.15)] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--primary))]">
                  Pro
                </div>
                <div className="rounded-full bg-[hsl(var(--primary))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  {locale === "tr" ? "En popüler" : "Most popular"}
                </div>
              </div>

              <div className="mb-6 space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[3rem] font-black tracking-[-0.08em] text-white">$19</span>
                  <span className="text-[0.875rem] font-medium text-[hsl(var(--surface-dark-muted))]">
                    {locale === "tr" ? "/ ay" : "/ mo"}
                  </span>
                </div>
                <p className="text-[0.875rem] text-[hsl(var(--surface-dark-muted))]">
                  {locale === "tr" ? "5 üyeye kadar · Yıllık ödemede $15/ay" : "Up to 5 members · $15/mo billed yearly"}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-2.5">
                {[
                  locale === "tr" ? "10 launch board" : "10 launch boards",
                  locale === "tr" ? "5 ekip üyesi" : "5 team members",
                  locale === "tr" ? "Tüm Starter özellikleri" : "All Starter features",
                  locale === "tr" ? "Growth board (DAU, MAU, Retention)" : "Growth board (DAU, MAU, Retention)",
                  locale === "tr" ? "Funnel analizi & Cohort görünümü" : "Funnel analysis & Cohort view",
                  locale === "tr" ? "Launch günü akış koçu" : "Launch day flow coach",
                  locale === "tr" ? "PDF deck export (investor-ready)" : "PDF deck export (investor-ready)",
                  locale === "tr" ? "Slack notifikasyonları" : "Slack notifications",
                  locale === "tr" ? "Store metadata şablonu" : "Store metadata template",
                  locale === "tr" ? "Öncelikli e-posta desteği" : "Priority email support"
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.875rem] text-white/80">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={proHref} className="flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_hsl(var(--primary)/0.4)] transition hover:bg-[hsl(var(--primary-strong))] hover:shadow-[0_8px_24px_hsl(var(--primary)/0.5)]">
                {locale === "tr" ? "Pro planı başlat" : "Start Pro"}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* ── ENTERPRISE ── */}
            <div className="flex flex-col rounded-[1.25rem] border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card)/0.85)] p-7 backdrop-blur-sm">
              <div className="mb-6 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--muted)/0.5)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  Enterprise
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[3rem] font-black tracking-[-0.08em] text-foreground">{locale === "tr" ? "Özel" : "Custom"}</span>
                  </div>
                  <p className="mt-1 text-[0.875rem] text-[hsl(var(--muted-foreground))]">
                    {locale === "tr" ? "Ekip ve ihtiyaca göre teklif" : "Quoted for team size & needs"}
                  </p>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-2.5">
                {[
                  locale === "tr" ? "Sınırsız board & üye" : "Unlimited boards & members",
                  locale === "tr" ? "Tüm Pro özellikleri" : "All Pro features",
                  locale === "tr" ? "MRR & ARR izleme" : "MRR & ARR tracking",
                  locale === "tr" ? "Özel KPI builder" : "Custom KPI builder",
                  locale === "tr" ? "Notion & Jira sync" : "Notion & Jira sync",
                  locale === "tr" ? "REST API erişimi" : "REST API access",
                  locale === "tr" ? "Özel onboarding seansı" : "Dedicated onboarding session",
                  locale === "tr" ? "SLA & 99.9% uptime garantisi" : "SLA & 99.9% uptime guarantee",
                  locale === "tr" ? "Öncelikli Slack desteği" : "Priority Slack support"
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.875rem] text-[hsl(var(--muted-foreground))]">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={enterpriseHref} className="flex items-center justify-center rounded-full border border-[hsl(var(--border)/0.8)] bg-[hsl(var(--muted)/0.4)] px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[hsl(var(--muted)/0.7)]">
                {locale === "tr" ? "Teklif al" : "Get a quote"}
              </Link>
            </div>
          </div>

          {/* Free trial note */}
          <p className="mt-5 text-center text-[12px] text-[hsl(var(--muted-foreground)/0.7)]">
            {locale === "tr"
              ? "Pro planı 14 gün ücretsiz dene. İptal için kart bilgisi gerekmez."
              : "14-day Pro trial. No card required to cancel."}
          </p>
        </section>

        {/* ── Comparison table ── */}
        <section className="border-t border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.2)]">
          <div className="mx-auto max-w-[1160px] px-6 py-20">
            <div className="mb-12 text-center">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
                {locale === "tr" ? "Tam karşılaştırma" : "Full comparison"}
              </p>
              <h2 className="text-[2rem] font-bold tracking-[-0.06em] text-foreground">
                {locale === "tr" ? "Planlar arasındaki farklar" : "What's different between plans"}
              </h2>
            </div>

            {/* Sticky header */}
            <div className="overflow-auto rounded-[1.1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.8)] backdrop-blur-sm">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(var(--border)/0.5)]">
                    <th className="py-4 pl-6 pr-4 text-left text-[0.8rem] font-semibold text-[hsl(var(--muted-foreground))]">
                      {locale === "tr" ? "Özellik" : "Feature"}
                    </th>
                    {[
                      { label: "Starter", sub: locale === "tr" ? "Ücretsiz" : "Free" },
                      { label: "Pro", sub: "$19/ay", highlight: true },
                      { label: "Enterprise", sub: locale === "tr" ? "Özel" : "Custom" }
                    ].map((col) => (
                      <th key={col.label} className={`py-4 px-4 text-center text-[0.8rem] font-semibold ${col.highlight ? "text-[hsl(var(--primary))]" : "text-foreground"}`}>
                        <div>{col.label}</div>
                        <div className="mt-0.5 text-[10.5px] font-normal text-[hsl(var(--muted-foreground))]">{col.sub}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={`border-b border-[hsl(var(--border)/0.35)] last:border-none ${i % 2 === 0 ? "" : "bg-[hsl(var(--muted)/0.15)]"}`}
                    >
                      <td className="py-3.5 pl-6 pr-4 text-[0.8375rem] text-foreground">
                        {row.label}
                      </td>
                      {(["starter", "pro", "enterprise"] as const).map((plan) => {
                        const val = row[plan];
                        return (
                          <td key={plan} className="px-4 py-3.5 text-center">
                            {val === true ? (
                              <svg className="mx-auto h-4 w-4 text-[hsl(var(--primary))]" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3.5 8l3.5 3.5 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : val === false ? (
                              <span className="mx-auto block h-[1px] w-4 bg-[hsl(var(--border)/0.7)] rounded" />
                            ) : (
                              <span className="text-[0.8rem] font-semibold text-foreground">{val as string}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="mx-auto max-w-[1160px] px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.06em] text-foreground">
              {locale === "tr" ? "Kurucular anlatıyor" : "Founders speak"}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                quote: locale === "tr"
                  ? "Pro plana geçtikten sonra growth board sayesinde D7 retansiyonumuzun nerede düştüğünü ilk kez net gördük. Bir haftada onboarding akışını değiştirdik."
                  : "After upgrading to Pro, the growth board showed us exactly where our D7 retention dropped — for the first time clearly. We changed the onboarding flow within a week.",
                name: "Zeynep A.", role: "Co-founder, Modivio"
              },
              {
                quote: locale === "tr"
                  ? "Yatırımcı toplantısından 2 saat önce boarddan PDF export aldık, sunuma hazır hâlde gittik. En iyi meeting'imizdi."
                  : "We exported a PDF deck from the board 2 hours before an investor meeting and walked in ready. Best meeting we'd had.",
                name: "Kerem Ö.", role: "CEO, Shiftly"
              },
              {
                quote: locale === "tr"
                  ? "Free planla başladım, 3 haftada Pro'ya geçtim. Tek şikayetim şu: daha erken başlamamak."
                  : "I started on Free, moved to Pro in 3 weeks. My only complaint: not starting sooner.",
                name: "Aylin S.", role: "Solo founder, Pingo"
              }
            ].map((t) => (
              <div key={t.name} className="flex flex-col gap-4 rounded-[1.1rem] border border-[hsl(var(--border)/0.55)] bg-[hsl(var(--card)/0.85)] p-6 backdrop-blur-sm">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="hsl(38 92% 52%)" aria-hidden>
                      <path d="M7 1l1.76 3.57L13 5.24l-3 2.93.7 4.14L7 10.18l-3.7 2.13.7-4.14L1 5.24l4.24-.67L7 1z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="flex-1 text-[0.875rem] leading-7 text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[11px] font-bold text-[hsl(var(--primary))]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[0.8125rem] font-semibold text-foreground">{t.name}</p>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-t border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.2)]">
          <div className="mx-auto max-w-[780px] px-6 py-20">
            <div className="mb-12 text-center">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">SSS</p>
              <h2 className="text-[2rem] font-bold tracking-[-0.06em] text-foreground">
                {locale === "tr" ? "Sıkça sorulan sorular" : "Frequently asked questions"}
              </h2>
            </div>
            <div className="divide-y divide-[hsl(var(--border)/0.5)]">
              {faqs.map((faq) => (
                <div key={faq.q} className="py-5">
                  <p className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-foreground">{faq.q}</p>
                  <p className="mt-2 text-[0.875rem] leading-7 text-[hsl(var(--muted-foreground))]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="mx-auto max-w-[1160px] px-6 py-20">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,hsl(224,28%,9%),hsl(235,28%,12%)_40%,hsl(222,26%,10%))] px-8 py-14 text-center shadow-[0_24px_68px_hsl(var(--shadow-color)/0.24)] sm:px-14">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[hsl(var(--primary)/0.2)] blur-[80px]" />
              <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-[hsl(265,80%,60%/0.12)] blur-[60px]" />
            </div>
            <div className="relative space-y-6">
              <h2 className="text-balance text-[2.25rem] font-bold tracking-[-0.06em] text-white sm:text-[2.75rem]">
                {locale === "tr" ? "Bugün başla. 14 gün Pro ücretsiz." : "Start today. 14 days Pro, free."}
              </h2>
              <p className="mx-auto max-w-lg text-[0.9375rem] leading-7 text-[hsl(var(--surface-dark-muted))]">
                {locale === "tr"
                  ? "Kart bilgisi gerekmez. İstediğin zaman iptal. Tüm veriler seninle kalır."
                  : "No card required. Cancel anytime. All your data stays with you."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href={proHref} className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[hsl(224,28%,9%)] transition hover:bg-[hsl(0,0%,94%)]">
                  {locale === "tr" ? "Ücretsiz dene" : "Try for free"}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href={enterpriseHref} className="rounded-full border border-[hsl(var(--surface-dark-foreground)/0.2)] px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-[hsl(var(--surface-dark-foreground)/0.08)]">
                  {locale === "tr" ? "Enterprise görüş" : "Talk to sales"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
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
              { label: locale === "tr" ? "Ana sayfa" : "Home", href: "/" },
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
            <p className="text-[0.8rem] text-[hsl(var(--muted-foreground))]">© 2026 Lalalaunchboard</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
