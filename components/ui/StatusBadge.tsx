import { cn } from "@/lib/utils";
import type { LeadStatus, PaymentStatus } from "@/lib/types";

export type StatusBadgeStatus =
  | LeadStatus
  | PaymentStatus
  | "active"
  | "inactive";

const statusConfig: Record<
  StatusBadgeStatus,
  { label: string; dot: string; className: string }
> = {
  new: {
    label: "New",
    dot: "bg-blue-600",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-amber-600",
    className: "bg-amber-500/10 text-amber-800 border-amber-500/20",
  },
  negotiating: {
    label: "Negotiating",
    dot: "bg-purple-600",
    className: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  },
  converted: {
    label: "Converted",
    dot: "bg-emerald-600",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  lost: {
    label: "Lost",
    dot: "bg-rose-600",
    className: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  },
  paid: {
    label: "Paid",
    dot: "bg-emerald-600",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  unpaid: {
    label: "Unpaid",
    dot: "bg-amber-600",
    className: "bg-amber-500/10 text-amber-800 border-amber-500/20",
  },
  partial: {
    label: "Partial",
    dot: "bg-blue-600",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  active: {
    label: "Active",
    dot: "bg-emerald-600",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-slate-400",
    className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
};

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className={cn("h-1 w-1 shrink-0 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
