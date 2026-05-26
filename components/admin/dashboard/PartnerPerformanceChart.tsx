"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PARTNER_CHART_COLORS } from "@/lib/dashboard-utils";
import type { DashboardStats } from "@/lib/types";

interface PartnerPerformanceChartProps {
  leaderboard: DashboardStats["partnerLeaderboard"];
}

export function PartnerPerformanceChart({
  leaderboard,
}: PartnerPerformanceChartProps) {
  const chartData = leaderboard.slice(0, 8).map((entry, index) => ({
    name: entry.partner.name ?? entry.partner.partnerId,
    value: entry.leadCount,
    fill: PARTNER_CHART_COLORS[index % PARTNER_CHART_COLORS.length],
  }));

  const totalLeads = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col">
      <div className="relative mx-auto h-[220px] w-full max-w-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload as (typeof chartData)[0];
                const pct =
                  totalLeads > 0
                    ? ((item.value / totalLeads) * 100).toFixed(1)
                    : "0";
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                    <p className="font-semibold text-navy-900">{item.name}</p>
                    <p className="text-slate-600">
                      {item.value} leads ({pct}%)
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-navy-900">{totalLeads}</span>
          <span className="text-xs font-medium text-slate-500">Total Leads</span>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {chartData.map((entry) => {
          const pct =
            totalLeads > 0
              ? ((entry.value / totalLeads) * 100).toFixed(0)
              : "0";
          return (
            <li
              key={entry.name}
              className="flex items-center gap-2 text-xs text-slate-600"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="truncate flex-1">{entry.name}</span>
              <span className="font-medium text-slate-800">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
