import { api } from "@/lib/axios";
import type { ApiResponse, DashboardStats } from "@/lib/types";

export async function getDashboardStats() {
  const { data } = await api.get<ApiResponse<DashboardStats>>(
    "/admin/dashboard-stats"
  );
  return data.data;
}
