"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    matches: (pathname: string) =>
      pathname === "/dashboard" ||
      (pathname.startsWith("/app/") && pathname !== "/app/new"),
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    )
  },
  {
    href: "/app/new",
    label: "Yeni Board",
    matches: (pathname: string) => pathname === "/app/new",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    href: "/settings",
    label: "Ayarlar",
    matches: (pathname: string) => pathname.startsWith("/settings"),
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
];

const internalItems = [
  {
    href: "/admin",
    label: "Portföy",
    matches: (pathname: string) => pathname.startsWith("/admin"),
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M2 12V6l6-4 6 4v6a1 1 0 01-1 1H3a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 13V9h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    href: "/ops",
    label: "Control Tower",
    matches: (pathname: string) => pathname.startsWith("/ops"),
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 2v3M8 11v3M2 8h3M11 8h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    )
  }
];

interface AppShellNavProps {
  userEmail?: string;
}

export function AppShellNav({ userEmail }: AppShellNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col">
      {/* Main nav */}
      <div className="flex-1 px-3 py-3">
        <div className="flex flex-col gap-px">
          {navItems.map((item) => {
            const isActive = item.matches(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-[0.65rem] px-2.5 py-2 text-[0.8125rem] font-medium transition-colors duration-150",
                  isActive
                    ? "bg-[hsl(var(--sidebar-item-active))] text-[hsl(var(--sidebar-item-active-text))]"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] hover:text-foreground"
                )}
              >
                <span className={cn(
                  "flex h-4 w-4 items-center justify-center",
                  isActive ? "opacity-100" : "opacity-60 group-hover:opacity-80"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Internal tools */}
        <div className="mt-4 border-t border-[hsl(var(--sidebar-border))] pt-4">
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground)/0.5)]">
            İç araçlar
          </p>
          <div className="flex flex-col gap-px">
            {internalItems.map((item) => {
              const isActive = item.matches(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-[0.65rem] px-2.5 py-2 text-[0.8125rem] font-medium transition-colors duration-150",
                    isActive
                      ? "bg-[hsl(var(--sidebar-item-active))] text-[hsl(var(--sidebar-item-active-text))]"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "flex h-4 w-4 items-center justify-center",
                    isActive ? "opacity-100" : "opacity-50 group-hover:opacity-70"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* User footer */}
      {userEmail && (
        <div className="border-t border-[hsl(var(--sidebar-border))] px-3 py-3">
          <div className="rounded-[0.65rem] px-2.5 py-2">
            <p className="truncate text-[11px] font-medium text-[hsl(var(--muted-foreground))]">
              {userEmail}
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
