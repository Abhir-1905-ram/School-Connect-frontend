"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllLeads } from "@/lib/api/leads";
import { getAllPartners } from "@/lib/api/partners";
import { exportLeadsCsv } from "@/lib/api/admin";
import { downloadBlob } from "@/lib/download";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination, DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";
import { LeadsFilterBar } from "@/components/leads/LeadsFilterBar";
import { LeadsSummaryBar } from "@/components/leads/LeadsSummaryBar";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadDetailDrawer } from "@/components/leads/LeadDetailDrawer";
import { EditLeadModal } from "@/components/leads/EditLeadModal";
import { ConvertLeadDialog } from "@/components/leads/ConvertLeadDialog";
import { ListPagination } from "@/components/ui/ListPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPartnerName } from "@/components/partners/partner-utils";
import type { Lead, LeadStatus } from "@/lib/types";

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [city, setCity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exporting, setExporting] = useState(false);

  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const { page, setPage, limit, resetPage } = usePagination(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, partnerId, status, city, fromDate, toDate, resetPage]);

  const { data: partnersData } = useQuery({
    queryKey: ["partners-list"],
    queryFn: () => getAllPartners({ limit: 100, page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const partners = partnersData?.partners ?? [];

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "leads",
      page,
      limit,
      debouncedSearch,
      partnerId,
      status,
      city,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      getAllLeads({
        search: debouncedSearch || undefined,
        partnerId: partnerId || undefined,
        status: status === "all" ? undefined : status,
        city: city || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        limit,
        page,
      }),
  });

  const leads = data?.leads ?? [];
  const pagination = data?.pagination;

  const totalDealValue = useMemo(
    () => leads.reduce((sum, l) => sum + l.dealValue, 0),
    [leads]
  );

  const partnerLabel = useMemo(() => {
    if (!partnerId) return null;
    const p = partners.find((x) => x._id === partnerId);
    return p ? getPartnerName(p) : null;
  }, [partnerId, partners]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportLeadsCsv();
      downloadBlob(blob, `school-connect-leads-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("Leads export downloaded");
    } catch {
      toast.error("Failed to export leads");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="mb-2">
        <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
          Leads
        </h1>
        <p className="mt-1 text-slate-500">
          Track and manage school leads across all partners
        </p>
      </div>

      <LeadsFilterBar
        search={search}
        onSearchChange={setSearch}
        partnerId={partnerId}
        onPartnerChange={setPartnerId}
        partners={partners}
        status={status}
        onStatusChange={setStatus}
        city={city}
        onCityChange={setCity}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        onExportCsv={handleExport}
        exportDisabled={exporting}
      />

      {!isLoading && !isError && leads.length > 0 && (
        <LeadsSummaryBar
          count={pagination?.total ?? leads.length}
          partnerLabel={partnerLabel}
          totalDealValue={totalDealValue}
        />
      )}

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-rose-700">
          Failed to load leads. Please try again.
        </div>
      )}

      {!isLoading && !isError && leads.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
          No leads match your filters
        </div>
      )}

      {!isLoading && !isError && leads.length > 0 && (
        <>
          <LeadsTable
            leads={leads}
            rowOffset={(page - 1) * limit}
            onView={setDetailLead}
            onEdit={setEditLead}
            onConvert={setConvertLead}
          />
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
