import { cn } from "@/lib/utils";
import { getCountdownState } from "@/lib/progress";

interface CountdownBadgeProps {
  launchDate: string;
  className?: string;
}

export function CountdownBadge({
  launchDate,
  className
}: CountdownBadgeProps) {
  const countdown = getCountdownState(launchDate);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
        countdown.tone === "danger" &&
          "bg-destructive/10 text-destructive",
        countdown.tone === "warning" &&
          "bg-amber-100 text-amber-900",
        countdown.tone === "accent" &&
          "bg-accent/15 text-accent",
        countdown.tone === "default" &&
          "bg-primary/10 text-primary",
        className
      )}
    >
      {countdown.label}
    </div>
  );
}
