"use client";

import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "./lead-utils";
import type { LeadStatus } from "@/lib/types";
import type { Partner } from "@/lib/types";
import { getPartnerName } from "@/components/partners/partner-utils";
import { cn } from "@/lib/utils";

interface LeadsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  partnerId: string;
  onPartnerChange: (value: string) => void;
  partners: Partner[];
  status: LeadStatus | "all";
  onStatusChange: (value: LeadStatus | "all") => void;
  city: string;
  onCityChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  onExportCsv: () => void;
  exportDisabled?: boolean;
}

const inputClass =
  "rounded-xl border-slate-200/80 bg-white/80 shadow-sm transition-shadow focus-visible:ring-indigo-500/30";

export function LeadsFilterBar({
  search,
  onSearchChange,
  partnerId,
  onPartnerChange,
  partners,
  status,
  onStatusChange,
  city,
  onCityChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onExportCsv,
  exportDisabled,
}: LeadsFilterBarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-4 mb-4 px-4 py-4 md:-mx-6 md:px-6",
        "border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-xl backdrop-saturate-150"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="relative min-w-[200px] flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search school name…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn("pl-9", inputClass)}
            />
          </div>

          <div className="w-full sm:w-[200px]">
            <Label className="mb-1.5 block text-xs font-medium text-slate-500">
              Partner
            </Label>
            <Select
              value={partnerId || "all"}
              onValueChange={(v) => onPartnerChange(v === "all" ? "" : v)}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="All partners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All partners</SelectItem>
                {partners.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {getPartnerName(p)} ({p.partnerId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[160px]">
            <Label className="mb-1.5 block text-xs font-medium text-slate-500">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(v) => onStatusChange(v as LeadStatus | "all")}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[140px]">
            <Label className="mb-1.5 block text-xs font-medium text-slate-500">
              City
            </Label>
            <Input
              placeholder="Filter city"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-slate-500">
                From
              </Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className={cn("w-[140px]", inputClass)}
              />
            </div>
            <span className="hidden pb-2 text-slate-400 sm:inline">→</span>
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-slate-500">
                To
              </Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className={cn("w-[140px]", inputClass)}
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onExportCsv}
            disabled={exportDisabled}
            className="shrink-0 rounded-xl border-slate-200/80 bg-white/80 shadow-sm hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
