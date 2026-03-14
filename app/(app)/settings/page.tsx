import Link from "next/link";

import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import {
  LaunchBadge,
  LaunchMiniStat,
  LaunchNotice,
  LaunchPage,
  LaunchPanel,
  LaunchSectionHeader,
  launchButtonStyles
} from "@/components/ui/LaunchKit";
import { getWorkspaceSnapshot } from "@/lib/apps/service";
import { requireSessionContext } from "@/lib/auth/session";

const securityItems = [
  {
    title: "Iki adimli dogrulama",
    description:
      "Yakinda e-posta kodu veya authenticator ile ikinci katman eklenebilecek.",
    action: "Yakinda"
  },
  {
    title: "Aktif oturumlar",
    description:
      "Bu hesapla acilan cihazlari gorup gerekirse cikis yaptirabilecegin alan.",
    action: "Planlandi"
  },
  {
    title: "Giris bildirimleri",
    description:
      "Yeni cihaz girislerinde e-posta bildirimi almak icin hazirlanan katman.",
    action: "Planlandi"
  }
];

const integrationItems = [
  {
    title: "Apple App Store Connect",
    description:
      "iOS yayin akislarini ve metadatalari daha sonra bu hesaba baglayabileceksin.",
    status: "Hazirlanıyor"
  },
  {
    title: "Google Play Console",
    description:
      "Android rollout ve magaza bilgilerinin daha sonra bu panelden okunmasi hedefleniyor.",
    status: "Hazirlanıyor"
  },
  {
    title: "Web stack",
    description:
      "Vercel, analytics ve growth araclarini ayni proje baglaminda toplamak icin ayrilan alan.",
    status: "Hazirlanıyor"
  },
  {
    title: "CRM ve bildirim kanallari",
    description:
      "Farkli client ve kanal baglantilarini yonetmek icin entegrasyon yuvasi.",
    status: "Taslak"
  }
];

