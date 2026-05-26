"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/lib/api/clients";
import { getAllPartners } from "@/lib/api/partners";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination, DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";
import { ClientsFilterBar } from "@/components/clients/ClientsFilterBar";
import { ClientCard } from "@/components/clients/ClientCard";
import { ListPagination } from "@/components/ui/ListPagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaymentStatus } from "@/lib/types";

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [city, setCity] = useState("");

  const debouncedSearch = useDebounce(search, 400);
  const { page, setPage, limit, resetPage } = usePagination(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, partnerId, paymentStatus, city, resetPage]);

  const { data: partnersData } = useQuery({
    queryKey: ["partners-list"],
    queryFn: () => getAllPartners({ limit: 100, page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["clients", page, limit, debouncedSearch, partnerId, paymentStatus, city],
    queryFn: () =>
      getAllClients({
        search: debouncedSearch || undefined,
        partnerId: partnerId || undefined,
        paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
        city: city || undefined,
        limit,
        page,
      }),
  });

  const clients = data?.clients ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-2">
        <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
          Clients
        </h1>
        <p className="mt-1 text-slate-500">
          Converted schools and payment tracking
        </p>
      </div>

      <ClientsFilterBar
        search={search}
        onSearchChange={setSearch}
        partnerId={partnerId}
        onPartnerChange={setPartnerId}
        partners={partnersData?.partners ?? []}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        city={city}
        onCityChange={setCity}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 py-8 text-center text-rose-700">
          Failed to load clients.
        </div>
      )}

      {!isLoading && !isError && clients.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
          No clients match your filters
        </div>
      )}

      {!isLoading && !isError && clients.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <ClientCard key={client._id} client={client} />
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
    </div>
  );
}
