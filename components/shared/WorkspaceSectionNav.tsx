"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function WorkspaceSectionNav({
  appId
}: {
  appId: string;
}) {
  const pathname = usePathname();
  const items = [
    {
      href: `/app/${appId}`,
      label: "Prep board"
    },
    {
      href: `/app/${appId}/post-launch`,
      label: "Growth routine"
    },
    {
      href: `/app/${appId}/export`,
      label: "Share export"
    }
  ];

  return (
    <div className="rounded-[1.6rem] border border-foreground/10 bg-white/82 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-foreground/48">
            Workspace lanes
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Prep, launch and grow from the same operating board.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "border-primary/15 bg-primary text-primary-foreground shadow-[0_14px_26px_rgba(30,64,175,0.18)]"
                    : "border-foreground/10 bg-secondary/35 text-foreground hover:bg-secondary/65"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
