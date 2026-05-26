"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, MapPin, User } from "lucide-react";
import dayjs from "dayjs";
import { getLead } from "@/lib/api/leads";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TargetClassesChips } from "./TargetClassesChips";
import {
  formatINRCurrency,
  formatLeadDate,
  getLeadPartner,
  getLeadPartnerName,
  STATUS_TIMELINE,
} from "./lead-utils";
import type { Lead, LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatusTimeline({ current }: { current: LeadStatus }) {
  if (current === "lost") {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        This lead was marked as lost.
      </div>
    );
  }

  const currentIndex = STATUS_TIMELINE.indexOf(
    current === "converted" ? "converted" : current
  );

  return (
    <ol className="relative space-y-0">
      {STATUS_TIMELINE.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = step === current || (current === "converted" && step === "converted");

        return (
          <li key={step} className="flex gap-3 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                  isComplete
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 bg-white text-slate-400"
                )}
              >
                {index + 1}
              </div>
              {index < STATUS_TIMELINE.length - 1 && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-[24px]",
                    isComplete && index < currentIndex
                      ? "bg-brand"
                      : "bg-slate-200"
                  )}
                />
              )}
            </div>
            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-semibold capitalize",
                  isCurrent ? "text-brand" : "text-slate-700"
                )}
              >
                {step.replace("_", " ")}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function LeadDetailDrawer({
  lead,
  open,
  onOpenChange,
}: LeadDetailDrawerProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["lead", lead?._id],
    queryFn: () => getLead(lead!._id),
    enabled: !!lead?._id && open,
  });

  const l = data?.lead ?? lead;
  const partner = l ? getLeadPartner(l) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-[480px]"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading">Lead Details</SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {!isLoading && l && (
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-xl font-bold text-navy-900">
                  {l.schoolName}
                </h2>
                <StatusBadge status={l.status} />
              </div>
              {l.description && (
                <p className="mt-2 text-sm text-slate-600">{l.description}</p>
              )}
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-2 text-sm">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p>{l.address}</p>
                  <p className="text-slate-500">
                    {l.city}
                    {l.localArea && `, ${l.localArea}`}
                    {l.pincode && ` — ${l.pincode}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Partner
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand" />
                <span className="font-medium">{getLeadPartnerName(l)}</span>
              </div>
              {partner && (
                <p className="mt-1 text-xs text-slate-500">
                  {partner.partnerId} · {partner.city}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Target — {l.targetTitle}
              </p>
              <TargetClassesChips classes={l.targetClasses} size="md" />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
              <span className="text-sm text-amber-800">Deal Value</span>
              <span className="font-heading text-xl font-bold text-amber-700">
                ₹{formatINRCurrency(l.dealValue)}
              </span>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Status Timeline
              </p>
              <StatusTimeline current={l.status} />
            </div>

            {l.convertedAt && (
              <p className="text-sm text-emerald-600">
                <Building2 className="mr-1 inline h-4 w-4" />
                Converted on {dayjs(l.convertedAt).format("DD MMM YYYY")}
              </p>
            )}

            {l.notes && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Notes
                </p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {l.notes}
                </p>
              </div>
            )}

            <p className="text-xs text-slate-400">
              Created {formatLeadDate(l.createdAt)}
            </p>
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}
