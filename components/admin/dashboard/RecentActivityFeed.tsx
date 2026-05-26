"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";

dayjs.extend(relativeTime);

interface RecentActivityFeedProps {
  activities: DashboardStats["recentActivity"];
  limit?: number;
}

const dotColors: Record<
  DashboardStats["recentActivity"][0]["type"],
  { dot: string; ring: string }
> = {
  client: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/20",
  },
  lead: {
    dot: "bg-blue-500",
    ring: "ring-blue-500/20",
  },
  payment: {
    dot: "bg-amber-500",
    ring: "ring-amber-500/20",
  },
};

export function RecentActivityFeed({
  activities,
  limit = 10,
}: RecentActivityFeedProps) {
  const items = activities.slice(0, limit);

  return (
    <div className="max-h-[480px] overflow-y-auto pr-1">
      <ul className="relative">
        {items.length > 0 && (
          <span
            className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent"
            aria-hidden
          />
        )}
        {items.map((item, index) => {
          const colors = dotColors[item.type];
          return (
            <li
              key={`${item.type}-${item.timestamp}-${index}`}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4",
                    colors.ring
                  )}
                >
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full", colors.dot)}
                    aria-hidden
                  />
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm leading-snug text-slate-700">
                  {item.description}
                </p>
                <p className="mt-1.5 text-xs font-medium text-slate-400">
                  {dayjs(item.timestamp).fromNow()}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {items.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-500">
          No recent activity
        </p>
      )}
    </div>
  );
}
