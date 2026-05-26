"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Building2,
  LayoutDashboard,
  Target,
  TrendingUp,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Target, label: "Leads", active: false },
  { icon: Building2, label: "Clients", active: false },
];

export function LandingDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-lg perspective-[1200px] lg:max-w-none"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.5), rgba(168,85,247,0.35))",
          }}
          aria-hidden
        />

        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/80 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            <span className="ml-2 text-[10px] text-slate-500">
              school-connect.app
            </span>
          </div>

          <div className="flex min-h-[280px] md:min-h-[320px]">
            <aside className="hidden w-[72px] shrink-0 border-r border-white/10 bg-slate-950/60 p-2 sm:block">
              <div className="mb-4 px-1 font-heading text-[9px] font-bold text-indigo-300">
                SC
              </div>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`mb-1 flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[8px] ${
                      item.active
                        ? "bg-indigo-500/25 text-indigo-200"
                        : "text-slate-500"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </aside>

            <div className="flex-1 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500">Good morning</p>
                  <p className="font-heading text-sm font-semibold text-white">
                    Dashboard
                  </p>
                </div>
                <div className="relative rounded-lg bg-white/10 p-1.5">
                  <Bell className="h-3.5 w-3.5 text-slate-300" />
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Leads", value: "24", trend: "+12%", color: "from-blue-500/30 to-blue-600/10" },
                  { label: "Clients", value: "8", trend: "+3", color: "from-emerald-500/30 to-emerald-600/10" },
                  { label: "Revenue", value: "₹4.2L", trend: "↑", color: "from-violet-500/30 to-violet-600/10" },
                  { label: "Pending", value: "₹1.1L", trend: "Due", color: "from-amber-500/30 to-amber-600/10" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} p-2.5`}
                  >
                    <p className="text-[9px] text-slate-400">{stat.label}</p>
                    <p className="stat-number font-heading text-base font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-[8px] text-emerald-300">{stat.trend}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-medium text-slate-300">
                    Leads this month
                  </span>
                  <TrendingUp className="h-3 w-3 text-indigo-300" />
                </div>
                <div className="flex h-12 items-end gap-1">
                  {[35, 55, 40, 70, 50, 85, 65].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-gradient-to-t from-indigo-600 to-indigo-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute -bottom-4 -left-4 hidden rounded-xl border border-white/15 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md md:block"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400">Collection rate</p>
              <p className="font-heading text-sm font-bold text-white">68%</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
