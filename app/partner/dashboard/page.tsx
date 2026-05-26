"use client";

import { useQuery } from "@tanstack/react-query";
import { getPartnerDashboardStats } from "@/lib/api/partner-dashboard";
import { PartnerHeroSection } from "@/components/partner/PartnerHeroSection";
import { PartnerDashboardChartsLazy } from "@/components/partner/PartnerDashboardChartsLazy";
import { RecentLeadsList } from "@/components/partner/RecentLeadsList";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead, Partner } from "@/lib/types";

export default function PartnerDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner-dashboard-stats"],
    queryFn: getPartnerDashboardStats,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[280px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Unable to load dashboard. Please refresh the page.
      </div>
    );
  }

  const partner = data.partner as Partner;
  const populatedUser = partner.user;
  const userObj =
    typeof populatedUser === "object" && populatedUser !== null
      ? {
          id: "_id" in populatedUser ? String(populatedUser._id) : "",
          name: populatedUser.name,
          email: populatedUser.email,
          role: "partner" as const,
        }
      : null;

  if (!userObj) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Unable to load partner profile. Please sign in again.
      </div>
    );
  }

  const recentLeads = data.recentLeads as Lead[];

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
          My Dashboard
        </h1>
        <p className="mt-1 text-slate-500">Your performance at a glance</p>
      </div>

      <PartnerHeroSection
        user={userObj}
        partner={partner}
        pendingPayments={data.pendingPayments}
      />

      <PartnerDashboardChartsLazy
        leads={recentLeads}
        monthlyLeadTrend={data.monthlyLeadTrend}
        leadStats={data.leadStats}
      />

      <RecentLeadsList leads={recentLeads} />
    </div>
  );
}
