"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Target,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getPartner, getPartnerStats } from "@/lib/api/partners";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatINRCurrency,
  getAvatarColor,
  getInitials,
  getPartnerEmail,
  getPartnerName,
} from "./partner-utils";
import type { Partner } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PartnerDetailDrawerProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (partner: Partner) => void;
}

export function PartnerDetailDrawer({
  partner,
  open,
  onOpenChange,
  onEdit,
}: PartnerDetailDrawerProps) {
  const partnerId = partner?._id ?? partner?.partnerId;

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartner(partnerId!),
    enabled: !!partnerId && open,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["partner-stats", partnerId],
    queryFn: () => getPartnerStats(partnerId!),
    enabled: !!partnerId && open,
  });

  const p = detail?.partner ?? partner;
  if (!p) return null;

  const name = getPartnerName(p);
  const chartData =
    stats?.leadsByMonth.map((m) => ({
      month: m.month.slice(5),
      leads: m.count,
    })) ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-[480px]"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading">Partner Details</SheetTitle>
        </SheetHeader>

        {detailLoading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white",
                  getAvatarColor(p._id)
                )}
              >
                {getInitials(name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-xl font-bold text-navy-900">
                  {name}
                </h2>
                <p className="text-sm text-slate-500">
                  {p.designation ?? "Partner"}
                </p>
                <code className="mt-1 inline-block font-mono text-xs text-brand">
                  {p.partnerId}
                </code>
                <div className="mt-2">
                  <Badge variant={p.isActive ? "success" : "secondary"}>
                    {p.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 shrink-0" />
                {getPartnerEmail(p)}
              </div>
              {p.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 shrink-0" />
                  {p.phone}
                </div>
              )}
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {p.city}, {p.localArea} — {p.pincode}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-100 p-3 text-center">
                <Target className="mx-auto h-4 w-4 text-blue-500" />
                <p className="mt-1 text-xs text-slate-500">Leads</p>
                <p className="font-heading text-lg font-bold">
                  {stats?.totalLeads ?? p.totalLeads}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 p-3 text-center">
                <Building2 className="mx-auto h-4 w-4 text-emerald-500" />
                <p className="mt-1 text-xs text-slate-500">Clients</p>
                <p className="font-heading text-lg font-bold">
                  {stats?.totalClients ?? p.totalClients}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 p-3 text-center">
                <IndianRupee className="mx-auto h-4 w-4 text-amber-500" />
                <p className="mt-1 text-xs text-slate-500">Revenue</p>
                <p className="font-heading text-sm font-bold text-amber-600">
                  ₹{formatINRCurrency(stats?.totalRevenue ?? p.totalRevenue)}
                </p>
              </div>
            </div>

            {stats && (
              <p className="text-center text-sm text-slate-500">
                Conversion rate:{" "}
                <span className="font-semibold text-emerald-600">
                  {stats.conversionRate}%
                </span>
              </p>
            )}

            <div>
              <h3 className="mb-3 font-heading text-sm font-semibold text-navy-900">
                Leads (last 6 months)
              </h3>
              {statsLoading ? (
                <div className="flex h-[180px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-brand" />
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        dot={{ fill: "#4F46E5", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  No lead data for this period
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => {
                onEdit(p);
                onOpenChange(false);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Partner
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
