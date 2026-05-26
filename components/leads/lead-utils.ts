import type { Lead, LeadStatus, Partner } from "@/lib/types";
import { getPartnerName } from "@/components/partners/partner-utils";
import { formatINRCurrency } from "@/lib/dashboard-utils";
import dayjs from "dayjs";

export { formatINRCurrency };

export function getLeadPartner(lead: Lead): Partner | null {
  if (typeof lead.partner === "object" && lead.partner !== null) {
    return lead.partner as Partner;
  }
  return null;
}

export function getLeadPartnerName(lead: Lead): string {
  const partner = getLeadPartner(lead);
  return partner ? getPartnerName(partner) : "—";
}

export function getLeadPartnerId(lead: Lead): string | undefined {
  const partner = getLeadPartner(lead);
  return partner?._id ?? (typeof lead.partner === "string" ? lead.partner : undefined);
}

export function formatLeadDate(date: string): string {
  return dayjs(date).format("DD MMM YYYY");
}

export const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "negotiating", label: "Negotiating" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export const STATUS_TIMELINE: LeadStatus[] = [
  "new",
  "in_progress",
  "negotiating",
  "converted",
];

export function exportLeadsToCsv(leads: Lead[]): void {
  const headers = [
    "School Name",
    "Partner",
    "City",
    "Target Title",
    "Target Classes",
    "Deal Value",
    "Status",
    "Created Date",
  ];

  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;

  const rows = leads.map((lead) => [
    escape(lead.schoolName),
    escape(getLeadPartnerName(lead)),
    escape(lead.city),
    escape(lead.targetTitle),
    escape(lead.targetClasses.join(", ")),
    String(lead.dealValue),
    lead.status,
    formatLeadDate(lead.createdAt),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `school-connect-leads-${dayjs().format("YYYY-MM-DD")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
