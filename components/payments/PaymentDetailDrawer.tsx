"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllPayments } from "@/lib/api/payments";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "@/components/clients/PaymentStatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  formatINRCurrency,
  formatClientDate,
  getClientBalance,
  getClientPartner,
  getPartnerName,
} from "@/components/clients/client-utils";
import { formatPaymentDate } from "./payment-utils";
import type { Client, Payment } from "@/lib/types";

interface PaymentDetailDrawerProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailDrawer({
  client,
  open,
  onOpenChange,
}: PaymentDetailDrawerProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["payments", "client", client?._id],
    queryFn: async () => {
      const result = await getAllPayments({ limit: 200, page: 1 });
      return result.payments.filter((p) => {
        const id =
          typeof p.client === "object"
            ? (p.client as Client)._id
            : String(p.client);
        return id === client!._id;
      });
    },
    enabled: !!client?._id && open,
  });

  if (!client) return null;

  const partner = getClientPartner(client);
  const balance = getClientBalance(client);
  const progress =
    client.dealValue > 0
      ? Math.min(100, Math.round((client.amountPaid / client.dealValue) * 100))
      : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[480px]">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading">Payment Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy-900">
              {client.schoolName}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Partner: {partner ? getPartnerName(partner) : "—"}
            </p>
            <div className="mt-2">
              <PaymentStatusBadge status={client.paymentStatus} size="lg" />
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Deal value</span>
              <span className="font-semibold">
                ₹{formatINRCurrency(client.dealValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount paid</span>
              <span className="font-semibold text-emerald-600">
                ₹{formatINRCurrency(client.amountPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Balance</span>
              <span className="font-semibold text-amber-600">
                ₹{formatINRCurrency(balance)}
              </span>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-semibold text-navy-900">
              Payment History
            </h3>
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <p className="text-sm text-slate-500">No payments recorded yet</p>
            )}
            <ul className="space-y-2">
              {data?.map((payment: Payment) => (
                <li
                  key={payment._id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                >
                  <div>
                    <p className="font-medium text-navy-900">
                      ₹{formatINRCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatPaymentDate(payment.paymentDate)}
                    </p>
                  </div>
                  {payment.notes && (
                    <p className="max-w-[140px] truncate text-xs text-slate-400">
                      {payment.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-400">
            Client since {formatClientDate(client.convertedAt)}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
