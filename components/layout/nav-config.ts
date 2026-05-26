import {
  Building2,
  IndianRupee,
  LayoutDashboard,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Partners", href: "/admin/partners", icon: Users },
  { label: "Leads", href: "/admin/leads", icon: Target },
  { label: "Clients", href: "/admin/clients", icon: Building2 },
  { label: "Payments", href: "/admin/payments", icon: IndianRupee },
];

export const PARTNER_NAV: NavItem[] = [
  { label: "My Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
  { label: "My Leads", href: "/partner/leads", icon: Target },
  { label: "My Clients", href: "/partner/clients", icon: Building2 },
];

export function getNavItems(role: UserRole): NavItem[] {
  return role === "admin" ? ADMIN_NAV : PARTNER_NAV;
}

export const BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  partner: "Partner",
  dashboard: "Dashboard",
  partners: "Partners",
  leads: "Leads",
  new: "New Lead",
  clients: "Clients",
  payments: "Payments",
  profile: "Profile",
  settings: "Settings",
};
