"use client";

import { motion } from "framer-motion";

interface ConversionFunnelProps {
  totalLeads: number;
  inProgress: number;
  converted: number;
}

const levelGradients = [
  { from: "#4F46E5", to: "#7C3AED" },
  { from: "#3B82F6", to: "#6366F1" },
  { from: "#10B981", to: "#059669" },
];

export function ConversionFunnel({
  totalLeads,
  inProgress,
  converted,
}: ConversionFunnelProps) {
  const levels = [
    { label: "Total Leads", value: totalLeads, width: 100 },
    { label: "In Progress", value: inProgress, width: 72 },
    { label: "Converted", value: converted, width: 48 },
  ];

  return (
    <div className="flex flex-col items-center gap-1 py-4">
      {levels.map((level, index) => {
        const grad = levelGradients[index];
        return (
          <motion.div
            key={level.label}
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0, scaleY: 0.6 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{
              delay: index * 0.15,
              duration: 0.5,
              ease: "easeOut",
            }}
            style={{ originY: 0.5 }}
          >
            <svg
              viewBox="0 0 200 56"
              className="w-full max-w-[280px]"
              style={{ height: 56 }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`funnel-grad-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={grad.from} stopOpacity={1} />
                  <stop offset="100%" stopColor={grad.to} stopOpacity={0.85} />
                </linearGradient>
                <filter id={`funnel-shadow-${index}`}>
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>
              <polygon
                points={
                  index === 0
                    ? "0,0 200,0 180,56 20,56"
                    : index === 1
                      ? "30,0 170,0 150,56 50,56"
                      : "55,0 145,0 125,56 75,56"
                }
                fill={`url(#funnel-grad-${index})`}
                filter={`url(#funnel-shadow-${index})`}
              />
            </svg>
            <motion.div
              className="-mt-10 mb-2 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.25, duration: 0.35 }}
            >
              <p className="font-heading text-lg font-bold text-white drop-shadow-md">
                {level.value}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                {level.label}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
