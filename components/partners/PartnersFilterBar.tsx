"use client";

import { Grid3X3, LayoutList, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type PartnerSortOption } from "./partner-utils";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "table";

interface PartnersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  cities: string[];
  sortBy: PartnerSortOption;
  onSortChange: (value: PartnerSortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddPartner: () => void;
}

export function PartnersFilterBar({
  search,
  onSearchChange,
  city,
  onCityChange,
  cities,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onAddPartner,
}: PartnersFilterBarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-200/80 bg-slate-50/95 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search name, city, area…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={city || "all"}
            onValueChange={(v) => onCityChange(v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) => onSortChange(v as PartnerSortOption)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "rounded-md p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-brand text-white"
                  : "text-slate-500 hover:text-slate-800"
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={cn(
                "rounded-md p-2 transition-colors",
                viewMode === "table"
                  ? "bg-brand text-white"
                  : "text-slate-500 hover:text-slate-800"
              )}
              aria-label="Table view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={onAddPartner}
            className="bg-gradient-to-r from-brand to-brand-light shadow-md shadow-brand/25 hover:brightness-105"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Partner
          </Button>
        </div>
      </div>
    </div>
  );
}
