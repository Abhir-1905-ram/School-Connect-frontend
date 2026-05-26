"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  IndianRupee,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingDashboardPreview } from "./LandingDashboardPreview";

const stats = [
  { value: "360°", label: "Pipeline view" },
  { value: "Live", label: "Payment tracking" },
  { value: "2", label: "Role-based portals" },
];

const features = [
  {
    icon: Target,
    title: "Lead management",
    description: "Capture school leads, track status, and convert with one click.",
    className: "sm:col-span-2",
    accent: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    icon: Building2,
    title: "Client records",
    description: "Every converted school in one searchable directory.",
    className: "sm:col-span-1",
    accent: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: IndianRupee,
    title: "Payments",
    description: "Revenue, outstanding, and monthly collections at a glance.",
    className: "sm:col-span-1",
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Users,
    title: "Partner network",
    description: "Admins manage the network; partners get their own dashboard.",
    className: "sm:col-span-2",
    accent: "from-violet-500/20 to-violet-600/5",
  },
];

const steps = [
  "Sign in as admin or partner",
  "Manage leads & convert to clients",
  "Track payments and performance",
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(160deg, #0a0f1a 0%, #0f172a 35%, #1e1b4b 70%, #312e81 100%)",
        }}
      />
      <div className="login-grid-pattern fixed inset-0 -z-10 opacity-40" aria-hidden />
      <div
        className="pointer-events-none fixed -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-[80px]"
        aria-hidden
      />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.45)",
            }}
          >
            SC
          </span>
          School Connect
        </Link>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="hidden text-slate-300 hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="rounded-xl border-0 text-white shadow-lg shadow-indigo-900/40"
            style={{
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
            }}
          >
            <Link href="/login">
              Get started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-6 md:px-8 md:pb-24 lg:grid-cols-2 lg:gap-16 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-200"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              Partner &amp; admin portal
            </motion.p>

            <h1 className="text-balance font-heading text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.25rem]">
              Grow school{" "}
              <span
                className="bg-gradient-to-r from-indigo-200 via-purple-200 to-violet-300 bg-clip-text text-transparent"
              >
                partnerships
              </span>{" "}
              with clarity
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              One platform for leads, clients, and payments — so your team and
              field partners stay aligned from first contact to collection.
            </p>

            <ul className="mt-8 space-y-3">
              {steps.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                  {step}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-indigo-800 shadow-xl shadow-indigo-950/40 transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                <Link href="/login">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative lg:pl-4">
            <LandingDashboardPreview />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-300">
              <Zap className="h-4 w-4" />
              Everything you need
            </div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Built for growing school networks
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              From lead capture to payment reconciliation — no spreadsheets required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-shadow hover:border-white/20 hover:shadow-xl hover:shadow-indigo-950/30 ${feature.className}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/25 ring-1 ring-indigo-400/20">
                      <Icon className="h-5 w-5 text-indigo-200" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 px-8 py-12 text-center md:px-16 md:py-14"
            style={{
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(124,58,237,0.15) 50%, rgba(49,46,129,0.4) 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 login-grid-pattern opacity-30"
              aria-hidden
            />
            <div className="relative">
              <h2 className="font-heading text-2xl font-bold md:text-3xl">
                Ready to connect your schools?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-300">
                Sign in with your admin or partner account and start managing
                your pipeline today.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 rounded-xl bg-white px-10 font-semibold text-indigo-800 hover:bg-indigo-50"
              >
                <Link href="/login">
                  Open portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-slate-500">
        School Connect &copy; {new Date().getFullYear()} — Partner &amp; Admin
        Portal
      </footer>
    </div>
  );
}
