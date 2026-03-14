import Link from "next/link";
import { ReactNode } from "react";

import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { AppShellNav } from "@/components/shared/AppShellNav";
import { WorkspaceNotice } from "@/components/shared/WorkspaceNotice";
import { requireSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
        <div className="w-full">
          <WorkspaceNotice
            eyebrow="Supabase gerekli"
            title="App workspace akisi icin backend baglantisi lazim."
            description="`NEXT_PUBLIC_SUPABASE_URL` ile public key tanimlandiginda dashboard ve app yonetimi tam olarak aktif olacak."
          />
        </div>
      </main>
    );
  }

  const { user } = await requireSessionContext();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="rounded-[1.8rem] border border-foreground/10 bg-white/86 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-3">
                <div>
                  <Link
                    href="/dashboard"
                    className="text-xl font-semibold tracking-tight"
                  >
                    Lalalaunchboard
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Prep, launch, and grow from one operating board.
                  </p>
                </div>
                <AppShellNav />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-[1.2rem] border border-foreground/10 bg-secondary/35 px-4 py-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                    Signed in
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/85">
                    {user.email}
                  </p>
                </div>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
