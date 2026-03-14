"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Board overview",
    matches: (pathname: string) =>
      pathname === "/dashboard" ||
      (pathname.startsWith("/app/") && pathname !== "/app/new")
  },
  {
    href: "/app/new",
    label: "Create workspace",
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
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "border-primary/15 bg-primary text-primary-foreground shadow-[0_14px_24px_rgba(30,64,175,0.16)]"
                : "border-foreground/10 bg-secondary/35 text-foreground hover:bg-secondary/65"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
