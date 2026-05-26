"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LeadsByCityChartProps {
  data: { city: string; count: number }[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { city: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3 shadow-lg shadow-indigo-500/10">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        City
      </p>
      <p className="font-heading text-sm font-semibold text-navy-900">
        {item.payload.city}
      </p>
      <p className="mt-2 font-heading text-2xl font-bold text-indigo-600">
        {item.value}
        <span className="ml-1 text-sm font-medium text-slate-500">leads</span>
      </p>
    </div>
  );
}

export function LeadsByCityChart({ data }: LeadsByCityChartProps) {
  const chartData = [...data].sort((a, b) => a.count - b.count).slice(-8);

  return (
    <div className="sc-card p-5">
      <div className="h-[320px] w-full min-w-0 sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis
              type="category"
              dataKey="city"
              width={90}
              tick={{ fontSize: 12, fill: "#334155" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(79, 70, 229, 0.08)", radius: 8 }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="count"
              radius={[0, 10, 10, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill="url(#barGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
