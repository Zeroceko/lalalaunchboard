import Link from "next/link";

import { AppList } from "@/components/dashboard/AppList";
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
import { getWorkspaceSnapshot } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";

const boardFlow = [
  {
    title: "Boards stay readable",
    description:
      "Her uygulama icin tarih, platform tonu ve prep stack tek kartta okunur kalir.",
    badge: "Visibility",
    tone: "brand" as const
  },
  {
    title: "Timing drives focus",
    description:
      "Countdown boardun kenar verisi degil; siradaki hamleyi belirleyen ana sinyaldir.",
    badge: "Timing",
    tone: "warning" as const
  },
  {
    title: "The system expands",
    description:
      "Checklist, progress ve routine modulleri bu ayni board mantiginin ustune oturur.",
    badge: "Scale",
    tone: "success" as const
  }
];

export default async function DashboardPage() {
  const { supabase, user } = await requireSessionContext();
  let snapshot;

  try {
    snapshot = await getWorkspaceSnapshot(supabase, user.id);
  } catch {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="space-y-4">
          <LaunchBadge tone="warning">Schema waiting</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Dashboard su anda veritabani baglantisini bekliyor.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Remote Supabase migration tarafi tamamlandiginda launch board&apos;lari
            bu ekranda dogrudan okunur hale gelecek.
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
            Workspace verisi henuz hazir degil.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Supabase Auth ve profil senkronu tamamlandiginda dashboard otomatik
            olarak aktif hale gelir.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  const createAction = snapshot.limit.canCreateApp ? (
    <Link href="/app/new" className={launchButtonStyles.primary}>
      Yeni board olustur
    </Link>
  ) : (
    <span className="inline-flex rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.95] px-4 py-3 text-sm font-semibold text-[hsl(var(--warning-foreground))] shadow-[0_12px_30px_hsl(var(--shadow-color)/0.08)]">
      Pro plan ile yeni board ac
    </span>
  );

  return (
    <LaunchPage>
      <LaunchHero
        eyebrow="Launch command center"
        title="Tum launch board'larini tek komuta ekraninda yonet."
        description="Her uygulama icin prep, launch date, next move ve board durumu ayni yuzeyde kalir. Bu ekran liste gostermekten cok, neye odaklanman gerektigini hizla okutmak icin vardir."
        actions={
          <>
            {createAction}
            <Link href="/ops" className={launchButtonStyles.secondary}>
              Control tower
            </Link>
            <span className="inline-flex rounded-full border border-[hsl(var(--border))/0.7] bg-[hsl(var(--card))/0.92] px-4 py-3 text-sm font-semibold text-[hsl(var(--muted-foreground))] shadow-[0_12px_30px_hsl(var(--shadow-color)/0.08)]">
              {snapshot.apps.length} active board
            </span>
          </>
        }
        aside={
          <LaunchRailList
            eyebrow="Board model"
            title="Liste degil, calisan bir launch layer"
            description="Dashboard'un gorevi yalnizca veri gostermek degil. Hangi uygulamanin ne zaman neye ihtiyaci oldugunu ilk bakista okutmak."
            items={boardFlow}
            className="h-full"
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <LaunchMetricCard
          label="Plan"
          value={snapshot.limit.plan === "pro" ? "Pro" : "Free"}
          detail="Kapasite ve board sayisi bu asamada belirlenir."
          tone="brand"
        />
        <LaunchMetricCard
          label="Active boards"
          value={snapshot.limit.appCount}
          detail="Her uygulama kendi launch workspace'i olarak calisir."
          tone="clay"
        />
        <LaunchMetricCard
          label="Open slots"
          value={
            snapshot.limit.remainingSlots === null
              ? "Unlimited"
              : snapshot.limit.remainingSlots
          }
          detail={
            snapshot.limit.remainingSlots === null
              ? "Yeni urunler geldikce board sistemi buyumeye devam eder."
              : "Mevcut plan icinde acilabilecek yeni board alani."
          }
          tone={snapshot.limit.remainingSlots === 0 ? "warning" : "success"}
        />
      </div>

      {!snapshot.limit.canCreateApp ? (
        <LaunchNotice tone="warning">
          Mevcut free plan kapasitesi dolu. Yeni board acmak icin once bir
          workspace&apos;i silmen veya daha sonra Pro plana gecmen gerekir.
        </LaunchNotice>
      ) : null}

      <section className="space-y-5">
        <LaunchSectionHeader
          eyebrow="Active workspaces"
          title="Board'lari odak sirasi bozulmadan gor"
          description="Kartlar platform tonunu, launch timing'i ve siradaki hareketi ayni anda gosterir. Ayni yapi checklist ekranina da dogrudan tasinacak."
          action={
            snapshot.limit.canCreateApp ? (
              <Link href="/app/new" className={launchButtonStyles.secondary}>
                Yeni workspace
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-[hsl(var(--warning))/0.22] bg-[hsl(var(--amber-soft))/0.95] px-4 py-3 text-sm font-semibold text-[hsl(var(--warning-foreground))]">
                Slot dolu
              </span>
            )
          }
        />
        <AppList apps={snapshot.apps} canCreateApp={snapshot.limit.canCreateApp} />
      </section>
    </LaunchPage>
  );
}
