"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "purple";

const colorStyles: Record<
  StatCardColor,
  { border: string; iconBg: string; iconText: string }
> = {
  indigo: {
    border: "bg-indigo-500",
    iconBg: "bg-gradient-to-br from-indigo-500/15 to-indigo-500/5",
    iconText: "text-indigo-600",
  },
  emerald: {
    border: "bg-emerald-500",
    iconBg: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5",
    iconText: "text-emerald-600",
  },
  amber: {
    border: "bg-amber-500",
    iconBg: "bg-gradient-to-br from-amber-500/15 to-amber-500/5",
    iconText: "text-amber-600",
  },
  rose: {
    border: "bg-rose-500",
    iconBg: "bg-gradient-to-br from-rose-500/15 to-rose-500/5",
    iconText: "text-rose-600",
  },
  blue: {
    border: "bg-blue-500",
    iconBg: "bg-gradient-to-br from-blue-500/15 to-blue-500/5",
    iconText: "text-blue-600",
  },
  purple: {
    border: "bg-purple-500",
    iconBg: "bg-gradient-to-br from-purple-500/15 to-purple-500/5",
    iconText: "text-purple-600",
  },
};

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: StatCardColor;
  change?: number;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
  delay?: number;
  formatValue?: (n: number) => string;
}

function AnimatedNumber({
  value,
  prefix = "",
  format = (n) => n.toLocaleString("en-IN"),
  duration = 1.2,
}: {
  value: number;
  prefix?: string;
  format?: (n: number) => string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className="stat-number">
      {prefix}
      {format(display)}
    </span>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  prefix,
  suffix,
  animate = true,
  delay = 0,
  formatValue,
}: StatCardProps) {
  const styles = colorStyles[color];
  const isPositive = change !== undefined && change >= 0;
  const isNumeric = typeof value === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="sc-card relative overflow-hidden p-5"
    >
      <div
        className={cn(
          "absolute bottom-3 left-0 top-3 w-1 rounded-full",
          styles.border
        )}
      />
      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 font-heading text-[32px] font-bold leading-none text-navy-900">
            {isNumeric && animate ? (
              <AnimatedNumber
                value={value}
                prefix={prefix}
                format={formatValue}
              />
            ) : (
              <span className="stat-number">
                {prefix}
                {isNumeric
                  ? formatValue
                    ? formatValue(value as number)
                    : (value as number).toLocaleString("en-IN")
                  : value}
              </span>
            )}
            {suffix && (
              <span className="ml-1 text-lg font-semibold text-slate-500">
                {suffix}
              </span>
            )}
          </p>
          {change !== undefined && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-rose-500/10 text-rose-700"
              )}
            >
              {isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(change)}% vs last month
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconText)} />
        </div>
      </div>
    </motion.div>
  );
}
