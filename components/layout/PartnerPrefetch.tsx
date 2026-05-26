"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getPartnerDashboardStats } from "@/lib/api/partner-dashboard";
import { getAllLeads } from "@/lib/api/leads";
import { getAllClients } from "@/lib/api/clients";
import { DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";

export function PartnerPrefetch({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: ["partner-dashboard-stats"],
      queryFn: getPartnerDashboardStats,
    });
    void queryClient.prefetchQuery({
      queryKey: ["partner-leads", 1, DEFAULT_PAGE_SIZE, "", "all", "", ""],
      queryFn: () => getAllLeads({ limit: DEFAULT_PAGE_SIZE, page: 1 }),
    });
    void queryClient.prefetchQuery({
      queryKey: ["partner-clients", 1, DEFAULT_PAGE_SIZE],
      queryFn: () => getAllClients({ limit: DEFAULT_PAGE_SIZE, page: 1 }),
    });
  }, [queryClient]);

  return <>{children}</>;
}
