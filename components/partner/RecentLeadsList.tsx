"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINRCurrency, formatLeadDate } from "@/components/leads/lead-utils";
import type { Lead } from "@/lib/types";

interface RecentLeadsListProps {
  leads: Lead[];
}

export function RecentLeadsList({ leads }: RecentLeadsListProps) {
  const recent = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-navy-900">
        Recent Leads
      </h2>
      <ul className="mt-4 divide-y divide-slate-100">
        {recent.length === 0 && (
          <li className="py-6 text-center text-sm text-slate-500">
            No leads yet — add your first lead!
          </li>
        )}
        {recent.map((lead) => (
          <li
            key={lead._id}
            className="flex flex-wrap items-center justify-between gap-2 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-navy-900">{lead.schoolName}</p>
              <p className="text-xs text-slate-500">
                {lead.city} · {formatLeadDate(lead.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={lead.status} />
              <span className="text-sm font-semibold text-navy-900">
                ₹{formatINRCurrency(lead.dealValue)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/partner/leads"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
      >
        View All My Leads
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
