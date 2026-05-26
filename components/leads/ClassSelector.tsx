"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);

interface ClassSelectorProps {
  value: number[];
  onChange: (classes: number[]) => void;
}

export function ClassSelector({ value, onChange }: ClassSelectorProps) {
  const selected = new Set(value);

  const toggle = (n: number) => {
    const next = new Set(selected);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    onChange(Array.from(next).sort((a, b) => a - b));
  };

  const selectAll = () => onChange([...CLASSES]);
  const clearAll = () => onChange([]);
  const selectRange = (from: number, to: number) =>
    onChange(CLASSES.filter((c) => c >= from && c <= to));

  const summary =
    value.length === 0
      ? "No classes selected"
      : `${value.length} class${value.length > 1 ? "es" : ""} selected: ${value.map((c) => `Class ${c}`).join(", ")}`;

  const quickActions = [
    { label: "Select All", action: selectAll },
    { label: "Clear All", action: clearAll },
    { label: "Primary (1-5)", action: () => selectRange(1, 5) },
    { label: "Secondary (6-10)", action: () => selectRange(6, 10) },
  ];

  return (
    <div className="sc-card space-y-5 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        Select target classes
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {CLASSES.map((n) => {
          const isSelected = selected.has(n);
          return (
            <motion.button
              key={n}
              type="button"
              layout
              onClick={() => toggle(n)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: isSelected ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "relative flex h-12 items-center justify-center rounded-xl border-2 text-sm font-bold transition-all sm:h-14",
                isSelected
                  ? "border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-300/40"
                  : "border-slate-200 bg-gradient-to-b from-white to-slate-50 text-navy-900 hover:border-indigo-300 hover:shadow-md"
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId={`class-check-${n}`}
                  className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Check className="h-2.5 w-2.5 text-white" />
                </motion.span>
              )}
              {n}
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {quickActions.map(({ label, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
        <span className="font-semibold text-navy-900">Selection summary:</span>{" "}
        {summary}
      </p>
    </div>
  );
}
