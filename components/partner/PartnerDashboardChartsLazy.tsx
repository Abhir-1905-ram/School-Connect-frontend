"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/lib/types";

const PartnerPerformanceSection = dynamic(
  () =>
    import("./PartnerDashboardCharts").then((m) => ({
      default: m.PartnerPerformanceSection,
    })),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    ),
    ssr: false,
  }
);

interface Props {
  leads: Lead[];
  monthlyLeadTrend: { month: string; count: number }[];
  leadStats: {
    total: number;
    inProgress: number;
    converted: number;
  };
}

export function PartnerDashboardChartsLazy({
  leads,
  monthlyLeadTrend,
  leadStats,
}: Props) {
  return (
    <PartnerPerformanceSection
      leads={leads}
      monthlyLeadTrend={monthlyLeadTrend}
      leadStats={leadStats}
    />
  );
}
