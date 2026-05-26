import { cn } from "@/lib/utils";

export interface ClassChipsProps {
  classes: number[];
  size?: "sm" | "md";
  maxVisible?: number;
}

export function ClassChips({
  classes,
  size = "sm",
  maxVisible,
}: ClassChipsProps) {
  const sorted = [...classes].sort((a, b) => a - b);
  const visible = maxVisible ? sorted.slice(0, maxVisible) : sorted;
  const remaining = maxVisible ? sorted.length - maxVisible : 0;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((c) => (
        <span
          key={c}
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 font-heading font-semibold text-indigo-700 transition-colors hover:bg-indigo-100",
            size === "sm"
              ? "h-[22px] min-w-[22px] px-1 text-[10px]"
              : "h-7 min-w-[28px] px-2 text-xs"
          )}
        >
          {c}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-lg bg-slate-100 font-medium text-slate-600",
            size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
          )}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}
