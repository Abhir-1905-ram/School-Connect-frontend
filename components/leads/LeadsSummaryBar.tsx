"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatINRCurrency } from "./lead-utils";

interface LeadsSummaryBarProps {
  count: number;
  partnerLabel: string | null;
  totalDealValue: number;
}

function AnimatedValue({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="font-semibold text-navy-900"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export function LeadsSummaryBar({
  count,
  partnerLabel,
  totalDealValue,
}: LeadsSummaryBarProps) {
  const countStr = String(count);
  const valueStr = `₹${formatINRCurrency(totalDealValue)}`;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      <span>Showing</span>
      <AnimatedValue value={countStr} />
      <span>leads</span>

      {partnerLabel && (
        <>
          <span className="text-slate-300">|</span>
          <span>Partner:</span>
          <AnimatedValue value={partnerLabel} />
        </>
      )}

      <span className="text-slate-300">|</span>
      <span>Total Deal Value:</span>
      <AnimatedValue value={valueStr} />
    </div>
  );
}
