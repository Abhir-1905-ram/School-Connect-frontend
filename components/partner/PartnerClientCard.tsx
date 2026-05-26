"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePaymentStatus } from "@/lib/api/clients";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { IndianCurrency } from "@/components/ui/IndianCurrency";
import { Button } from "@/components/ui/button";
import { formatClientDate } from "@/components/clients/client-utils";
import type { Client, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PartnerClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

export function PartnerClientCard({ client, onEdit }: PartnerClientCardProps) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PaymentStatus | null>(null);

  const isPaid = client.paymentStatus === "paid";

  const mutation = useMutation({
    mutationFn: (status: PaymentStatus) =>
      updatePaymentStatus(client._id, {
        paymentStatus: status,
        ...(status === "paid" ? { amountPaid: client.dealValue } : { amountPaid: 0 }),
      }),
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: ["partner-clients"] });
      await queryClient.cancelQueries({ queryKey: ["clients"] });

      const patch = {
        paymentStatus: status,
        amountPaid: status === "paid" ? client.dealValue : 0,
      };

      const previous = queryClient.getQueriesData({
        queryKey: ["partner-clients"],
      });

      queryClient.setQueriesData(
        { queryKey: ["partner-clients"] },
        (old: { clients?: Client[]; pagination?: unknown } | undefined) => {
          if (!old?.clients) return old;
          return {
            ...old,
            clients: old.clients.map((c) =>
              c._id === client._id ? { ...c, ...patch } : c
            ),
          };
        }
      );

      queryClient.setQueriesData(
        { queryKey: ["clients"] },
        (old: { clients?: Client[]; pagination?: unknown } | undefined) => {
          if (!old?.clients) return old;
          return {
            ...old,
            clients: old.clients.map((c) =>
              c._id === client._id ? { ...c, ...patch } : c
            ),
          };
        }
      );

      return { previous };
    },
    onSuccess: (_data, status) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["partner-clients"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(
        status === "paid"
          ? `${client.schoolName} marked as paid`
          : `${client.schoolName} marked as unpaid`
      );
      setConfirmOpen(false);
      setPendingStatus(null);
    },
    onError: (error: unknown, _status, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update payment status";
      toast.error(message);
    },
  });

  const handleToggleClick = () => {
    const next: PaymentStatus = isPaid ? "unpaid" : "paid";
    setPendingStatus(next);
    setConfirmOpen(true);
  };

  const confirmTitle = pendingStatus === "paid"
    ? `Mark ${client.schoolName} as Paid?`
    : `Mark ${client.schoolName} as Unpaid?`;

  const confirmDescription =
    pendingStatus === "paid"
      ? "This will mark the full deal value as received."
      : "This will reset the payment status to unpaid.";

  return (
    <>
      <article className="relative flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-brand/20 hover:shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-8 w-8 text-slate-400 hover:text-brand"
          onClick={() => onEdit(client)}
          aria-label="Edit client"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <div className="pr-10">
          <h3 className="text-xl font-bold text-navy-900">{client.schoolName}</h3>
          <div className="mt-2">
            <IndianCurrency
              amount={client.dealValue}
              size="lg"
              className="text-indigo-600"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Converted on {formatClientDate(client.convertedAt)}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            type="button"
            layout
            onClick={handleToggleClick}
            disabled={mutation.isPending}
            className={cn(
              "relative flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold tracking-wider shadow-md transition-shadow hover:shadow-lg",
              isPaid
                ? "bg-emerald-500 text-white shadow-emerald-200/60"
                : "bg-amber-500 text-white shadow-amber-200/60"
            )}
            whileTap={{ scale: 0.97 }}
          >
            <AnimatePresence mode="wait">
              {isPaid ? (
                <motion.span
                  key="paid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-6 w-6" />
                  PAID
                </motion.span>
              ) : (
                <motion.span
                  key="unpaid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-6 w-6" />
                  {client.paymentStatus === "partial" ? "PARTIAL" : "UNPAID"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setPendingStatus(null);
        }}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={pendingStatus === "paid" ? "Mark as Paid" : "Mark as Unpaid"}
        variant={pendingStatus === "paid" ? "success" : "warning"}
        isLoading={mutation.isPending}
        onConfirm={() => pendingStatus && mutation.mutate(pendingStatus)}
      />
    </>
  );
}
