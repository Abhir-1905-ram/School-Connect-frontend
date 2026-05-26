"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  IndianRupee,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import dayjs from "dayjs";
import { getDashboardStats } from "@/lib/api/dashboard";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/ui/StatCard";
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";
import { LeadsByCityChart } from "@/components/admin/dashboard/LeadsByCityChart";
import { PartnerPerformanceChart } from "@/components/admin/dashboard/PartnerPerformanceChart";
import { PartnerLeaderboard } from "@/components/admin/dashboard/PartnerLeaderboard";
import { RecentActivityFeed } from "@/components/admin/dashboard/RecentActivityFeed";
import {
  formatINRCurrency,
  getEstimatedChange,
  getLeadTrendChange,
} from "@/lib/dashboard-utils";

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 border-l-4 border-indigo-500 pl-4">
      <h2 className="font-heading text-lg font-semibold text-navy-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-rose-700">
        Failed to load dashboard. Please refresh the page.
      </div>
    );
  }

  const leadChange = getLeadTrendChange(data.monthlyLeadTrend);
  const partnersChange = getEstimatedChange(data.monthlyLeadTrend, 0.6);
  const clientsChange = getEstimatedChange(data.monthlyLeadTrend, 0.85);
  const revenueChange = getEstimatedChange(data.monthlyLeadTrend, 1.1);
  const topCity = [...data.leadsByCity].sort((a, b) => b.count - a.count)[0];
  const today = dayjs().format("dddd, D MMMM YYYY");

  const insightPills = [
    {
      label: `${data.totalLeads} total leads`,
      icon: Target,
      className: "bg-white/15 text-white backdrop-blur-sm",
    },
    {
      label: topCity ? `Top city: ${topCity.city}` : "No city data yet",
      icon: TrendingUp,
      className: "bg-white/10 text-white/95 backdrop-blur-sm",
    },
    {
      label: `${data.partnerLeaderboard.length} active partners`,
      icon: Users,
      className: "bg-white/10 text-white/95 backdrop-blur-sm",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 shadow-lg shadow-indigo-500/25 md:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-purple-400/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Admin Dashboard
            </div>
            <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">
              Welcome back, {user?.name ?? "Admin"}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-indigo-100">
              <Calendar className="h-4 w-4 shrink-0" />
              {today}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {insightPills.map(({ label, icon: Icon, className }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${className}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Partners"
          value={data.totalPartners}
          icon={Users}
          color="indigo"
          change={partnersChange}
          delay={0}
        />
        <StatCard
          title="Total Leads"
          value={data.totalLeads}
          icon={Target}
          color="blue"
          change={leadChange}
          delay={0.1}
        />
        <StatCard
          title="Converted Clients"
          value={data.totalClients}
          icon={CheckCircle}
          color="emerald"
          change={clientsChange}
          delay={0.2}
        />
        <StatCard
          title="Total Revenue"
          value={data.totalRevenue}
          icon={IndianRupee}
          color="amber"
          prefix="₹"
          change={revenueChange}
          formatValue={formatINRCurrency}
          delay={0.3}
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionHeading
            title="Leads by City"
            subtitle="Top cities by lead volume"
          />
          <LeadsByCityChart data={data.leadsByCity} />
        </div>

        <div className="sc-card p-5 lg:col-span-2">
          <SectionHeading
            title="Partner Performance"
            subtitle="Lead distribution by partner"
          />
          <PartnerPerformanceChart leaderboard={data.partnerLeaderboard} />
        </div>
      </section>

      {/* Leaderboard + Activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionHeading
            title="Partner Leaderboard"
            subtitle="Ranked by leads, clients & revenue"
          />
          <PartnerLeaderboard leaderboard={data.partnerLeaderboard} />
        </div>

        <div className="sc-card p-5 lg:col-span-2">
          <SectionHeading
            title="Recent Activity"
            subtitle="Latest updates across the platform"
          />
          <RecentActivityFeed activities={data.recentActivity} limit={10} />
        </div>
      </section>
    </div>
  );
}
