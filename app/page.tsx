const pillars = [
  {
    title: "Prep lane",
    description: "Checklist, progress ve deliverable akisini tek workspace icinde toplar."
  },
  {
    title: "Launch lane",
    description: "Countdown, release tarihi ve launch onceki kritik adimlari netlestirir."
  },
  {
    title: "Grow lane",
    description: "Post-launch ritmi ve export ciktilariyla momentumun kaybolmasini engeller."
  }
];

const previewCards = [
  {
    label: "Checklist",
    title: "Store Prep 78%",
    detail: "Screenshots, listing copy ve legal hazirlik ayni board'da."
  },
  {
    label: "Routine",
    title: "Week 12 cadence",
    detail: "Analytics, feedback review ve growth deneyi her hafta tekrar eder."
  },
  {
    label: "Export",
    title: "Investor-ready report",
    detail: "PDF ve Markdown raporlari tek tikla paylasilabilir."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-foreground/10 bg-white/75 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              LB
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">Lalalaunchboard</p>
              <p className="text-xs text-muted-foreground">
                Prep, launch, and grow - all on one board.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/auth"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              Get inside
            </a>
            <a
              href="/dashboard"
              className="rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium transition hover:bg-secondary/40"
            >
              View workspace
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl items-center px-6 pb-10 pt-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-foreground/10 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
              Source of truth: <code className="ml-2 rounded bg-foreground/5 px-2 py-0.5">/specs</code>
            </div>
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                Launch Operating System
              </p>
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                Your launch plan should feel like a system, not a scattered checklist.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Lalalaunchboard turns launch prep into a visible operating rhythm:
                one workspace per app, one flow from prep to post-launch, one place
                for the outputs you actually need to share.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/auth"
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:translate-y-[-1px] hover:shadow-lg"
              >
                Start building your board
              </a>
              <a
                href="/dashboard"
                className="rounded-full border border-foreground/10 bg-white/70 px-5 py-3 text-sm font-medium transition hover:bg-white"
              >
                Open product shell
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[1.5rem] border border-foreground/10 bg-white/75 p-5 shadow-sm backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                    {pillar.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-foreground/10 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.9))] p-6 text-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Product preview
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    One board. Three rhythms.
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  MVP active
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                {previewCards.map((card, index) => (
                  <div
                    key={card.label}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {card.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold">{card.title}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {card.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
