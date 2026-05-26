"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ConversionFunnel } from "./ConversionFunnel";
import { formatINRCurrency } from "@/lib/dashboard-utils";
import type { Lead } from "@/lib/types";
import dayjs from "dayjs";

interface PartnerDashboardChartsProps {
  leads: Lead[];
  monthlyLeadTrend?: { month: string; count: number }[];
  leadStats?: {
    total: number;
    inProgress: number;
    converted: number;
  };
}

export function buildLeadsPerMonth(leads: Lead[]) {
  const months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const key = dayjs().subtract(i, "month").format("YYYY-MM");
    months[key] = 0;
  }
  leads.forEach((lead) => {
    const key = dayjs(lead.createdAt).format("YYYY-MM");
    if (months[key] !== undefined) months[key]++;
  });
  return Object.entries(months).map(([month, count]) => ({
    month: month.slice(5),
    count,
    full: month,
  }));
}

function buildChartFromTrend(monthlyLeadTrend: { month: string; count: number }[]) {
  const months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const key = dayjs().subtract(i, "month").format("YYYY-MM");
    months[key] = 0;
  }
  monthlyLeadTrend.forEach((row) => {
    if (months[row.month] !== undefined) {
      months[row.month] = row.count;
    }
  });
  return Object.entries(months).map(([month, count]) => ({
    month: month.slice(5),
    count,
    full: month,
  }));
}

export function PartnerLeadsLineChart({
  leads,
  monthlyLeadTrend,
}: {
  leads: Lead[];
  monthlyLeadTrend?: { month: string; count: number }[];
}) {
  const data = monthlyLeadTrend?.length
    ? buildChartFromTrend(monthlyLeadTrend)
    : buildLeadsPerMonth(leads);

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v: number) => [`${v} leads`, "Count"]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.full ?? ""
            }
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: "#4F46E5", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PartnerPerformanceSection({
  leads,
  monthlyLeadTrend,
  leadStats,
}: PartnerDashboardChartsProps) {
  const inProgress =
    leadStats?.inProgress ??
    leads.filter(
      (l) => l.status === "in_progress" || l.status === "negotiating"
    ).length;
  const converted =
    leadStats?.converted ??
    leads.filter((l) => l.status === "converted").length;
  const totalLeads = leadStats?.total ?? leads.length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy-900">
          My Leads Over Time
        </h2>
        <p className="mb-4 text-sm text-slate-500">Last 6 months</p>
        <PartnerLeadsLineChart leads={leads} monthlyLeadTrend={monthlyLeadTrend} />
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy-900">
          Conversion Funnel
        </h2>
        <p className="mb-2 text-sm text-slate-500">Lead pipeline overview</p>
        <ConversionFunnel
          totalLeads={totalLeads}
          inProgress={inProgress}
          converted={converted}
        />
      </div>
    </div>
  );
}

export { formatINRCurrency };
