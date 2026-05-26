"use client";

import { MapPin, Target, Building2, IndianRupee, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAvatarColor, getInitials } from "@/lib/dashboard-utils";
import { formatINRCurrency } from "@/lib/dashboard-utils";
import type { Partner } from "@/lib/types";
import type { User } from "@/lib/types";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

interface PartnerHeroSectionProps {
  user: User;
  partner: Partner;
  pendingPayments: number;
}

export function PartnerHeroSection({
  user,
  partner,
  pendingPayments,
}: PartnerHeroSectionProps) {
  const stats = [
    {
      label: "My Leads",
      value: String(partner.totalLeads),
      icon: Target,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "My Clients",
      value: String(partner.totalClients),
      icon: Building2,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "My Revenue",
      value: `₹${formatINRCurrency(partner.totalRevenue)}`,
      icon: IndianRupee,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Pending Payments",
      value: String(pendingPayments),
      icon: Clock,
      color: "text-rose-600 bg-rose-100",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 shadow-xl shadow-indigo-500/25 md:p-8">
      {/* Decorative rings */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full border border-white/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full border border-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-4 left-8 h-24 w-24 rounded-full border border-purple-300/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />

      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex gap-5">
          <div className="relative shrink-0">
            <div
              className="pointer-events-none absolute -inset-2 rounded-2xl border border-white/25"
              aria-hidden
            />
            <div
              className={cn(
                "relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ring-2 ring-white/40",
                getAvatarColor(user.name)
              )}
            >
              {getInitials(user.name)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-indigo-100">
              {partner.designation ?? "Regional Partner"}
            </p>
            <code className="mt-2 inline-block rounded-lg bg-white/15 px-2.5 py-1 font-mono text-sm font-semibold text-white backdrop-blur-sm">
              {partner.partnerId}
            </code>
            <div className="mt-3 flex items-start gap-2 text-sm text-indigo-100">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
              <span>
                {partner.city}, {partner.localArea} — {partner.pincode}
              </span>
            </div>
            <p className="mt-2 text-xs text-indigo-200/80">
              Member since {dayjs(partner.joinedAt).format("DD MMM YYYY")}
            </p>
            <Badge
              variant={partner.isActive ? "success" : "secondary"}
              className="mt-3 border-white/20 bg-white/90"
            >
              {partner.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-transform hover:scale-[1.02]"
              >
                <div
                  className={cn(
                    "mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm",
                    stat.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-heading text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-indigo-100">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
