"use client";

import { IndianRupee, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { StatCard } from "@/components/ui/StatCard";
import { formatINRCurrency, getCollectionRate } from "./payment-utils";
import { cn } from "@/lib/utils";

interface PaymentMetricsRowProps {
  totalRevenue: number;
  totalOutstanding: number;
  thisMonth: number;
}

export function PaymentMetricsRow({
  totalRevenue,
  totalOutstanding,
  thisMonth,
}: PaymentMetricsRowProps) {
  const collectionRate = getCollectionRate(totalRevenue, totalOutstanding);
  const radialData = [{ name: "rate", value: collectionRate, fill: "#9333EA" }];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Revenue Collected"
        value={totalRevenue}
        icon={IndianRupee}
        color="rose"
        prefix="₹"
        formatValue={formatINRCurrency}
        delay={0}
      />
      <StatCard
        title="Outstanding Amount"
        value={totalOutstanding}
        icon={AlertCircle}
        color="blue"
        prefix="₹"
        formatValue={formatINRCurrency}
        delay={0.05}
      />
      <StatCard
        title="This Month Collections"
        value={thisMonth}
        icon={Calendar}
        color="purple"
        prefix="₹"
        formatValue={formatINRCurrency}
        delay={0.1}
      />

      <div className="sc-card relative overflow-hidden p-5">
        <div
          className={cn(
            "absolute bottom-3 left-0 top-3 w-1 rounded-full",
            "bg-purple-500"
          )}
        />
        <div className="flex items-center justify-between gap-2 pl-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Collection Rate
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="h-3 w-3 shrink-0" />
              Collected vs total billed
            </p>
            <p className="mt-2 font-heading text-[32px] font-bold leading-none text-navy-900">
              {collectionRate}%
            </p>
          </div>
          <div className="relative h-[72px] w-[72px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={8}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: "#E2E8F0" }}
                  dataKey="value"
                  cornerRadius={4}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
