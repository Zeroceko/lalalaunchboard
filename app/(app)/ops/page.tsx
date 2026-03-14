import Link from "next/link";

import {
  LaunchBadge,
  LaunchMetricCard,
  LaunchMiniStat,
  LaunchNotice,
  LaunchPage,
  LaunchPanel,
  LaunchPillList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getTaskOverview } from "@/lib/admin/tasks-overview";

function getToneForLevel(level: string) {
  switch (level) {
    case "Tamamlandi":
      return "success" as const;
    case "Ileri seviye":
      return "brand" as const;
    case "Orta seviye":
      return "warning" as const;
    case "Basladi":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function getBarTone(rate: number) {
  if (rate >= 100) {
    return "bg-[hsl(var(--success))]";
  }

  if (rate >= 67) {
    return "bg-[hsl(var(--primary))]";
  }

  if (rate >= 34) {
    return "bg-[hsl(var(--warning))]";
  }

  return "bg-[hsl(var(--muted-foreground))/0.35]";
}

function getReleaseLabel(rate: number, laggingCount: number) {
  if (rate >= 85 && laggingCount === 0) {
    return "Release'e yakin";
  }

  if (rate >= 60) {
    return "Kontrollu ilerliyor";
  }

  return "Yogun koordinasyon istiyor";
}

export default async function OpsPage() {
  const overview = await getTaskOverview();
  const completedSections = overview.sections.filter(
    (section) => section.completionRate === 100
  ).length;
  const topSection = [...overview.sections].sort(
    (left, right) => right.completionRate - left.completionRate
  )[0];
  const laggingSections = [...overview.sections]
    .filter((section) => section.completionRate < 67)
    .sort((left, right) => left.completionRate - right.completionRate);
  const activeSections = [...overview.sections]
    .filter(
      (section) =>
        section.completionRate > 0 && section.completionRate < 100
    )
    .sort((left, right) => right.openTasks.length - left.openTasks.length);
  const executionQueue = overview.openTasks.slice(0, 7);
  const releaseLabel = getReleaseLabel(
    overview.completionRate,
    laggingSections.length
  );

  return (
    <LaunchPage className="py-8">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_320px]">
        <LaunchPanel tone="dark" className="space-y-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <LaunchBadge
                  tone="warning"
                  className="bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
                >
                  Internal control tower
                </LaunchBadge>
                <LaunchBadge
                  tone="neutral"
                  className="bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
                >
                  {releaseLabel}
                </LaunchBadge>
              </div>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[hsl(var(--surface-dark-foreground))] sm:text-5xl">
                  Lalalaunchboard&apos;un gidisatini tek komuta ekraninda oku.
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-[hsl(var(--surface-dark-muted))]">
                  Bu panel dogrudan `specs/tasks.md` dosyasindaki checkbox&apos;lari
                  okuyup hangi sprint alaninin kapandigini, neyin takildigini ve
                  hangi task&apos;in sonraki toplantida masaya gelmesi gerektigini
                  gosterir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className={launchButtonStyles.secondary}>
                Dashboard
              </Link>
              <Link href="/admin" className={launchButtonStyles.secondary}>
                Portfoy paneli
              </Link>
            </div>
          </div>

          <LaunchPillList
            className="text-[hsl(var(--surface-dark-foreground))]"
            items={[
              `${overview.sections.length} lane`,
              `${overview.openTasks.length} acik task`,
              `${completedSections} kapanan bolum`,
              `${laggingSections.length} riskli alan`
            ]}
          />
        </LaunchPanel>

        <div className="space-y-5">
          <LaunchPanel tone="subtle" className="space-y-4">
            <div className="space-y-2">
              <LaunchBadge tone="brand">Veri kaynagi</LaunchBadge>
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                specs/tasks.md + roadmap
              </h2>
            </div>
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              Yonetici paneli code truth degil, execution truth okuyacak sekilde
              tasarlandi.
            </p>
          </LaunchPanel>

          <LaunchPanel tone="clay" className="space-y-4">
            <div className="space-y-2">
              <LaunchBadge tone="warning">Sync state</LaunchBadge>
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                Bugun neye bakiyoruz
              </h2>
            </div>
            <div className="space-y-3">
              <LaunchMiniStat
                label="Acik task"
                value={overview.openTasks.length}
                detail="Toplam bekleyen madde"
                tone="warning"
              />
              <LaunchMiniStat
                label="En guclu lane"
                value={topSection ? `${topSection.id}. ${topSection.title}` : "Yok"}
                detail="En yuksek tamamlama"
                tone="success"
              />
            </div>
          </LaunchPanel>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <LaunchMetricCard
          label="Genel tamamlama"
          value={`%${overview.completionRate}`}
          detail="Tum task checkbox'larinin toplam ilerleme seviyesi."
          tone="brand"
        />
        <LaunchMetricCard
          label="Delivery load"
          value={`${overview.openTasks.length} acik`}
          detail="Bir sonraki calisma turunda ele alinacak bekleyen isler."
          tone="warning"
        />
        <LaunchMetricCard
          label="Release posture"
          value={releaseLabel}
          detail="Ilerleme ve risk yogunluguna gore tek satirlik durum ozeti."
          tone="success"
        />
      </div>

      <section className="space-y-5">
        <LaunchSectionHeader
          eyebrow="Section matrix"
          title="Epic lane'leri oran ve risk birlikte okusun"
          description="Burada sadece yuzde degil, bolum bazli yavaslama, bitis ve acik task yogunlugu ayni ekranda kalir."
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <LaunchPanel tone="default" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {overview.sections.map((section) => {
                const isComplete = section.completionRate === 100;
                const detailsClassName = isComplete
                  ? "mt-4 space-y-2 max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-200 ease-out group-hover:max-h-48 group-hover:opacity-100 group-focus-within:max-h-48 group-focus-within:opacity-100"
                  : "mt-4 space-y-2";

                return (
                  <div
                    key={section.id}
                    tabIndex={isComplete ? 0 : undefined}
                    className={`group rounded-[1.35rem] border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.92] p-4 shadow-[0_14px_34px_hsl(var(--shadow-color)/0.05)] ${
                      isComplete
                        ? "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))/0.32] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <LaunchBadge tone={getToneForLevel(section.level)}>
                          {section.level}
                        </LaunchBadge>
                        <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                          {section.id}. {section.title}
                        </h3>
                      </div>
                      <div className="rounded-[0.95rem] border border-[hsl(var(--border))/0.5] bg-[hsl(var(--surface-inset))/0.82] px-3 py-2 text-right">
                        <p className="text-lg font-semibold text-foreground">
                          %{section.completionRate}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                          {section.completed}/{section.total}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[hsl(var(--surface-inset))/0.92]">
                      <div
                        className={`h-full rounded-full ${getBarTone(section.completionRate)}`}
                        style={{ width: `${section.completionRate}%` }}
                      />
                    </div>

                    {isComplete ? (
                      <p className="mt-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
                        Tamamlandi. Detaylari gormek icin uzerine gel veya odakla.
                      </p>
                    ) : null}

                    <div className={detailsClassName}>
                      {section.openTasks.length > 0 ? (
                        section.openTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="rounded-[0.95rem] border border-[hsl(var(--border))/0.45] bg-[hsl(var(--surface-inset))/0.75] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]"
                          >
                            <span className="font-semibold text-foreground">
                              {task.id}
                            </span>{" "}
                            {task.title}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[0.95rem] border border-[hsl(var(--success))/0.18] bg-[hsl(var(--success-soft))/0.92] px-3 py-2 text-sm text-foreground">
                          Bu bolumde acik gorev kalmadi.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </LaunchPanel>

          <div className="space-y-6">
            <LaunchPanel tone="tint" className="space-y-4">
              <div className="space-y-2">
                <LaunchBadge tone="warning">Risk board</LaunchBadge>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Tikanan alanlar
                </h3>
              </div>

              <div className="space-y-3">
                {laggingSections.length > 0 ? (
                  laggingSections.slice(0, 4).map((section) => (
                    <div
                      key={section.id}
                      className="rounded-[1.1rem] border border-[hsl(var(--border))/0.48] bg-[hsl(var(--card))/0.92] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          {section.id}. {section.title}
                        </p>
                        <LaunchBadge tone={getToneForLevel(section.level)}>
                          %{section.completionRate}
                        </LaunchBadge>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
                        {section.openTasks.length} acik task bu alanin yeniden ele
                        alinmasi gerektigini gosteriyor.
                      </p>
                    </div>
                  ))
                ) : (
                  <LaunchNotice tone="success">Kritik risk gorunmuyor.</LaunchNotice>
                )}
              </div>
            </LaunchPanel>

            <LaunchPanel tone="brand" className="space-y-4">
              <div className="space-y-2">
                <LaunchBadge tone="brand">Focus lanes</LaunchBadge>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Momentum tasiyan alanlar
                </h3>
              </div>

              <div className="space-y-3">
                {activeSections.length > 0 ? (
                  activeSections.slice(0, 4).map((section) => (
                    <div
                      key={section.id}
                      className="rounded-[1.1rem] border border-white/20 bg-white/14 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          {section.id}. {section.title}
                        </p>
                        <span className="text-sm font-semibold text-foreground">
                          %{section.completionRate}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{ width: `${section.completionRate}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <LaunchNotice tone="info">Aktif lane gorunmuyor.</LaunchNotice>
                )}
              </div>
            </LaunchPanel>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <LaunchSectionHeader
          eyebrow="Execution queue"
          title="Bir sonraki toplantida masaya gelecek acik isler"
          description="Task listesi dogrudan specs'ten okunur; bu yuzden panel dekoratif degil, calisma akisina bagli canli bir katman gibi davranir."
        />

        <LaunchPanel tone="default" className="space-y-4">
          <div className="grid gap-3">
            {executionQueue.length > 0 ? (
              executionQueue.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-[1.15rem] border border-[hsl(var(--border))/0.48] bg-[hsl(var(--card))/0.92] px-4 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-[0.85rem] bg-[hsl(var(--surface-inset))/0.88] text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <LaunchNotice tone="success">Acik execution queue gorunmuyor.</LaunchNotice>
            )}
          </div>
        </LaunchPanel>
      </section>
    </LaunchPage>
  );
}
