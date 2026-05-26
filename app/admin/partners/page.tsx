"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllPartners, updatePartner } from "@/lib/api/partners";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination, DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";
import { ListPagination } from "@/components/ui/ListPagination";
import { PartnersFilterBar, type ViewMode } from "@/components/partners/PartnersFilterBar";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { AddPartnerModal } from "@/components/partners/AddPartnerModal";
import { EditPartnerModal } from "@/components/partners/EditPartnerModal";
import { PartnerDetailDrawer } from "@/components/partners/PartnerDetailDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  extractUniqueCities,
  sortPartnersByName,
  SORT_OPTIONS,
  type PartnerSortOption,
} from "@/components/partners/partner-utils";
import type { Partner } from "@/lib/types";

export default function AdminPartnersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<PartnerSortOption>("leads");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [addOpen, setAddOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const { page, setPage, limit, resetPage } = usePagination(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, city, sortBy, resetPage]);

  const apiSort = SORT_OPTIONS.find((o) => o.value === sortBy)?.apiSort;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partners", page, limit, debouncedSearch, city, sortBy],
    queryFn: () =>
      getAllPartners({
        search: debouncedSearch || undefined,
        city: city || undefined,
        sortBy: apiSort,
        limit,
        page,
      }),
  });

  const { data: citiesData } = useQuery({
    queryKey: ["partners-cities"],
    queryFn: () => getAllPartners({ limit: 200, page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const cities = useMemo(
    () => extractUniqueCities(citiesData?.partners ?? []),
    [citiesData]
  );

  const partners = useMemo(() => {
    const list = data?.partners ?? [];
    if (sortBy === "name") return sortPartnersByName(list);
    return list;
  }, [data?.partners, sortBy]);

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updatePartner(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner status updated");
    },
    onError: () => toast.error("Failed to update status"),
    onSettled: () => setTogglingId(null),
  });

  const handleToggleStatus = (partner: Partner) => {
    setTogglingId(partner._id);
    statusMutation.mutate({
      id: partner._id,
      isActive: !partner.isActive,
    });
  };

  const handleEdit = (partner: Partner) => {
    setEditPartner(partner);
    setDetailPartner(null);
  };

  return (
    <div>
      <div className="mb-2">
        <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
          Partners
        </h1>
        <p className="mt-1 text-slate-500">
          Manage partner accounts and territories
        </p>
      </div>

      <PartnersFilterBar
        search={search}
        onSearchChange={setSearch}
        city={city}
        onCityChange={setCity}
        cities={cities}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddPartner={() => setAddOpen(true)}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-rose-700">
          Failed to load partners. Please try again.
        </div>
      )}

      {!isLoading && !isError && partners.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-slate-500">No partners found</p>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            Add your first partner
          </button>
        </div>
      )}

      {!isLoading && !isError && partners.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((partner) => (
            <PartnerCard
              key={partner._id}
              partner={partner}
              onView={setDetailPartner}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              isTogglingStatus={togglingId === partner._id}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && partners.length > 0 && viewMode === "table" && (
        <PartnersTable
          partners={partners}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onView={setDetailPartner}
          onEdit={handleEdit}
        />
      )}

      {!isLoading && data?.pagination && (
        <ListPagination
          className="mt-6"
          pagination={data.pagination}
          onPageChange={setPage}
        />
      )}

      <AddPartnerModal open={addOpen} onOpenChange={setAddOpen} />

      <EditPartnerModal
        partner={editPartner}
        open={!!editPartner}
        onOpenChange={(open) => !open && setEditPartner(null)}
      />

      <PartnerDetailDrawer
        partner={detailPartner}
        open={!!detailPartner}
        onOpenChange={(open) => !open && setDetailPartner(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
