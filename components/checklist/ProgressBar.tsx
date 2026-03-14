import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-foreground/80">{label}</span>
          <span className="font-semibold text-foreground">{value}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
