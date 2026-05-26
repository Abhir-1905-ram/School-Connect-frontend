"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PartnerFab() {
  const [open, setOpen] = useState(false);

  const options = [
    {
      href: "/partner/leads/new",
      label: "Add New Lead",
      icon: Target,
      delay: 0.05,
    },
    {
      href: "/partner/clients",
      label: "View My Clients",
      icon: Building2,
      delay: 0.1,
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:hidden">
      <AnimatePresence>
        {open &&
          options.map((opt) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.href}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: opt.delay, duration: 0.2 }}
                className="mb-3 flex justify-end"
              >
                <Link
                  href={opt.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white py-2 pl-4 pr-3 shadow-lg shadow-indigo-500/15 hover:bg-indigo-50"
                >
                  <span className="text-sm font-medium text-navy-900">
                    {opt.label}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                    <Icon className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={{ rotate: open ? 45 : 0 }}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white",
          "shadow-xl shadow-indigo-500/40",
          "hover:shadow-2xl hover:shadow-indigo-500/50",
          "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        )}
        aria-label={open ? "Close menu" : "Quick actions"}
      >
        <Plus className="h-7 w-7" />
      </motion.button>
    </div>
  );
}
