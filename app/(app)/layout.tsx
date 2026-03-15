import { ReactNode } from "react";

import { AppShell } from "@/components/shared/AppShell";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { SetupProgress, type SetupStep } from "@/components/shared/SetupProgress";
import { LaunchBadge, LaunchPanel } from "@/components/ui/LaunchKit";
import { requireSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { getProductSnapshot } from "@/lib/products/service";

export default async function AppLayout({ children }: { children: ReactNode }) {
  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <LaunchPanel className="w-full space-y-4">
          <LaunchBadge tone="warning">Connection required</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            App workspace akisi icin backend baglantisi gerekiyor.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            NEXT_PUBLIC_SUPABASE_URL ve public key tanimlandiginda dashboard ile app yonetimi tam olarak aktif olacak.
          </p>
        </LaunchPanel>
      </main>
    );
  }

  const { user } = await requireSessionContext();
  const supabase = createClient();

  const [{ data: profile }, { data: workspace }, productSnapshot] = await Promise.all([
    supabase.from("users").select("full_name, role_in_company").eq("id", user.id).maybeSingle(),
    supabase
      .from("workspaces")
      .select("company_name, industry, business_model, company_stage, uvp, competitors, growth_channel")
      .eq("user_id", user.id)
      .maybeSingle(),
    getProductSnapshot(supabase, user.id).catch(() => ({ products: [] as { id: string; product_name: string }[] }))
  ]);

  const navProducts = productSnapshot.products.map(p => ({ id: p.id, name: p.product_name }));

  const setupSteps: SetupStep[] = [
    { key: "profile", label: "Profilini tamamla", description: "Adını ve rolünü ekle", done: Boolean(profile?.full_name), href: "/settings?tab=general" },
    { key: "company", label: "Şirket bilgilerini gir", description: "Sektörünü ve iş modelini belirt", done: Boolean(workspace?.company_name && workspace?.industry), href: "/settings?tab=company" },
    { key: "stage", label: "Büyüme aşamasını seç", description: "Şirketinin hangi aşamada olduğunu belirt", done: Boolean(workspace?.company_stage), href: "/settings?tab=company" },
    { key: "uvp", label: "Değer önerini yaz", description: "AI'ın daha iyi öneri verebilmesi için UVP ekle", done: Boolean(workspace?.uvp), href: "/settings?tab=company" },
    { key: "growth", label: "Büyüme kanalını belirt", description: "Nasıl büyüdüğünü öğren", done: Boolean(workspace?.growth_channel), href: "/settings?tab=company" },
  ];

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Kullanıcı";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ToastProvider>
      <AppShell
        displayName={displayName}
        initials={initials}
        email={user.email ?? ""}
        role={profile?.role_in_company ?? ""}
        setupSteps={setupSteps}
        products={navProducts}
      >
        {children}
      </AppShell>
    </ToastProvider>
  );
}
