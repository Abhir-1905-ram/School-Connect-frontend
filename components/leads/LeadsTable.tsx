"use client";

import { ArrowRightCircle, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TargetClassesChips } from "./TargetClassesChips";
import {
  formatINRCurrency,
  formatLeadDate,
  getLeadPartnerName,
} from "./lead-utils";
import type { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  rowOffset?: number;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

export function LeadsTable({
  leads,
  rowOffset = 0,
  onView,
  onEdit,
  onConvert,
}: LeadsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200/80">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 hover:bg-gradient-to-r hover:from-slate-50 hover:via-indigo-50/40 hover:to-slate-50">
              <TableHead className="sticky left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-slate-50/95 font-semibold uppercase tracking-wider text-slate-600">
                #
              </TableHead>
              <TableHead className="sticky left-10 z-10 min-w-[140px] bg-gradient-to-r from-slate-50 to-slate-50/95 font-semibold uppercase tracking-wider text-slate-600 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                School Name
              </TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-slate-600">
                Partner
              </TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-slate-600">
                City
              </TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-slate-600">
                Target Classes
              </TableHead>
              <TableHead className="text-right font-semibold uppercase tracking-wider text-slate-600">
                Deal Value
              </TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-slate-600">
                Status
              </TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-slate-600">
                Date
              </TableHead>
              <TableHead className="w-[120px] text-right font-semibold uppercase tracking-wider text-slate-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => {
              const canConvert =
                lead.status !== "converted" && lead.status !== "lost";

              return (
                <TableRow
                  key={lead._id}
                  className={cn(
                    "group border-slate-100 transition-colors",
                    "hover:bg-indigo-50/30"
                  )}
                >
                  <TableCell className="sticky left-0 z-10 bg-white text-slate-500 group-hover:bg-indigo-50/30">
                    {rowOffset + index + 1}
                  </TableCell>
                  <TableCell className="sticky left-10 z-10 bg-white font-medium text-navy-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] group-hover:bg-indigo-50/30">
                    {lead.schoolName}
                  </TableCell>
                  <TableCell className="group-hover:bg-indigo-50/30">
                    {getLeadPartnerName(lead)}
                  </TableCell>
                  <TableCell className="group-hover:bg-indigo-50/30">
                    {lead.city}
                  </TableCell>
                  <TableCell className="group-hover:bg-indigo-50/30">
                    <TargetClassesChips classes={lead.targetClasses} />
                  </TableCell>
                  <TableCell className="text-right font-medium text-navy-900 group-hover:bg-indigo-50/30">
                    <span className="stat-number">
                      ₹{formatINRCurrency(lead.dealValue)}
                    </span>
                  </TableCell>
                  <TableCell className="group-hover:bg-indigo-50/30">
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-slate-600 group-hover:bg-indigo-50/30">
                    {formatLeadDate(lead.createdAt)}
                  </TableCell>
                  <TableCell className="text-right group-hover:bg-indigo-50/30">
                    <div className="flex justify-end gap-0.5 opacity-0 transition-all duration-200 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-indigo-100 hover:text-indigo-700"
                        onClick={() => onView(lead)}
                        aria-label="View lead"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-indigo-100 hover:text-indigo-700"
                        onClick={() => onEdit(lead)}
                        aria-label="Edit lead"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canConvert && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => onConvert(lead)}
                          aria-label="Convert to client"
                        >
                          <ArrowRightCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
