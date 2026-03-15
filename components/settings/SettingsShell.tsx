"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Apple, Play, Zap, Link2 } from "lucide-react";

const tabs = [
  {
    id: "general",
    label: "Genel",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="5" r="2.5" />
        <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "company",
    label: "Şirket Profili",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="5" width="13" height="9.5" rx="1.5" />
        <path d="M5 5V3.5A2.5 2.5 0 0111 3.5V5" strokeLinecap="round" />
        <path d="M8 9v2M6 10h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "appearance",
    label: "Görünüm",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 2v2M8 12v2M2 8h2M12 8h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Güvenlik",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 1.5L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1.5z" />
      </svg>
    ),
  },
  {
    id: "integrations",
    label: "Entegrasyonlar",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="3.5" cy="8" r="2" />
        <circle cx="12.5" cy="3.5" r="2" />
        <circle cx="12.5" cy="12.5" r="2" />
        <path d="M5.5 8h3l2-4.5M5.5 8h3l2 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ── Field wrapper ── */
function FieldRow({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-6 py-5 border-b border-border last:border-0">
      <div className="pt-0.5">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3.5 pb-6 border-b border-border mb-2">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 text-muted-foreground">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface Props {
  profileSection: ReactNode;
  workspaceSection: ReactNode;
  appearanceSection: ReactNode;
}

export function SettingsShell({ profileSection, workspaceSection, appearanceSection }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState(() => {
    const tab = searchParams.get("tab");
    return tab && tabs.some((t) => t.id === tab) ? tab : "general";
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.some((t) => t.id === tab)) {
      setActive(tab);
    }
  }, [searchParams]);

  const handleSetActive = (id: string) => {
    setActive(id);
    router.replace(`/settings?tab=${id}`, { scroll: false });
  };

  return (
    <div className="flex h-full min-h-0">
      {/* ── Sticky left nav ── */}
      <nav className="hidden w-[220px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-border bg-background/50 p-3 md:flex sticky top-0 h-screen">
        <p className="mb-2 px-3 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
          Ayarlar
        </p>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSetActive(tab.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left ${
              active === tab.id
                ? "bg-primary/8 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <span className={`flex-shrink-0 ${active === tab.id ? "text-primary" : "text-muted-foreground"}`}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8 lg:px-10">

          {/* ── Genel ── */}
          {active === "general" && (
            <div>
              <SectionHeader
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="8" cy="5" r="2.5" />
                    <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
                  </svg>
                }
                title="Kişisel Bilgiler"
                description="Ad, pozisyon ve e-posta bilgilerini yönet."
              />
              {profileSection}
            </div>
          )}

          {/* ── Şirket ── */}
          {active === "company" && (
            <div>
              <SectionHeader
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="1.5" y="5" width="13" height="9.5" rx="1.5" />
                    <path d="M5 5V3.5A2.5 2.5 0 0111 3.5V5" strokeLinecap="round" />
                  </svg>
                }
                title="Şirket Profili"
                description="Sektör, iş modeli ve büyüme bilgilerin AI önerilerini kişiselleştirir."
              />
              {workspaceSection}
            </div>
          )}

          {/* ── Görünüm ── */}
          {active === "appearance" && (
            <div>
              <SectionHeader
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 2v2M8 12v2M2 8h2M12 8h2" strokeLinecap="round" />
                  </svg>
                }
                title="Görünüm"
                description="Tema ve renk modu tercihlerini buradan değiştir."
              />
              {appearanceSection}
            </div>
          )}

          {/* ── Güvenlik ── */}
          {active === "security" && (
            <div>
              <SectionHeader
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M8 1.5L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1.5z" />
                  </svg>
                }
                title="Güvenlik"
                description="Hesap koruması ve oturum yönetimi."
              />
              <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
                {[
                  { title: "İki adımlı doğrulama", desc: "E-posta kodu veya authenticator ile ikinci katman.", badge: "Yakında" },
                  { title: "Aktif oturumlar", desc: "Bu hesapla açılan cihazları görüp gerekirse çıkış yaptırabilirsin.", badge: "Planlandı" },
                  { title: "Giriş bildirimleri", desc: "Yeni cihaz girişlerinde e-posta bildirimi.", badge: "Planlandı" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Entegrasyonlar ── */}
          {active === "integrations" && (
            <div>
              <SectionHeader
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="3.5" cy="8" r="2" />
                    <circle cx="12.5" cy="3.5" r="2" />
                    <circle cx="12.5" cy="12.5" r="2" />
                    <path d="M5.5 8h3l2-4.5M5.5 8h3l2 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title="Entegrasyonlar"
                description="Apple, Google ve diğer platform bağlantılarını yönet."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "App Store Connect", desc: "iOS yayın akışları ve metadata.", icon: <Apple size={16} /> },
                  { title: "Google Play Console", desc: "Android rollout ve mağaza bilgileri.", icon: <Play size={16} /> },
                  { title: "Web Stack", desc: "Vercel, analytics ve growth araçları.", icon: <Zap size={16} /> },
                  { title: "CRM & Bildirimler", desc: "Farklı kanal bağlantılarını yönet.", icon: <Link2 size={16} /> },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button type="button" className="flex-shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/40">
                      Bağla
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
