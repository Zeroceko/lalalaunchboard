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
import { getAppByIdForUser, getAppCreationState } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: SearchParams[string] | undefined) {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}

function parsePlatform(value: string | undefined) {
  if (value === "ios" || value === "android" || value === "web") {
    return value;
  }

  return undefined;
}

function parseMode(value: string | undefined) {
  if (value === "platform" || value === "client") {
    return value;
  }

  return "default" as const;
}

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

export default async function NewAppPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const { supabase, user } = await requireSessionContext();
  let state;

  const templateName = firstParam(searchParams?.templateName);
  const mode = parseMode(firstParam(searchParams?.mode));
  const requestedPlatform = parsePlatform(firstParam(searchParams?.platform));
  const sourceAppId = firstParam(searchParams?.sourceAppId);
  const sourceApp = sourceAppId
    ? await getAppByIdForUser(supabase, user.id, sourceAppId)
    : null;

  const initialValues: {
    name?: string;
    platform?: "ios" | "android" | "web";
    launchDate?: string;
  } = {};

  const resolvedName = templateName ?? sourceApp?.name ?? undefined;
  const resolvedPlatform = requestedPlatform ?? sourceApp?.platform ?? undefined;

  if (resolvedName) {
    initialValues.name = resolvedName;
  }

  if (resolvedPlatform) {
    initialValues.platform = resolvedPlatform;
  }

  if (sourceApp?.launch_date) {
    initialValues.launchDate = sourceApp.launch_date;
  }

  const hasInitialValues = Object.keys(initialValues).length > 0;

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

  const hero =
    mode === "platform"
      ? {
          eyebrow: "Platform expansion",
          title: "Mevcut proje icin yeni bir platform workspace'i ac.",
          description:
            "Bu varyant mevcut isimle gelir, yeni platformu secip devam edersin. Ardindan checklist workspace'i otomatik olusur."
        }
      : mode === "client"
        ? {
            eyebrow: "Client variant",
            title: "Mevcut proje icin yeni bir client workspace'i ac.",
            description:
              "Bu varyant mevcut isimle gelir; client adina gore duzenleyip yeni board'u olusturabilirsin."
          }
        : {
            eyebrow: "New launch workspace",
            title: "Yeni uygulaman icin board'u sifirdan kur.",
            description:
              "Ilk uygulamani ekle ve pre-launch surecini baslat. Bu ekran isim, platform ve launch window gibi temel kararlari sabitler; hemen ardindan seni checklist workspace'ine tasir."
          };

  return (
    <LaunchPage>
      <LaunchHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
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

      <NewAppForm
        limit={state.limit}
        initialValues={hasInitialValues ? initialValues : undefined}
        mode={mode}
        sourceAppName={sourceApp?.name ?? null}
      />
    </LaunchPage>
  );
}
