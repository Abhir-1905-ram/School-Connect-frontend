"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_STATUS_OPTIONS } from "./client-utils";
import type { PaymentStatus } from "@/lib/types";
import type { Partner } from "@/lib/types";
import { getPartnerName } from "@/components/partners/partner-utils";

interface ClientsFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  partnerId: string;
  onPartnerChange: (v: string) => void;
  partners: Partner[];
  paymentStatus: PaymentStatus | "all";
  onPaymentStatusChange: (v: PaymentStatus | "all") => void;
  city: string;
  onCityChange: (v: string) => void;
}

export function ClientsFilterBar({
  search,
  onSearchChange,
  partnerId,
  onPartnerChange,
  partners,
  paymentStatus,
  onPaymentStatusChange,
  city,
  onCityChange,
}: ClientsFilterBarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-200/80 bg-slate-50/95 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="relative min-w-[200px] flex-1 lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search school name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="w-full sm:w-[200px]">
          <Label className="mb-1.5 block text-xs text-slate-500">Partner</Label>
          <Select
            value={partnerId || "all"}
            onValueChange={(v) => onPartnerChange(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All partners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All partners</SelectItem>
              {partners.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {getPartnerName(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[150px]">
          <Label className="mb-1.5 block text-xs text-slate-500">Payment</Label>
          <Select
            value={paymentStatus}
            onValueChange={(v) => onPaymentStatusChange(v as PaymentStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[140px]">
          <Label className="mb-1.5 block text-xs text-slate-500">City</Label>
          <Input
            placeholder="Filter city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
