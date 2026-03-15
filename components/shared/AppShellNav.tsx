"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  matches: (p: string) => boolean;
  icon: React.ReactNode;
  badge?: string;
  children?: { href: string; label: string }[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Ana Menü",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        matches: (p) => p === "/dashboard",
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      },
      {
        href: "/products/new",
        label: "Yeni Ürün",
        matches: (p) => p === "/products/new",
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      },
      {
        href: "/dashboard/growth",
        label: "Growth Tracker",
        matches: (p) => p === "/dashboard/growth",
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 13.5l4.5-4.5 3.5 3.5 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
    ]
  },
  {
    label: "Ürünler",
    items: [
      {
        href: "/products",
        label: "Ürünlerim",
        matches: (p) => p.startsWith("/products") && p !== "/products/new",
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <rect x="2" y="4" width="16" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="2" y="9.5" width="16" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="2" y="15" width="16" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      },
      {
        href: "/boards",
        label: "Tüm Boardlar",
        matches: (p) => p.startsWith("/boards") || (p.startsWith("/app/") && p !== "/app/new"),
        badge: "Legacy",
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 5h14M3 10h14M3 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      },
    ]
  },
  {
    label: "Hesap",
    items: [
      {
        href: "/settings",
        label: "Ayarlar",
        matches: (p) => p.startsWith("/settings"),
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      },
      {
        href: "/admin",
        label: "Portföy",
        matches: (p) => p.startsWith("/admin"),
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 14V8l7-5 7 5v6a1 1 0 01-1 1H4a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 15v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      },
      {
        href: "/ops",
        label: "Control Tower",
        matches: (p) => p.startsWith("/ops"),
        icon: (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      },
    ]
  }
];

interface AppShellNavProps {
  collapsed?: boolean;
  products?: { id: string; name: string }[];
}

export function AppShellNav({ collapsed, products = [] }: AppShellNavProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Ana Menü": true,
    "Ürünler": true,
    "Hesap": true
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const productIcon = (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );

  function NavLink({ href, icon, label, badge, isActive }: { href: string; icon: React.ReactNode; label: string; badge?: string; isActive: boolean }) {
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
          collapsed ? "justify-center px-2" : "",
          isActive
            ? "bg-[hsl(var(--sidebar-item-active))] text-[hsl(var(--sidebar-item-active-text))]"
            : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] hover:text-foreground"
        )}
      >
        {isActive && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[hsl(var(--primary))]" />}
        <span className={cn("flex shrink-0 items-center justify-center", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-80")}>
          {icon}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge && <span className="rounded-full bg-[hsl(var(--primary))] px-1.5 py-0.5 text-[9px] font-bold text-white">{badge}</span>}
          </>
        )}
      </Link>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-1">
          {!collapsed && (
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="mb-1 flex w-full items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {group.label}
              <ChevronDown size={11} className={cn("transition-transform", openGroups[group.label] ? "" : "-rotate-90")} />
            </button>
          )}

          {(openGroups[group.label] || collapsed) && (
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  isActive={item.matches(pathname)}
                />
              ))}

              {/* Dynamic product list under "Ürünler" group */}
              {group.label === "Ürünler" && products.length > 0 && (openGroups["Ürünler"] || collapsed) && (
                <div className={cn("flex flex-col gap-0.5", !collapsed && "ml-2 border-l border-[hsl(var(--border)/0.4)] pl-2")}>
                  {products.map(p => (
                    <NavLink
                      key={p.id}
                      href={`/products/${p.id}`}
                      icon={productIcon}
                      label={p.name}
                      isActive={pathname.startsWith(`/products/${p.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
