"use client";

import { Eye, Pencil, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TargetClassesChips } from "@/components/leads/TargetClassesChips";
import { formatINRCurrency, formatLeadDate } from "@/components/leads/lead-utils";
import type { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PartnerLeadCardProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

export function PartnerLeadCard({
  lead,
  onView,
  onEdit,
  onConvert,
}: PartnerLeadCardProps) {
  const canConvert =
    lead.status !== "converted" && lead.status !== "lost";

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm",
        "transition-all hover:border-brand/25 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-navy-900">{lead.schoolName}</h3>
          <p className="text-sm text-slate-500">{lead.city}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-3">
        <TargetClassesChips classes={lead.targetClasses} maxVisible={6} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-500">Deal value</p>
          <p className="font-heading text-xl font-bold text-navy-900">
            ₹{formatINRCurrency(lead.dealValue)}
          </p>
        </div>
        <p className="text-xs text-slate-400">{formatLeadDate(lead.createdAt)}</p>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(lead)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(lead)}
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {canConvert && (
          <Button
            variant="ghost"
            size="icon"
            className="text-emerald-600 hover:text-emerald-700"
            onClick={() => onConvert(lead)}
            aria-label="Convert"
          >
            <ArrowUpCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </article>
  );
}
