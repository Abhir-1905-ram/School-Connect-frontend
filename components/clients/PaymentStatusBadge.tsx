import { CheckCircle, Clock, PieChart } from "lucide-react";
import type { PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const config: Record<
  PaymentStatus,
  { label: string; className: string; icon: typeof CheckCircle }
> = {
  paid: {
    label: "PAID",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle,
  },
  unpaid: {
    label: "UNPAID",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  partial: {
    label: "PARTIAL",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: PieChart,
  },
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "lg";
}

export function PaymentStatusBadge({
  status,
  size = "sm",
}: PaymentStatusBadgeProps) {
  const { label, className, icon: Icon } = config[status];
  const isLarge = size === "lg";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold tracking-wide",
        className,
        isLarge ? "px-3 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]"
      )}
    >
      <Icon className={isLarge ? "h-4 w-4" : "h-3 w-3"} />
      {label}
    </span>
  );
}
