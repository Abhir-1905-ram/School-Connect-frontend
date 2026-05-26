"use client";

import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  formatINRCurrency,
  getAvatarColor,
  getConversionRate,
  getInitials,
} from "@/lib/dashboard-utils";
import type { DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PartnerLeaderboardProps {
  leaderboard: DashboardStats["partnerLeaderboard"];
}

const rankStyles: Record<
  number,
  { ring: string; badge: string; label: string }
> = {
  1: {
    ring: "ring-amber-400/60",
    badge:
      "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-amber-950 shadow-md shadow-amber-400/40",
    label: "Gold",
  },
  2: {
    ring: "ring-slate-300/80",
    badge:
      "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800 shadow-md shadow-slate-400/30",
    label: "Silver",
  },
  3: {
    ring: "ring-orange-400/50",
    badge:
      "bg-gradient-to-br from-orange-300 via-amber-600 to-orange-700 text-orange-950 shadow-md shadow-orange-500/30",
    label: "Bronze",
  },
};

function RankBadge({ rank }: { rank: number }) {
  const style = rankStyles[rank];
  if (style) {
    return (
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
          style.badge
        )}
        aria-label={`Rank ${rank} — ${style.label}`}
      >
        {rank === 1 ? (
          <Crown className="h-4 w-4" />
        ) : (
          <Medal className="h-4 w-4" />
        )}
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
      {rank}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function PartnerLeaderboard({ leaderboard }: PartnerLeaderboardProps) {
  const sorted = [...leaderboard]
    .sort((a, b) => b.leadCount - a.leadCount)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <motion.div
      className="sc-card p-4 md:p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ul className="space-y-3">
        {sorted.map((entry) => {
          const name = entry.partner.name ?? "Unknown Partner";
          const conversion = getConversionRate(
            entry.leadCount,
            entry.clientCount
          );
          const seed = entry.partner.id ?? entry.partner.partnerId;
          const topThree = entry.rank <= 3;

          return (
            <motion.li
              key={seed}
              variants={rowVariants}
              className={cn(
                "rounded-xl border p-4 transition-all duration-200",
                topThree
                  ? cn(
                      "border-transparent bg-gradient-to-r from-slate-50 to-white ring-2",
                      rankStyles[entry.rank]?.ring
                    )
                  : "border-slate-100 bg-slate-50/50 hover:border-indigo-100 hover:bg-white hover:shadow-sm"
              )}
            >
              <div className="flex gap-3">
                <div className="flex w-9 shrink-0 items-start justify-center pt-0.5">
                  <RankBadge rank={entry.rank} />
                </div>

                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white",
                    getAvatarColor(seed)
                  )}
                >
                  {getInitials(name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy-900">{name}</p>
                      <p className="text-xs text-slate-500">
                        {entry.partner.partnerId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-white/80 p-2 text-center ring-1 ring-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Leads</p>
                      <p className="font-heading text-sm font-bold text-navy-900">
                        {entry.leadCount}
                      </p>
                    </div>
                    <div className="border-x border-slate-100">
                      <p className="text-xs text-slate-500">Clients</p>
                      <p className="font-heading text-sm font-bold text-navy-900">
                        {entry.clientCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="font-heading text-sm font-bold text-amber-600">
                        ₹{formatINRCurrency(entry.revenue)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">Conversion</span>
                      <span className="font-medium text-emerald-600">
                        {conversion}%
                      </span>
                    </div>
                    <Progress
                      value={conversion}
                      className="h-2 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}

        {sorted.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            No partners yet
          </p>
        )}
      </ul>
    </motion.div>
  );
}
