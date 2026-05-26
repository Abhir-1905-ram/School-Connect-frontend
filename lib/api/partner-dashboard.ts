import { api } from "@/lib/axios";
import type { ApiResponse, Lead, Partner } from "@/lib/types";

export interface PartnerDashboardStats {
  partner: Partner;
  recentLeads: Pick<
    Lead,
    "_id" | "schoolName" | "status" | "dealValue" | "createdAt" | "city"
  >[];
  pendingPayments: number;
  monthlyLeadTrend: { month: string; count: number }[];
  leadStats: {
    total: number;
    inProgress: number;
    converted: number;
    new: number;
    lost: number;
  };
}

export async function getPartnerDashboardStats() {
  const { data } = await api.get<ApiResponse<PartnerDashboardStats>>(
    "/partner/dashboard-stats"
  );
  return data.data;
}
