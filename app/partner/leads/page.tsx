"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllLeads } from "@/lib/api/leads";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination, DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";
import { PartnerLeadsFilterBar } from "@/components/partner/PartnerLeadsFilterBar";
import { PartnerLeadCard } from "@/components/partner/PartnerLeadCard";
import { LeadDetailDrawer } from "@/components/leads/LeadDetailDrawer";
import { EditLeadModal } from "@/components/leads/EditLeadModal";
import { ConvertLeadDialog } from "@/components/leads/ConvertLeadDialog";
import { ListPagination } from "@/components/ui/ListPagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead, LeadStatus } from "@/lib/types";

export default function PartnerLeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const { page, setPage, limit, resetPage } = usePagination(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, status, fromDate, toDate, resetPage]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner-leads", page, limit, debouncedSearch, status, fromDate, toDate],
    queryFn: () =>
      getAllLeads({
        search: debouncedSearch || undefined,
        status: status === "all" ? undefined : status,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        limit,
        page,
      }),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });

  const leads = data?.leads ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-2">
        <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
          My Leads
        </h1>
        <p className="mt-1 text-slate-500">
          Manage and convert your school leads
        </p>
      </div>

      <PartnerLeadsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
      />

      {isLoading && !data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[240px] rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 py-8 text-center text-rose-700">
          Failed to load leads.
        </div>
      )}

      {!isLoading && !isError && leads.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-slate-500">No leads found</p>
          <a
            href="/partner/leads/new"
            className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
          >
            Add your first lead →
          </a>
        </div>
      )}

      {!isLoading && !isError && leads.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead) => (
              <PartnerLeadCard
                key={lead._id}
                lead={lead}
                onView={setDetailLead}
                onEdit={setEditLead}
                onConvert={setConvertLead}
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

      <LeadDetailDrawer
        lead={detailLead}
        open={!!detailLead}
        onOpenChange={(open) => !open && setDetailLead(null)}
      />

      <EditLeadModal
        lead={editLead}
        open={!!editLead}
        onOpenChange={(open) => !open && setEditLead(null)}
      />

      <ConvertLeadDialog
        lead={convertLead}
        open={!!convertLead}
        onOpenChange={(open) => !open && setConvertLead(null)}
      />
    </div>
  );
}
