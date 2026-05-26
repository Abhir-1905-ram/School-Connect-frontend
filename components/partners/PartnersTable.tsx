"use client";

import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatINRCurrency,
  getAvatarColor,
  getInitials,
  getPartnerName,
} from "./partner-utils";
import type { Partner } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { PartnerSortOption } from "./partner-utils";

interface PartnersTableProps {
  partners: Partner[];
  sortBy: PartnerSortOption;
  onSortChange: (sort: PartnerSortOption) => void;
  onView: (partner: Partner) => void;
  onEdit: (partner: Partner) => void;
}

const headerSortMap: Record<string, PartnerSortOption> = {
  Name: "name",
  Leads: "leads",
  Clients: "clients",
  Revenue: "revenue",
};

export function PartnersTable({
  partners,
  sortBy,
  onSortChange,
  onView,
  onEdit,
}: PartnersTableProps) {
  const handleHeaderClick = (label: string) => {
    const mapped = headerSortMap[label];
    if (mapped) onSortChange(mapped);
  };

  const SortableHead = ({
    label,
    className,
  }: {
    label: string;
    className?: string;
  }) => {
    const isActive = headerSortMap[label] === sortBy;
    return (
      <TableHead
        className={cn(
          "cursor-pointer select-none hover:text-brand",
          isActive && "text-brand",
          className
        )}
        onClick={() => handleHeaderClick(label)}
      >
        {label}
        {isActive && " ↓"}
      </TableHead>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Name" />
            <TableHead>Partner ID</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Pincode</TableHead>
            <SortableHead label="Leads" className="text-right" />
            <SortableHead label="Clients" className="text-right" />
            <SortableHead label="Revenue" className="text-right" />
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => {
            const name = getPartnerName(partner);
            return (
              <TableRow key={partner._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                        getAvatarColor(partner._id)
                      )}
                    >
                      {getInitials(name)}
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">{name}</p>
                      <p className="text-xs text-slate-500">
                        {partner.designation ?? "Partner"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="font-mono text-xs">{partner.partnerId}</code>
                </TableCell>
                <TableCell>{partner.city}</TableCell>
                <TableCell>{partner.localArea}</TableCell>
                <TableCell>{partner.pincode}</TableCell>
                <TableCell className="text-right font-medium">
                  {partner.totalLeads}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {partner.totalClients}
                </TableCell>
                <TableCell className="text-right font-medium text-amber-600">
                  ₹{formatINRCurrency(partner.totalRevenue)}
                </TableCell>
                <TableCell>
                  <Badge variant={partner.isActive ? "success" : "secondary"}>
                    {partner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(partner)}
                      aria-label="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(partner)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
