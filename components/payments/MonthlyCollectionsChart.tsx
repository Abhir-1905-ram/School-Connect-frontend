"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINRCurrency } from "./payment-utils";

interface MonthlyCollectionsChartProps {
  data: { month: string; amount: number }[];
}

export function MonthlyCollectionsChart({
  data,
}: MonthlyCollectionsChartProps) {
  const chartData = data.map((d) => ({
    month: d.month.slice(5),
    amount: d.amount,
    fullMonth: d.month,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="collectionsAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
              <stop offset="50%" stopColor="#4F46E5" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="collectionsAreaStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload as (typeof chartData)[0];
              return (
                <div className="rounded-lg border bg-white px-3 py-2 text-sm shadow-md">
                  <p className="text-slate-500">{item.fullMonth}</p>
                  <p className="font-mono font-semibold text-brand">
                    ₹{formatINRCurrency(item.amount)}
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="url(#collectionsAreaStroke)"
            strokeWidth={2.5}
            fill="url(#collectionsAreaFill)"
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
