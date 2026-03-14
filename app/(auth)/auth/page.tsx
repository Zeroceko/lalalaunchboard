import Link from "next/link";

import { AuthTabs } from "@/components/auth/AuthTabs";
import { ToastTrigger } from "@/components/shared/ToastTrigger";
import {
  LaunchBadge,
  LaunchHero,
  LaunchPage,
  LaunchPanel,
  LaunchRailList,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";

const authFlow = [
  {
    title: "Hesabi ac",
    description:
      "Ilk boardunu kurmak icin gerekli guvenli giris adimi burada baslar.",
    badge: "Step 1",
    tone: "info" as const
  },
  {
    title: "Boarda baglan",
    description:
      "Auth tamamlandiginda urun seni dogrudan dashboard ve setup akisina tasir.",
    badge: "Step 2",
    tone: "brand" as const
  },
  {
    title: "Ritmi koru",
    description:
      "Sonraki girislerde urun seni launch akisinin kaldigi yere geri goturur.",
    badge: "Step 3",
    tone: "success" as const
  }
];

export default function AuthPage({
  searchParams
}: {
  searchParams?: { reason?: string; next?: string };
}) {
  const redirectedToProtectedRoute =
    searchParams?.reason === "auth" &&
    typeof searchParams.next === "string" &&
    searchParams.next.startsWith("/");

  return (
    <LaunchPage className="min-h-screen py-8 sm:py-10">
      {redirectedToProtectedRoute ? (
        <ToastTrigger
          toastKey={`auth-redirect-${searchParams?.next}`}
          title="Giris gerekiyor"
          description="Istedigin workspace ekranina devam etmek icin once giris yapman gerekiyor."
          variant="info"
        />
      ) : null}

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
              Lalalaunchboard
            </Link>
            <LaunchBadge tone="brand">Launch access</LaunchBadge>
          </div>
          <Link href="/dashboard" className={launchButtonStyles.secondary}>
            Dashboard onizlemesi
          </Link>
        </div>

        <LaunchHero
          eyebrow="Authentication"
          title="Launch operating systeme guvenli ve net bir giris deneyimi."
          description="Bu ekran yalnizca auth formu degil. Kullanici burada hesabini acar, board sistemine baglanir ve sonraki gelislerde ayni ritme geri doner."
          actions={
            <>
              <LaunchBadge tone="info">Email auth</LaunchBadge>
              <LaunchBadge tone="warning">CAPTCHA protected</LaunchBadge>
              <LaunchBadge tone="success">Board connected</LaunchBadge>
            </>
          }
          aside={
            <LaunchRailList
              eyebrow="Access flow"
              title="Formdan fazlasi"
              description="Auth yuzeyi, urunun geri kalanindaki board yapisina giris kapisi gibi davranmali."
              items={authFlow}
            />
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_540px]">
          <div className="space-y-6">
            <section className="space-y-5">
              <LaunchSectionHeader
                eyebrow="Why this matters"
                title="Daginik launch araclarini tek hesaba bagla"
                description="Indie ekiplerin en buyuk problemi tek bir dashboarda degil, tek bir ritme sahip olmamaktir. Auth yuzeyi de bu butunlugun ilk parcasi olmali."
              />

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Tek hesap, tek sistem",
                    description:
                      "Dashboard, setup ve checklist ekranlari ayni kullanici akisinda baglanir."
                  },
                  {
                    title: "Giriste bile urun hissi",
                    description:
                      "Kullanici daha ilk saniyede siradan bir form degil, rafine bir launch urunu kullandigini hissetmelidir."
                  }
                ].map((item) => (
                  <LaunchPanel key={item.title} tone="default" className="space-y-3">
                    <LaunchBadge tone="neutral">Signal</LaunchBadge>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                      {item.description}
                    </p>
                  </LaunchPanel>
                ))}
              </div>
            </section>
          </div>

          <AuthTabs />
        </div>
      </div>
    </LaunchPage>
  );
}
