import Link from "next/link";

import { NewAppForm } from "@/components/dashboard/NewAppForm";
import {
  LaunchBadge,
  LaunchHero,
  LaunchPage,
  LaunchPanel,
  LaunchRailList,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getAppCreationState } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";

const setupFlow = [
  {
    title: "Choose identity",
    description:
      "Isim ve platform secimi board kartinin dili ile ilk prep odagini belirler.",
    badge: "Identity",
    tone: "brand" as const
  },
  {
    title: "Set launch window",
    description:
      "Launch date sabitlenince countdown ve checklist ritmi ayni merkeze baglanir.",
    badge: "Timing",
    tone: "warning" as const
  },
  {
    title: "Open the board",
    description:
      "Kurulum biter bitmez dashboard ve sonraki workflow katmanlari ayni yapida acilir.",
    badge: "Go live",
    tone: "success" as const
  }
];

export default async function NewAppPage() {
  const { supabase, user } = await requireSessionContext();
  let state;

  try {
    state = await getAppCreationState(supabase, user.id);
  } catch {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="max-w-3xl space-y-4">
          <LaunchBadge tone="warning">Schema waiting</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Yeni workspace akisi su anda veritabani baglantisini bekliyor.
          </h1>
          <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Migration tarafi tamamlandiginda bu ekran gercek board olusturma
            akisini aktif edecektir.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  if (!state.profile || !state.limit) {
    return (
      <LaunchPage className="py-14">
        <LaunchPanel tone="warning" className="max-w-3xl space-y-4">
          <LaunchBadge tone="warning">Profile sync</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Yeni workspace ekrani henuz hazir degil.
          </h1>
          <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
            Kullanici profili hazir oldugunda bu setup akisi otomatik olarak
            calismaya baslayacak.
          </p>
        </LaunchPanel>
      </LaunchPage>
    );
  }

  return (
    <LaunchPage>
      <LaunchHero
        eyebrow="New launch workspace"
        title="Yeni uygulaman icin board'u sifirdan kur."
        description="Ilk uygulamani ekle ve pre-launch surecini baslat. Bu ekran isim, platform ve launch window gibi temel kararlari sabitler; hemen ardindan seni checklist workspace'ine tasir."
        actions={
          <>
            <Link href="/dashboard" className={launchButtonStyles.secondary}>
              Dashboard&apos;a don
            </Link>
            <Link href="/" className={launchButtonStyles.subtle}>
              Urun vitrini
            </Link>
          </>
        }
        aside={
          <LaunchRailList
            eyebrow="Onboarding step 2/3"
            title="Uc net adim"
            description="Bu alan uzun bir form gibi davranmaz. Her karar bir sonraki launch katmanina temel verir."
            items={setupFlow}
            className="h-full"
          />
        }
      />

      <NewAppForm limit={state.limit} />
    </LaunchPage>
  );
}
