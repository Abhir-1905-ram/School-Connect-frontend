"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "@/components/clients/PaymentStatusBadge";
import {
  formatINRCurrency,
  getClientBalance,
  getClientPartner,
  getPartnerName,
} from "@/components/clients/client-utils";
import { formatPaymentDate } from "./payment-utils";
import type { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentsTableProps {
  clients: Client[];
  lastPaymentByClient: Map<string, string>;
  onMarkPaid: (client: Client) => void;
  onViewDetail: (client: Client) => void;
  markingId?: string | null;
}

const amountCellClass =
  "text-right font-mono text-sm tabular-nums tracking-tight text-navy-900";

export function PaymentsTable({
  clients,
  lastPaymentByClient,
  onMarkPaid,
  onViewDetail,
  markingId,
}: PaymentsTableProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="min-w-[720px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="sticky left-0 z-10 min-w-[140px] bg-slate-50/80">
                School (Client)
              </TableHead>
              <TableHead>Partner</TableHead>
              <TableHead className="text-right">Deal Value</TableHead>
              <TableHead className="text-right">Amount Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const balance = getClientBalance(client);
              const partner = getClientPartner(client);
              const lastPayment = lastPaymentByClient.get(client._id);
              const isUnpaid = client.paymentStatus === "unpaid";
              const isPartial = client.paymentStatus === "partial";
              const isPaid = client.paymentStatus === "paid";
              const isMarking = markingId === client._id;

              return (
                <TableRow
                  key={client._id}
                  className={cn(
                    "border-l-2 transition-colors",
                    isPaid && "border-l-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/60",
                    isPartial &&
                      "border-l-amber-400 bg-amber-50/35 hover:bg-amber-50/55",
                    isUnpaid && "border-l-rose-400 bg-rose-50/25 hover:bg-rose-50/45",
                    isMarking && "opacity-70"
                  )}
                >
                  <TableCell
                    className={cn(
                      "sticky left-0 z-10 bg-white font-medium text-navy-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]",
                      isPaid && "bg-emerald-50/40",
                      isPartial && "bg-amber-50/35",
                      isUnpaid && "bg-rose-50/25"
                    )}
                  >
                    {client.schoolName}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {partner ? getPartnerName(partner) : "—"}
                  </TableCell>
                  <TableCell className={amountCellClass}>
                    ₹{formatINRCurrency(client.dealValue)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      amountCellClass,
                      isPaid && "text-emerald-700",
                      isPartial && "text-amber-700"
                    )}
                  >
                    ₹{formatINRCurrency(client.amountPaid)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      amountCellClass,
                      "font-semibold",
                      balance > 0 ? "text-rose-600" : "text-emerald-600"
                    )}
                  >
                    ₹{formatINRCurrency(balance)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={client.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {lastPayment ? formatPaymentDate(lastPayment) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isUnpaid && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-emerald-200 font-medium text-emerald-700 hover:bg-emerald-50"
                          disabled={isMarking}
                          onClick={() => onMarkPaid(client)}
                        >
                          {isMarking ? "Updating…" : "Mark as Paid"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-brand"
                        onClick={() => onViewDetail(client)}
                        aria-label="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
