import type { DashboardStats } from "@/lib/types";

/** Month-over-month % change from the last two months in monthlyLeadTrend */
export function getLeadTrendChange(
  trend: DashboardStats["monthlyLeadTrend"]
): number | undefined {
  if (!trend || trend.length < 2) return undefined;
  const current = trend[trend.length - 1]?.count ?? 0;
  const previous = trend[trend.length - 2]?.count ?? 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/** Approximate MoM for totals using lead trend as proxy when no dedicated series exists */
export function getEstimatedChange(
  trend: DashboardStats["monthlyLeadTrend"],
  factor = 1
): number | undefined {
  const base = getLeadTrendChange(trend);
  if (base === undefined) return undefined;
  return Math.round(base * factor);
}

import { formatINR } from "@/components/ui/IndianCurrency";

/** @deprecated Prefer formatINR from @/components/ui/IndianCurrency */
export function formatINRCurrency(amount: number): string {
  return formatINR(amount);
}

export { formatINR };

export function getConversionRate(leadCount: number, clientCount: number): number {
  if (leadCount <= 0) return 0;
  return Math.round((clientCount / leadCount) * 100);
}

export const PARTNER_CHART_COLORS = [
  "#4F46E5",
  "#818CF8",
  "#6366F1",
  "#A78BFA",
  "#7C3AED",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
];

export function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getAvatarColor(seed: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-purple-500",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
