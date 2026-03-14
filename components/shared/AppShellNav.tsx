"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { launchButtonStyles } from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    matches: (pathname: string) =>
      pathname === "/dashboard" ||
      (pathname.startsWith("/app/") && pathname !== "/app/new")
  },
  {
    href: "/app/new",
    label: "Yeni workspace",
    matches: (pathname: string) => pathname === "/app/new"
  }
];

export function AppShellNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {navItems.map((item) => {
        const isActive = item.matches(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              launchButtonStyles.subtle,
              "px-4 py-2.5 text-sm",
              isActive
                ? "border-transparent bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-strong)))] text-[hsl(var(--primary-foreground))] shadow-[0_16px_36px_hsl(var(--shadow-color)/0.18)]"
                : ""
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
