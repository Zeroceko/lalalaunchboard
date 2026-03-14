import Link from "next/link";

import { PortfolioBoardCard } from "@/components/dashboard/PortfolioBoardCard";
import {
  LaunchBadge,
  LaunchHero,
  LaunchMetricCard,
  LaunchNotice,
  LaunchPage,
  LaunchPanel,
  LaunchRailList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import {
  getPortfolioManagementSnapshot,
  resolvePortfolioErrorMessage
} from "@/lib/apps/management";
import { requireSessionContext } from "@/lib/auth/session";

const managementRail = [
  {
    title: "Checklist pulse",
    description:
      "Her board icin prep ilerlemesi ve acik alanlar tek panelde okunur.",
    badge: "Prep",
    tone: "brand" as const
  },
  {
    title: "Deliverable density",
    description:
      "Hangi workspace'in daha cok link, not veya dosya topladigi hemen gorunur.",
    badge: "Assets",
    tone: "clay" as const
  },
  {
    title: "Weekly routine",
    description:
      "Bu haftanin post-launch ritmi board bazinda ayrismis halde izlenir.",
    badge: "Growth",
    tone: "success" as const
  }
];

export default async function AdminPage() {
  const { supabase, user } = await requireSessionContext();

  let snapshot;

  try {
    snapshot = await getPortfolioManagementSnapshot(supabase, user.id);
  } catch (error) {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Panel waiting</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Yonetim paneli su anda board verisini bekliyor.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {resolvePortfolioErrorMessage(error)}
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  if (!snapshot.profile || !snapshot.limit) {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Profile sync</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Panel verisi henuz hazir degil.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Profil ve workspace baglantisi hazir oldugunda bu alan uygulama
            portfoyunu otomatik olarak gosterecek.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  return (
    <LaunchPage>
      <LaunchHero
        eyebrow="Portfoy yonetim paneli"
        title="Kullanicinin tum uygulama ilerlemesini tek komuta ekraninda izle."
        description="Bu yuzey artik Lalalaunchboard'un kendi backlog'unu gostermiyor. Onun yerine platformu kullanan kisinin checklist hizi, deliverable yogunlugu, launch takvimi ve haftalik routine ritmi board bazinda okunuyor."
        actions={
          <>
            <Link href="/dashboard" className={launchButtonStyles.secondary}>
              Dashboard&apos;a don
            </Link>
            <Link href="/app/new" className={launchButtonStyles.primary}>
              Yeni board olustur
            </Link>
          </>
        }
        aside={
          <LaunchRailList
            eyebrow="Panel mantigi"
            title="Ic backlog degil, gercek musteri board'lari"
            description="Bu panel kullanicinin hangi uygulamasina ne zaman mudahale etmesi gerektigini one cikarir."
            items={managementRail}
            className="h-full"
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <LaunchMetricCard
          label="Active boards"
          value={snapshot.totals.activeBoards}
          detail="Panelde izlenen toplam aktif workspace sayisi."
          tone="brand"
        />
        <LaunchMetricCard
          label="Avg checklist"
          value={`%${snapshot.totals.averageChecklistProgress}`}
          detail="Tum board'larin ortalama prep ilerlemesi."
          tone="success"
        />
        <LaunchMetricCard
          label="Due soon"
          value={snapshot.totals.dueSoonCount}
          detail="14 gun veya daha az kalan launch board sayisi."
          tone="warning"
        />
        <LaunchMetricCard
          label="At risk"
          value={snapshot.totals.atRiskCount}
          detail="Takvim ve ilerleme birlikte risk sinyali veren board sayisi."
          tone={snapshot.totals.atRiskCount > 0 ? "danger" : "clay"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <LaunchPanel tone="subtle" className="space-y-4">
          <div className="space-y-2">
            <LaunchBadge tone="neutral">Deliverables</LaunchBadge>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Toplanan cikti yogunlugu
            </h2>
          </div>
          <p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            {snapshot.totals.totalDeliverables}
          </p>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            Tum board&apos;larda biriken link, not ve dosya sayisi.
          </p>
        </LaunchPanel>

        <LaunchPanel tone="subtle" className="space-y-4">
          <div className="space-y-2">
            <LaunchBadge tone="neutral">Weekly rhythm</LaunchBadge>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Routine ortalamasi
            </h2>
          </div>
          <p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            %{snapshot.totals.averageRoutineProgress}
          </p>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            Hafta {snapshot.weekNumber} icin tum board&apos;larin ortalama routine tamamlanma orani.
          </p>
        </LaunchPanel>

        <LaunchPanel tone="subtle" className="space-y-4">
          <div className="space-y-2">
            <LaunchBadge tone="neutral">Data source</LaunchBadge>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Icerik kaynagi
            </h2>
          </div>
          <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Checklist:{" "}
            <span className="font-semibold text-foreground">
              {snapshot.checklistSource}
            </span>
            {"  "}
            Routine:{" "}
            <span className="font-semibold text-foreground">
              {snapshot.routineSource}
            </span>
          </p>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            Contentful bagli degilse panel fallback icerikle calismaya devam eder.
          </p>
        </LaunchPanel>
      </div>

      {!snapshot.limit.canCreateApp ? (
        <LaunchNotice tone="warning">
          Free plan kapasitesi dolu. Bu panel yeni board acmaktan cok mevcut
          board&apos;larin onceligini yonetmek icin calisiyor.
        </LaunchNotice>
      ) : null}

      <section className="space-y-5">
        <LaunchSectionHeader
          eyebrow="Board queue"
          title="Oncelik sirasiyla portfoy gorunumu"
          description="Kartlar launch takvimi, checklist ilerlemesi, deliverable yogunlugu ve haftalik routine sinyallerine gore siralanir. En ustteki board genellikle en hizli aksiyon isteyen board'dur."
          action={
            <Link href="/dashboard" className={launchButtonStyles.secondary}>
              Ana dashboard
            </Link>
          }
        />

        {snapshot.boards.length === 0 ? (
          <LaunchPanel tone="clay" className="space-y-4">
            <LaunchBadge tone="clay">Portfoy bos</LaunchBadge>
            <h3 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Yonetim paneli ilk board ile anlam kazanir.
            </h3>
            <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
              Yeni bir uygulama eklendiginde burasi checklist ilerlemesini,
              deliverable birikimini ve routine ritmini board bazinda gostermeye
              baslar.
            </p>
            <div>
              <Link href="/app/new" className={launchButtonStyles.primary}>
                Ilk board&apos;u olustur
              </Link>
            </div>
          </LaunchPanel>
        ) : (
          <div className="grid gap-6">
            {snapshot.boards.map((board) => (
              <PortfolioBoardCard key={board.app.id} board={board} />
            ))}
          </div>
        )}
      </section>
    </LaunchPage>
  );
}
