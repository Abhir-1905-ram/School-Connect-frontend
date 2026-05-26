import type { Partner } from "@/lib/types";
import {
  formatINRCurrency,
  getAvatarColor,
  getInitials,
} from "@/lib/dashboard-utils";

export { formatINRCurrency, getAvatarColor, getInitials };

export function getPartnerUser(partner: Partner) {
  if (typeof partner.user === "object" && partner.user !== null) {
    return partner.user;
  }
  return null;
}

export function getPartnerName(partner: Partner): string {
  return getPartnerUser(partner)?.name ?? "Unknown";
}

export function getPartnerEmail(partner: Partner): string {
  return getPartnerUser(partner)?.email ?? "";
}

export function sortPartnersByName(partners: Partner[]): Partner[] {
  return [...partners].sort((a, b) =>
    getPartnerName(a).localeCompare(getPartnerName(b))
  );
}

export function extractUniqueCities(partners: Partner[]): string[] {
  const cities = new Set<string>();
  partners.forEach((p) => {
    if (p.city) cities.add(p.city);
  });
  return Array.from(cities).sort((a, b) => a.localeCompare(b));
}

export type PartnerSortOption = "leads" | "clients" | "revenue" | "name";

type ApiSortField = "leads" | "clients" | "revenue" | "joinedAt";

export const SORT_OPTIONS: {
  value: PartnerSortOption;
  label: string;
  apiSort?: ApiSortField;
}[] = [
  { value: "leads", label: "Most Leads", apiSort: "leads" },
  { value: "clients", label: "Most Clients", apiSort: "clients" },
  { value: "revenue", label: "Most Revenue", apiSort: "revenue" },
  { value: "name", label: "Name A-Z" },
];
