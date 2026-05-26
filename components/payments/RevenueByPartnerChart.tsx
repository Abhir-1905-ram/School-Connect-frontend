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
import { formatINRCurrency } from "./payment-utils";

interface RevenueByPartnerChartProps {
  data: { partnerName: string; revenue: number }[];
}

const BAR_GRADIENTS = [
  ["#F43F5E", "#FB7185"],
  ["#3B82F6", "#60A5FA"],
  ["#8B5CF6", "#A78BFA"],
  ["#10B981", "#34D399"],
  ["#F59E0B", "#FBBF24"],
  ["#4F46E5", "#818CF8"],
];

export function RevenueByPartnerChart({ data }: RevenueByPartnerChartProps) {
  const chartData = data.map((d) => ({
    name: d.partnerName?.split(" ")[0] ?? d.partnerName,
    fullName: d.partnerName,
    revenue: d.revenue,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 4, bottom: 0 }}
        >
          <defs>
            {BAR_GRADIENTS.map(([from, to], i) => (
              <linearGradient
                key={i}
                id={`partnerBarGrad${i}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={from} />
                <stop offset="100%" stopColor={to} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickFormatter={(v) =>
              v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${v}`
            }
          />
          <YAxis
            type="category"
            dataKey="name"
            width={72}
            tick={{ fontSize: 11, fill: "#64748B" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(79, 70, 229, 0.06)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload as (typeof chartData)[0];
              return (
                <div className="rounded-lg border bg-white px-3 py-2 text-sm shadow-md">
                  <p className="font-semibold">{item.fullName}</p>
                  <p className="font-mono text-brand">
                    ₹{formatINRCurrency(item.revenue)}
                  </p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="revenue"
            radius={[0, 6, 6, 0]}
            animationDuration={800}
            barSize={chartData.length > 6 ? 14 : 20}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#partnerBarGrad${index % BAR_GRADIENTS.length})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
