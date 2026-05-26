"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/components/leads/lead-utils";
import type { LeadStatus } from "@/lib/types";

interface PartnerLeadsFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: LeadStatus | "all";
  onStatusChange: (v: LeadStatus | "all") => void;
  fromDate: string;
  onFromDateChange: (v: string) => void;
  toDate: string;
  onToDateChange: (v: string) => void;
}

export function PartnerLeadsFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: PartnerLeadsFilterBarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-200/80 bg-slate-50/95 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search school name…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-[160px]">
            <Label className="mb-1.5 block text-xs text-slate-500">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => onStatusChange(v as LeadStatus | "all")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-slate-500">From</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-[140px]"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-slate-500">To</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-[140px]"
            />
          </div>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-brand to-brand-light shrink-0"
        >
          <Link href="/partner/leads/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Lead
          </Link>
        </Button>
      </div>
    </div>
  );
}
