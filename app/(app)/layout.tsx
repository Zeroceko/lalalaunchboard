import Link from "next/link";
import { ReactNode } from "react";

import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { AppShellNav } from "@/components/shared/AppShellNav";
import { LaunchBadge, LaunchPanel } from "@/components/ui/LaunchKit";
import { requireSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <LaunchPanel className="w-full space-y-4">
          <LaunchBadge tone="warning">Connection required</LaunchBadge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            App workspace akisi icin backend baglantisi gerekiyor.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            `NEXT_PUBLIC_SUPABASE_URL` ve public key tanimlandiginda dashboard ile
            app yonetimi tam olarak aktif olacak.
          </p>
        </LaunchPanel>
      </main>
    );
  }

  const { user } = await requireSessionContext();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))/0.56] bg-[hsl(var(--background))/0.82] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xl font-semibold tracking-[-0.04em] text-foreground"
              >
                Lalalaunchboard
              </Link>
              <LaunchBadge tone="brand">Launch OS</LaunchBadge>
              <LaunchBadge tone="clay">Prep, launch, grow</LaunchBadge>
            </div>

            <AppShellNav />
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="space-y-1 text-left sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                Signed in
              </p>
              <p className="rounded-full border border-[hsl(var(--border))/0.52] bg-[hsl(var(--card))/0.94] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] shadow-[0_10px_24px_hsl(var(--shadow-color)/0.06)]">
                {user.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
