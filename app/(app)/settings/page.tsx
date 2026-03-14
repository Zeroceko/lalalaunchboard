import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import {
  LaunchBadge,
  LaunchPage,
  LaunchPanel
} from "@/components/ui/LaunchKit";

export default function SettingsPage() {
  return (
    <LaunchPage className="max-w-4xl py-8">
      <div className="space-y-5">
        <LaunchPanel tone="subtle" className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <LaunchBadge tone="info">Ayarlar</LaunchBadge>
            <LaunchBadge tone="neutral">Appearance</LaunchBadge>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Tasarim ayarlari
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              Tema ve renk modu secimlerini burada daha sakin bir yardimci panel
              olarak yonetebilirsin.
            </p>
          </div>
        </LaunchPanel>

        <AppearanceSettings />
      </div>
    </LaunchPage>
  );
}
