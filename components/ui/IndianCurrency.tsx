import { cn } from "@/lib/utils";

/** Indian numbering: ₹1,23,456 */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "0";
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const abs = Math.abs(rounded);
  const str = String(abs);
  if (str.length <= 3) {
    return `${isNegative ? "-" : ""}${str}`;
  }
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const withCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  return `${isNegative ? "-" : ""}${withCommas}`;
}

export interface IndianCurrencyProps {
  amount: number;
  size?: "sm" | "md" | "lg" | "xl";
  showSymbol?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm font-medium",
  md: "text-base font-semibold",
  lg: "text-xl font-bold",
  xl: "text-2xl font-bold",
};

export function IndianCurrency({
  amount,
  size = "md",
  showSymbol = true,
  className,
}: IndianCurrencyProps) {
  return (
    <span className={cn("tabular-nums text-navy-900", sizeClasses[size], className)}>
      {showSymbol && "₹"}
      {formatINR(amount)}
    </span>
  );
}