export default async function SettingsPage() {
  const { supabase, user } = await requireSessionContext();

  let snapshot = null;

  try {
    snapshot = await getWorkspaceSnapshot(supabase, user.id);
  } catch {
    snapshot = null;
  }

  const plan = snapshot?.limit?.plan ?? "free";
  const appCount = snapshot?.limit?.appCount ?? 0;
  const remainingSlots = snapshot?.limit?.remainingSlots ?? 0;
  const canCreateMore = snapshot?.limit?.canCreateApp ?? false;

  return (
    <LaunchPage className="max-w-[1180px] py-8">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2.3rem] border border-[hsl(var(--border))/0.56] bg-[linear-gradient(145deg,hsl(var(--surface-dark-start)),hsl(var(--surface-dark-mid))_55%,hsl(var(--surface-dark-end)))] px-6 py-7 shadow-[0_30px_90px_hsl(var(--shadow-color)/0.18)] sm:px-8 sm:py-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <LaunchBadge
                  tone="info"
                  className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
                >
                  Ayarlar
                </LaunchBadge>
                <LaunchBadge
                  tone="warning"
                  className="border-[hsl(var(--surface-dark-foreground))/0.16] bg-[hsl(var(--surface-dark-foreground))/0.08] text-[hsl(var(--surface-dark-foreground))]"
                >
                  Hesap ve panel yonetimi
                </LaunchBadge>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] text-[hsl(var(--surface-dark-foreground))] sm:text-[3.2rem] sm:leading-[0.98]">
                  Hesabini, planini, panel tasarimini ve baglantilarini buradan yonet.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[hsl(var(--surface-dark-muted))]">
                  Bu alan sadece gorunum secmek icin degil; uyelik, guvenlik, farkli
                  platform baglantilari ve proje yapini yonetmek icin control desk
                  gibi davranmali.
                </p>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-[hsl(var(--surface-dark-foreground))/0.06] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--surface-dark-muted))]">
                Hesap
              </p>
              <p className="mt-2 text-base font-semibold text-[hsl(var(--surface-dark-foreground))]">
                {user.email}
              </p>
              <p className="mt-3 text-sm leading-6 text-[hsl(var(--surface-dark-muted))]">
                Mevcut plan: {plan === "pro" ? "Pro" : "Free"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LaunchMiniStat
            label="Uyelik plani"
            value={plan === "pro" ? "Pro" : "Free"}
            detail="Paket seviyesi yeni workspace ve varyant kapasitesini belirler."
            tone="brand"
          />
          <LaunchMiniStat
            label="Mevcut workspace"
            value={appCount}
            detail="Hesabina bagli aktif urun/workspace sayisi."
            tone="clay"
          />
          <LaunchMiniStat
            label="Kalan alan"
            value={plan === "pro" ? "Sinirsiz" : remainingSlots}
            detail="Yeni platform veya client varyanti acmak icin kullanilir."
            tone={canCreateMore || plan === "pro" ? "success" : "warning"}
          />
          <LaunchMiniStat
            label="Guvenlik durumu"
            value="Temel koruma"
            detail="Supabase auth aktif, ileri guvenlik katmanlari roadmap'te."
            tone="info"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <LaunchPanel tone="tint" className="space-y-5">
            <LaunchSectionHeader
              eyebrow="Hesap ayarlari"
              title="Hesap ve uyelik durumu"
              description="E-posta, plan ve faturalama yonunu ayni yerde gor."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.45rem] bg-[hsl(var(--card))/0.82] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]">
                <p className="text-sm font-semibold text-foreground">Hesap e-postasi</p>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {user.email}
                </p>
              </div>
              <div className="rounded-[1.45rem] bg-[hsl(var(--card))/0.82] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]">
                <p className="text-sm font-semibold text-foreground">Mevcut plan</p>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {plan === "pro"
                    ? "Pro plan ile sinirsiza yakin workspace duzeni"
                    : "Free plan ile 1 aktif workspace limiti"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className={launchButtonStyles.primary}>
                {plan === "pro" ? "Plani yonet" : "Upgrade et"}
              </button>
              <button type="button" className={launchButtonStyles.secondary}>
                Downgrade secenekleri
              </button>
              <Link href="/dashboard" className={launchButtonStyles.subtle}>
                Dashboard&apos;a don
              </Link>
            </div>

            <LaunchNotice tone="info">
              Billing ve paket gecisleri icin tam backend akisi henuz yok. Bu yuzey
              urun mimarisi ve yonetim deneyimi icin hazirlandi.
            </LaunchNotice>
          </LaunchPanel>

          <LaunchPanel tone="subtle" className="space-y-5">
            <LaunchSectionHeader
              eyebrow="Proje genisletme"
              title="Platform ve client varyantlari"
              description="Bir urune sonradan yeni client, iOS, Android veya Web workspace'leri eklenebilir."
            />

            <div className="space-y-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              <p>
                Dashboard kartlari icinde artik ilgili projeden yeni platform ekleme
                aksiyonlari bulunuyor.
              </p>
              <p>
                Free plan bu konuda hizlica sinira takilir; birden fazla varyant
                stratejisi icin Pro deneyimi gerekecek.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className={launchButtonStyles.secondary}>
                Dashboard&apos;da yonet
              </Link>
              <Link href="/app/new" className={launchButtonStyles.subtle}>
                Yeni workspace ac
              </Link>
            </div>
          </LaunchPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <LaunchPanel tone="default" className="space-y-5">
            <LaunchSectionHeader
              eyebrow="Panel tasarimi"
              title="Panel tasarim secimi"
              description="Tema, mod ve genel gorunum tercihlerini buradan degistir."
            />
            <AppearanceSettings />
          </LaunchPanel>

          <LaunchPanel tone="default" className="space-y-5">
            <LaunchSectionHeader
              eyebrow="Guvenlik"
              title="Guvenlik secenekleri"
              description="Hesap korumasini ve oturum davranislarini tek panelde topla."
            />

            <div className="space-y-3">
              {securityItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.35rem] border border-[hsl(var(--border))/0.56] bg-[hsl(var(--card))/0.84] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                        {item.description}
                      </p>
                    </div>
                    <LaunchBadge tone="neutral">{item.action}</LaunchBadge>
                  </div>
                </div>
              ))}
            </div>
          </LaunchPanel>
        </div>

        <LaunchPanel tone="brand" className="space-y-5">
          <LaunchSectionHeader
            eyebrow="Platform baglantilari"
            title="Farkli platformlari ve servisleri bagla"
            description="Apple, Google, web stack ve kanal baglantilarini ileride bu masadan yonetebilmek icin alan ayrildi."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {integrationItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.45rem] border border-[hsl(var(--border))/0.48] bg-[hsl(var(--card))/0.82] px-4 py-4 shadow-[0_12px_32px_hsl(var(--shadow-color)/0.05)]"
              >
                <div className="space-y-3">
                  <LaunchBadge tone="info">{item.status}</LaunchBadge>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                      {item.description}
                    </p>
                  </div>
                  <button type="button" className={launchButtonStyles.secondary}>
                    Bagla
                  </button>
                </div>
              </div>
            ))}
          </div>
        </LaunchPanel>
      </div>
    </LaunchPage>
  );
}
