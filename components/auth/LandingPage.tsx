"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  IndianRupee,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Lead management",
    description: "Track school leads from first contact through conversion.",
  },
  {
    icon: Building2,
    title: "Client records",
    description: "Manage converted schools, deals, and payment status in one place.",
  },
  {
    icon: IndianRupee,
    title: "Payments & revenue",
    description: "Record collections, outstanding balances, and partner performance.",
  },
  {
    icon: Users,
    title: "Partner network",
    description: "Admins oversee partners; partners run their own dashboard.",
  },
];

export function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E1B4B 42%, #312E81 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-400/10 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-white"
        >
          School Connect
        </Link>
        <Button
          asChild
          variant="outline"
          className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <Link href="/login">Sign in</Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-indigo-200">
            Partner &amp; admin portal
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Grow school partnerships with clarity
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            School Connect helps your team manage leads, onboard clients, and
            track payments — built for admins and field partners.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-indigo-700 shadow-lg shadow-indigo-900/30 hover:bg-indigo-50"
            >
              <Link href="/login">
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-slate-400">
              Sign in with your admin or partner account
            </p>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30">
                  <Icon className="h-5 w-5 text-indigo-200" />
                </div>
                <h2 className="font-heading text-sm font-semibold text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        School Connect &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
