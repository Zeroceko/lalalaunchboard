import { AuthTabs } from "@/components/auth/AuthTabs";
import { ToastTrigger } from "@/components/shared/ToastTrigger";

const authHighlights = [
  "One secure entry point for every app workspace",
  "Supabase auth, dashboard routing and session protection are already wired",
  "hCaptcha slot is ready for real sign-up protection"
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
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      {redirectedToProtectedRoute ? (
        <ToastTrigger
          toastKey={`auth-redirect-${searchParams?.next}`}
          title="Giris gerekiyor"
          description="Istedigin workspace ekranina devam etmek icin once giris yapman gerekiyor."
          variant="info"
        />
      ) : null}
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-foreground/10 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            Access layer
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
              Lalalaunchboard Access
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-tight">
              Her app workspace&apos;i icin tek ve net giris kapisi.
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              Auth akisi MVP seviyesinde hazir. Buradan ekibe acik olmayan ama
              sana hiz kazandiran launch workspace&apos;lerini yonetecegiz.
            </p>
          </div>

          <div className="rounded-[2rem] border border-foreground/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                  What opens after login
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  A launch workspace that already understands your flow
                </h2>
              </div>

              <div className="grid gap-3">
                {authHighlights.map((highlight, index) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-4 rounded-[1.4rem] border border-foreground/10 bg-background/80 p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] p-5 text-slate-50">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Ready now
                </p>
                <p className="mt-3 text-lg font-semibold">
                  Sign in, create a workspace, and move directly into checklist,
                  routine, and export flows.
                </p>
              </div>
            </div>
          </div>
        </div>
        <AuthTabs />
      </div>
    </main>
  );
}
