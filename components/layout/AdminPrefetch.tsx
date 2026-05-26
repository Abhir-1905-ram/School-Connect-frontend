"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboard";
import { getAllPartners } from "@/lib/api/partners";
import { getAllLeads } from "@/lib/api/leads";
import { getAllClients } from "@/lib/api/clients";
import { DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";

export function AdminPrefetch({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: ["dashboard-stats"],
      queryFn: getDashboardStats,
    });
    void queryClient.prefetchQuery({
      queryKey: ["partners", 1, DEFAULT_PAGE_SIZE, "", "", "leads"],
      queryFn: () =>
        getAllPartners({ limit: DEFAULT_PAGE_SIZE, page: 1, sortBy: "leads" }),
    });
    void queryClient.prefetchQuery({
      queryKey: ["leads", 1, DEFAULT_PAGE_SIZE, "", "", "all", "", "", ""],
      queryFn: () => getAllLeads({ limit: DEFAULT_PAGE_SIZE, page: 1 }),
    });
    void queryClient.prefetchQuery({
      queryKey: ["clients", 1, DEFAULT_PAGE_SIZE, "", "", "all", ""],
      queryFn: () => getAllClients({ limit: DEFAULT_PAGE_SIZE, page: 1 }),
    });
  }, [queryClient]);

  return <>{children}</>;
}
