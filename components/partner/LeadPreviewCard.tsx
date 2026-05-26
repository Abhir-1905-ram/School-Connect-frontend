"use client";

import { MapPin } from "lucide-react";
import { TargetClassesChips } from "@/components/leads/TargetClassesChips";
import { formatINRCurrency } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

export interface LeadPreviewData {
  schoolName?: string;
  description?: string;
  address?: string;
  city?: string;
  localArea?: string;
  pincode?: string;
  targetTitle?: string;
  targetClasses?: number[];
  dealValue?: number;
}

interface LeadPreviewCardProps {
  data: LeadPreviewData;
  className?: string;
}

export function LeadPreviewCard({ data, className }: LeadPreviewCardProps) {
  const hasContent = data.schoolName?.trim();

  return (
    <div
      className={cn(
        "sticky top-24 rounded-xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm",
        className
      )}
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        Live Preview
      </p>

      {!hasContent ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Start filling the form to see your lead card preview
        </p>
      ) : (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
          <h3 className="text-xl font-bold text-navy-900">
            {data.schoolName || "School Name"}
          </h3>
          {data.description && (
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">
              {data.description}
            </p>
          )}
          {(data.address || data.city) && (
            <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {[data.address, data.city, data.localArea, data.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {data.targetTitle && (
            <p className="mt-2 text-sm text-slate-600">
              Target: <span className="font-medium">{data.targetTitle}</span>
            </p>
          )}
          {data.targetClasses && data.targetClasses.length > 0 && (
            <div className="mt-3">
              <TargetClassesChips classes={data.targetClasses} maxVisible={8} />
            </div>
          )}
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">Deal value</p>
            <p className="font-heading text-2xl font-bold text-indigo-600">
              ₹{formatINRCurrency(data.dealValue ?? 0)}
            </p>
          </div>
        </article>
      )}
    </div>
  );
}
