"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Building2, Clock, IndianRupee } from "lucide-react";
import { getAllClients } from "@/lib/api/clients";
import { getMe } from "@/lib/api/auth";
import { usePagination, DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { PartnerClientCard } from "@/components/partner/PartnerClientCard";
import { EditClientDrawer } from "@/components/partner/EditClientDrawer";
import { ListPagination } from "@/components/ui/ListPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/components/ui/IndianCurrency";
import type { Client } from "@/lib/types";

export default function PartnerClientsPage() {
  const [editClient, setEditClient] = useState<Client | null>(null);
  const { page, setPage, limit } = usePagination(DEFAULT_PAGE_SIZE);

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner-clients", page, limit],
    queryFn: () => getAllClients({ limit, page }),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });

  const clients = data?.clients ?? [];
  const pagination = data?.pagination;
  const partner = meData?.partner;

  const pendingPayments = clients.filter(
    (c) => c.paymentStatus === "unpaid" || c.paymentStatus === "partial"
  ).length;

  const totalRevenue =
    partner?.totalRevenue ??
    clients.reduce((sum, c) => sum + c.dealValue, 0);

  const totalClients = partner?.totalClients ?? pagination?.total ?? clients.length;

  return (
    <div className="pb-8">
      <PageHeader
        title="My Clients"
        subtitle="Schools you have successfully converted"
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total My Clients"
          value={totalClients}
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Total My Revenue"
          value={totalRevenue}
          icon={IndianRupee}
          color="emerald"
          prefix="₹"
          formatValue={formatINR}
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={Clock}
          color="amber"
        />
      </div>

      {isLoading && !data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 py-8 text-center text-rose-700">
          Failed to load clients.
        </div>
      )}

      {!isLoading && !isError && clients.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-slate-500">No clients yet</p>
          <a
            href="/partner/leads"
            className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
          >
            Convert a lead to get started →
          </a>
        </div>
      )}

      {!isLoading && !isError && clients.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <PartnerClientCard
                key={client._id}
                client={client}
                onEdit={setEditClient}
              />
            ))}
          </div>
          {pagination && (
            <ListPagination
              className="mt-6"
              pagination={pagination}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <EditClientDrawer
        client={editClient}
        open={!!editClient}
        onOpenChange={(open) => !open && setEditClient(null)}
      />
    </div>
  );
}
