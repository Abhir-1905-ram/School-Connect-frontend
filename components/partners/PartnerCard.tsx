"use client";

import {
  Building2,
  Eye,
  IndianRupee,
  MapPin,
  Pencil,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatINRCurrency,
  getAvatarColor,
  getInitials,
  getPartnerName,
} from "./partner-utils";
import type { Partner } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PartnerCardProps {
  partner: Partner;
  onView: (partner: Partner) => void;
  onEdit: (partner: Partner) => void;
  onToggleStatus?: (partner: Partner) => void;
  isTogglingStatus?: boolean;
}

export function PartnerCard({
  partner,
  onView,
  onEdit,
  onToggleStatus,
  isTogglingStatus,
}: PartnerCardProps) {
  const name = getPartnerName(partner);
  const seed = partner._id ?? partner.partnerId;

  return (
    <article className="sc-card group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Gradient banner */}
      <div className="relative h-20 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={() => onToggleStatus?.(partner)}
            disabled={isTogglingStatus}
            className="shrink-0"
          >
            <Badge
              variant={partner.isActive ? "success" : "secondary"}
              className={cn(
                "cursor-pointer border-white/20 bg-white/90 shadow-sm backdrop-blur-sm transition-opacity",
                isTogglingStatus && "opacity-50"
              )}
            >
              {partner.isActive ? "Active" : "Inactive"}
            </Badge>
          </button>
        </div>
      </div>

      {/* Overlapping avatar + content */}
      <div className="relative px-5 pb-5">
        <div
          className={cn(
            "-mt-10 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white text-lg font-bold text-white shadow-lg",
            getAvatarColor(seed)
          )}
        >
          {getInitials(name)}
        </div>

        <div className="mt-3">
          <h3 className="truncate text-lg font-bold text-navy-900">{name}</h3>
          <p className="truncate text-sm text-slate-500">
            {partner.designation ?? "Partner"}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
          <span>
            {partner.city}, {partner.localArea} — {partner.pincode}
          </span>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-gradient-to-b from-slate-50 to-white p-3 ring-1 ring-slate-100">
          <div className="px-1 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Leads
              </span>
            </div>
            <p className="mt-1 font-heading text-lg font-bold text-navy-900">
              {partner.totalLeads}
            </p>
          </div>
          <div className="px-1 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Clients
              </span>
            </div>
            <p className="mt-1 font-heading text-lg font-bold text-navy-900">
              {partner.totalClients}
            </p>
          </div>
          <div className="px-1 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <IndianRupee className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Revenue
              </span>
            </div>
            <p className="mt-1 font-heading text-sm font-bold text-amber-600">
              ₹{formatINRCurrency(partner.totalRevenue)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <code className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-xs font-medium text-indigo-700">
            {partner.partnerId}
          </code>
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            onClick={() => onView(partner)}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            View Details
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 hover:bg-indigo-50 hover:text-indigo-600"
            onClick={() => onEdit(partner)}
            aria-label="Edit partner"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
