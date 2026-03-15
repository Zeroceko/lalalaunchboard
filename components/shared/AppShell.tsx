"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, ReactNode } from "react";
import { Bell, Settings, LogOut, User, ChevronDown, Menu, X, Search } from "lucide-react";

import { AppShellNav } from "@/components/shared/AppShellNav";
import { SetupProgress, type SetupStep } from "@/components/shared/SetupProgress";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/shared/ToastProvider";
import type { AuthActionResult } from "@/types";

// ── Notification mock data ────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Pre-Launch Checklist", body: "3 kritik madde hâlâ tamamlanmadı.", time: "5 dk önce", read: false },
  { id: "2", title: "Workspace güncellendi", body: "Şirket profili başarıyla kaydedildi.", time: "1 sa önce", read: false },
  { id: "3", title: "Yeni özellik: Pre-Launch", body: "Sektöre özel checklist artık aktif.", time: "1 gün önce", read: true },
];

// ── Breadcrumb from pathname ──────────────────────────────────────────────────
function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    settings: "Ayarlar",
    "pre-launch": "Pre-Launch",
    app: "Boardlar",
    new: "Yeni Board",
    admin: "Portföy",
    ops: "Control Tower",
    onboarding: "Onboarding",
    growth: "Growth Tracker",
  };

  return segments.map((seg, i) => ({
    label: labelMap[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

// ── Notification dropdown ─────────────────────────────────────────────────────
function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border)/0.6)] bg-background/80 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-[hsl(350,78%,56%)] ring-2 ring-background" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-[360px] overflow-hidden rounded-2xl border border-[hsl(var(--border)/0.6)] bg-background shadow-[0_20px_60px_hsl(0,0%,0%/0.18)] dark:shadow-[0_20px_60px_hsl(0,0%,0%/0.5)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[hsl(var(--border)/0.5)] px-5 py-4">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-foreground">Bildirimler</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[hsl(var(--primary)/0.12)] px-2 py-0.5 text-[11px] font-semibold text-[hsl(var(--primary))]">
                  {unreadCount} yeni
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-[hsl(var(--primary))] hover:underline"
                >
                  Tümünü okundu işaretle
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/60"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="max-h-[340px] divide-y divide-[hsl(var(--border)/0.4)] overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-muted/30",
                  !n.read && "bg-[hsl(var(--primary)/0.03)]"
                )}
              >
                {/* Icon dot */}
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    n.read
                      ? "bg-muted text-muted-foreground"
                      : "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
                  )}
                >
                  {n.read ? "✓" : "!"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground leading-5">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">{n.time}</p>
                </div>
                {!n.read && (
                  <span className="mt-2 flex h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--primary))]" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-[hsl(var(--border)/0.5)] px-5 py-3">
            <button
              type="button"
              className="w-full rounded-lg py-2 text-[12px] font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:bg-muted/40 hover:text-foreground"
            >
              Tüm bildirimleri gör
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── User dropdown ─────────────────────────────────────────────────────────────
function UserDropdown({
  displayName,
  email,
  initials,
  role,
}: {
  displayName: string;
  email: string;
  initials: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { pushToast } = useToast();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });
      const result = (await res.json()) as AuthActionResult;
      if (result.ok) {
        router.push(result.redirectTo ?? "/auth");
        router.refresh();
      } else {
        pushToast({ title: "Çıkış yapılamadı", variant: "destructive" });
      }
    } catch {
      pushToast({ title: "Çıkış yapılamadı", variant: "destructive" });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-[hsl(var(--border)/0.6)] bg-background/80 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-muted/50"
      >
        {/* Avatar */}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.15)] text-[11px] font-bold text-[hsl(var(--primary))]">
          {initials}
        </span>
        <span className="hidden text-[13px] font-semibold text-foreground sm:block">
          {displayName.split(" ")[0]}
        </span>
        <ChevronDown
          size={13}
          className={cn(
            "hidden text-muted-foreground transition-transform sm:block",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-[240px] overflow-hidden rounded-2xl border border-[hsl(var(--border)/0.6)] bg-background shadow-[0_20px_60px_hsl(0,0%,0%/0.18)] dark:shadow-[0_20px_60px_hsl(0,0%,0%/0.5)]">
          {/* User info */}
          <div className="border-b border-[hsl(var(--border)/0.5)] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[13px] font-bold text-[hsl(var(--primary))]">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-[11px] text-muted-foreground">{email}</p>
                {role && (
                  <p className="mt-0.5 text-[10px] font-medium text-[hsl(var(--primary)/0.8)]">{role}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              <User size={15} className="text-muted-foreground" />
              Profili Düzenle
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              <Settings size={15} className="text-muted-foreground" />
              Hesap Ayarları
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-[hsl(var(--border)/0.5)] p-1.5">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[hsl(350,78%,50%)] transition-colors hover:bg-[hsl(350,78%,56%/0.08)]"
            >
              <LogOut size={15} />
              {signingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { applyThemeState, getStoredThemeState, type ThemeState } from "@/components/ui/theme/theme";

// ── Main shell ────────────────────────────────────────────────────────────────
interface AppShellProps {
  children: ReactNode;
  displayName: string;
  initials: string;
  email: string;
  role: string;
  setupSteps: import("@/components/shared/SetupProgress").SetupStep[];
  products?: { id: string; name: string }[];
  preferences?: Record<string, any>;
}

export function AppShell({ 
  children, 
  displayName, 
  initials, 
  email, 
  role, 
  setupSteps, 
  products = [],
  preferences = {}
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const breadcrumbs = useBreadcrumb();

  // Sync theme from database preferences to local state and document
  useEffect(() => {
    const dbTheme = preferences.visualTheme;
    const dbMode = preferences.colorMode;

    if (dbTheme || dbMode) {
      const stored = getStoredThemeState();
      const nextState: ThemeState = {
        visualTheme: (dbTheme as any) || stored.visualTheme,
        colorMode: (dbMode as any) || stored.colorMode
      };

      if (nextState.visualTheme !== stored.visualTheme || nextState.colorMode !== stored.colorMode) {
        applyThemeState(nextState);
      }
    }
  }, [preferences]);

  const sidebarW = collapsed ? 72 : 260;

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{ width: sidebarW }}
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
          "border-r border-[hsl(var(--sidebar-border)/0.7)] bg-[hsl(var(--sidebar-bg))]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0"
        )}
      >
        {/* Logo row */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-[hsl(var(--sidebar-border)/0.6)]",
            collapsed ? "justify-center px-3" : "gap-3 px-5"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] shadow-[0_2px_12px_hsl(var(--primary)/0.4)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 11V5.5L7 2.5l4.5 3V11a.8.8 0 01-.8.8H3.3a.8.8 0 01-.8-.8z" fill="white" />
              </svg>
            </span>
            {!collapsed && (
              <span className="text-[14px] font-bold tracking-[-0.02em] text-foreground">
                Lalalaunch
              </span>
            )}
          </Link>

          {/* Collapse toggle — desktop */}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="ml-auto hidden h-6 w-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[hsl(var(--sidebar-item-hover))] hover:text-foreground md:flex"
              title="Daralt"
            >
              <Menu size={14} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[hsl(var(--sidebar-item-hover))] hover:text-foreground md:flex"
            title="Genişlet"
          >
            <Menu size={15} />
          </button>
        )}

        {/* Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <AppShellNav collapsed={collapsed} products={products} />
        </div>

        {/* SetupProgress */}
        {!collapsed && (
          <div className="border-t border-[hsl(var(--sidebar-border)/0.6)] pt-2">
            <SetupProgress steps={setupSteps} />
          </div>
        )}

        {/* User card at bottom */}
        {!collapsed && (
          <div className="border-t border-[hsl(var(--sidebar-border)/0.6)] px-4 py-3">
            <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[11px] font-bold text-[hsl(var(--primary))]">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-[10px] text-muted-foreground">{email}</p>
              </div>
              <SignOutButton />
            </div>
          </div>
        )}
      </aside>

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* ── Top header ── */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[hsl(var(--border)/0.5)] bg-background/90 px-4 backdrop-blur-sm sm:px-6">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border)/0.6)] text-muted-foreground transition-colors hover:bg-muted/60 md:hidden"
          >
            <Menu size={16} />
          </button>

          {/* Breadcrumb */}
          <nav className="flex flex-1 items-center gap-1.5 text-[13px]">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                {crumb.isLast ? (
                  <span className="font-semibold text-foreground">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Search */}
          <div className="relative hidden lg:block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder="Ara..."
              className="h-9 w-44 rounded-xl border border-[hsl(var(--border)/0.6)] bg-muted/30 pl-8 pr-10 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:w-56 transition-all"
            />
            <kbd className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[10px] text-muted-foreground/50">
              ⌘K
            </kbd>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <UserDropdown
              displayName={displayName}
              email={email}
              initials={initials}
              role={role}
            />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
