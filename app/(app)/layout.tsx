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
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Premium Left Sidebar ── */}
      <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[hsl(var(--sidebar-border)/0.7)] bg-[hsl(var(--sidebar-bg))]">

        {/* Logo header */}
        <div className="flex items-center gap-2.5 border-b border-[hsl(var(--sidebar-border)/0.6)] px-4 py-[13px]">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[0.45rem] bg-[hsl(var(--primary))] shadow-[0_1px_6px_hsl(var(--primary)/0.35)] transition-shadow group-hover:shadow-[0_2px_12px_hsl(var(--primary)/0.45)]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 11V5.5L7 2.5l4.5 3V11a.8.8 0 01-.8.8H3.3a.8.8 0 01-.8-.8z" fill="white" />
              </svg>
            </span>
            <span className="text-[0.8125rem] font-semibold tracking-[-0.02em] text-foreground">
              Lalalaunchboard
            </span>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-0.5">
          <AppShellNav userEmail={user.email} />
        </div>

        {/* User footer */}
        <div className="border-t border-[hsl(var(--sidebar-border)/0.6)] p-3">
          <div className="flex items-center gap-2.5 rounded-[0.65rem] px-2 py-2">
            {/* Avatar initials */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[10px] font-bold text-[hsl(var(--primary))]">
              {user.email?.charAt(0).toUpperCase() ?? "U"}
            </span>
            <p className="flex-1 truncate text-[11px] text-[hsl(var(--muted-foreground))]">
              {user.email}
            </p>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
