import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageMeterProps {
  used: number;
  limit: number;
  className?: string;
}

export function UsageMeter({ used, limit, className }: UsageMeterProps) {
  const percentage = Math.min(100, (used / limit) * 100);
  const remaining = Math.max(0, limit - used);
  const isLow = remaining <= 2;
  const isDepleted = remaining === 0;

  return (
    <div className={cn("glass rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Generations</span>
        </div>
        <span
          className={cn(
            "text-sm font-semibold",
            isDepleted
              ? "text-destructive"
              : isLow
              ? "text-warning"
              : "text-foreground"
          )}
        >
          {remaining}/{limit} left
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isDepleted
              ? "bg-destructive"
              : isLow
              ? "bg-warning"
              : "gradient-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isDepleted && (
        <p className="text-xs text-destructive mt-2">
          Monthly limit reached. Upgrade for unlimited generations.
        </p>
      )}
      {isLow && !isDepleted && (
        <p className="text-xs text-warning mt-2">
          Running low — {remaining} generation{remaining !== 1 ? "s" : ""} remaining this month.
        </p>
      )}
    </div>
  );
}
