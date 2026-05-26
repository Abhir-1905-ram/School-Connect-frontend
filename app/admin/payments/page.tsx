"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Download, Plus } from "lucide-react";
import { getAllClients, updatePaymentStatus } from "@/lib/api/clients";
import { getAllPayments, getPaymentStats } from "@/lib/api/payments";
import { exportPaymentsCsv } from "@/lib/api/admin";
import { downloadBlob } from "@/lib/download";
import { usePagination, DEFAULT_PAGE_SIZE } from "@/hooks/usePagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListPagination } from "@/components/ui/ListPagination";
import { PaymentMetricsRow } from "@/components/payments/PaymentMetricsRow";
import { RevenueByPartnerChart } from "@/components/payments/RevenueByPartnerChart";
import { MonthlyCollectionsChart } from "@/components/payments/MonthlyCollectionsChart";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { RecordPaymentModal } from "@/components/payments/RecordPaymentModal";
import { PaymentDetailDrawer } from "@/components/payments/PaymentDetailDrawer";
import {
  buildLastPaymentMap,
  getThisMonthCollections,
} from "@/components/payments/payment-utils";
import { useAuth } from "@/context/AuthContext";
import type { Client } from "@/lib/types";

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [recordOpen, setRecordOpen] = useState(false);
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const { page, setPage, limit } = usePagination(DEFAULT_PAGE_SIZE);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: getPaymentStats,
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", "payments-page", page, limit],
    queryFn: () => getAllClients({ limit, page }),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["payments", "list"],
    queryFn: () => getAllPayments({ limit: 100, page: 1 }),
  });

  const clients = clientsData?.clients ?? [];
  const pagination = clientsData?.pagination;
  const lastPaymentMap = useMemo(
    () => buildLastPaymentMap(paymentsData?.payments ?? []),
    [paymentsData]
  );

  const markPaidMutation = useMutation({
    mutationFn: (client: Client) =>
      updatePaymentStatus(client._id, {
        paymentStatus: "paid",
        amountPaid: client.dealValue,
      }),
    onMutate: async (client) => {
      await queryClient.cancelQueries({
        queryKey: ["clients", "payments-page"],
      });
      const previous = queryClient.getQueryData([
        "clients",
        "payments-page",
        page,
        limit,
      ]);
      queryClient.setQueryData(
        ["clients", "payments-page", page, limit],
        (old: { clients?: Client[]; pagination?: unknown } | undefined) => {
          if (!old?.clients) return old;
          return {
            ...old,
            clients: old.clients.map((c) =>
              c._id === client._id
                ? {
                    ...c,
                    paymentStatus: "paid" as const,
                    amountPaid: client.dealValue,
                  }
                : c
            ),
          };
        }
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Marked as paid");
    },
    onError: (_e, _c, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["clients", "payments-page", page, limit],
          context.previous
        );
      }
      toast.error("Failed to update status");
    },
    onSettled: () => setMarkingId(null),
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportPaymentsCsv();
      downloadBlob(
        blob,
        `school-connect-payments-${new Date().toISOString().slice(0, 10)}.csv`
      );
      toast.success("Payments export downloaded");
    } catch {
      toast.error("Failed to export payments");
    } finally {
      setExporting(false);
    }
  };

  const thisMonth = stats
    ? getThisMonthCollections(stats.monthlyCollections)
    : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 shadow-lg shadow-emerald-500/25 md:p-8">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-teal-400/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">
              Payments
            </h1>
            <p className="mt-2 max-w-xl text-emerald-50/90">
              Welcome back, {user?.name ?? "Admin"} — track revenue collections,
              outstanding balances, and client payment records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => setRecordOpen(true)}
              className="bg-white text-emerald-700 shadow-md hover:bg-emerald-50"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>
      </section>

      {statsLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
      )}

      {stats && !statsLoading && (
        <PaymentMetricsRow
          totalRevenue={stats.totalRevenue}
          totalOutstanding={stats.totalOutstanding}
          thisMonth={thisMonth}
        />
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy-900">
            Revenue by Partner
          </h2>
          <p className="mb-4 text-sm text-slate-500">Total collections per partner</p>
          {statsLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <RevenueByPartnerChart data={stats?.revenueByPartner ?? []} />
          )}
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy-900">
            Monthly Collections
          </h2>
          <p className="mb-4 text-sm text-slate-500">Last 12 months trend</p>
          {statsLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <MonthlyCollectionsChart data={stats?.monthlyCollections ?? []} />
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold text-navy-900">
          Client Payments
        </h2>
        {clientsLoading && <Skeleton className="h-[400px] w-full rounded-xl" />}
        {!clientsLoading && clients.length === 0 && (
          <div className="rounded-xl border border-dashed py-12 text-center text-slate-500">
            No clients yet
          </div>
        )}
        {!clientsLoading && clients.length > 0 && (
          <>
            <PaymentsTable
              clients={clients}
              lastPaymentByClient={lastPaymentMap}
              onMarkPaid={(client) => {
                setMarkingId(client._id);
                markPaidMutation.mutate(client);
              }}
              onViewDetail={setDetailClient}
              markingId={markingId}
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
      </section>

      <RecordPaymentModal
        open={recordOpen}
        onOpenChange={setRecordOpen}
        clients={clients}
      />

      <PaymentDetailDrawer
        client={detailClient}
        open={!!detailClient}
        onOpenChange={(open) => !open && setDetailClient(null)}
      />
    </div>
  );
}
