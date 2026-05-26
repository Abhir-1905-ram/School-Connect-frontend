"use client";

import { MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  formatINRCurrency,
  formatClientDate,
  getAvatarColor,
  getClientPartner,
  getInitials,
  getPartnerName,
} from "./client-utils";
import type { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  onClick?: (client: Client) => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const partner = getClientPartner(client);
  const partnerName = partner ? getPartnerName(partner) : "—";
  const progress =
    client.dealValue > 0
      ? Math.min(100, Math.round((client.amountPaid / client.dealValue) * 100))
      : 0;

  const addressLine = [client.city, client.address].filter(Boolean).join(" · ");

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(client)}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(client)}
      className={cn(
        "sc-card flex flex-col overflow-hidden p-0",
        onClick && "cursor-pointer"
      )}
    >
      <div className="p-5 pb-0">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md",
              getAvatarColor(client.schoolName)
            )}
          >
            {getInitials(client.schoolName)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-navy-900">
              {client.schoolName}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              {partner && (
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                    getAvatarColor(partner._id)
                  )}
                >
                  {getInitials(partnerName)}
                </span>
              )}
              <span>
                via{" "}
                <span className="font-medium text-slate-700">{partnerName}</span>
              </span>
            </div>
          </div>
        </div>

        {addressLine && (
          <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
            <p className="line-clamp-2">{addressLine}</p>
          </div>
        )}
      </div>

      {/* Prominent deal value + payment status */}
      <div className="mt-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white px-5 py-4 ring-1 ring-inset ring-slate-100">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Deal value
            </p>
            <p className="stat-number mt-1 font-heading text-3xl font-bold leading-none text-indigo-700">
              ₹{formatINRCurrency(client.dealValue)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
            <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Payment
            </p>
            <PaymentStatusBadge status={client.paymentStatus} size="lg" />
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-slate-600">
            ₹{formatINRCurrency(client.amountPaid)} / ₹
            {formatINRCurrency(client.dealValue)}
          </span>
          <span className="font-semibold text-slate-700">{progress}%</span>
        </div>
        <Progress
          value={progress}
          className={cn(
            "h-2.5 rounded-full bg-slate-100",
            client.paymentStatus === "paid" &&
              "[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600",
            client.paymentStatus === "unpaid" &&
              "[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-600",
            client.paymentStatus === "partial" &&
              "[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-600"
          )}
        />

        <p className="mt-4 text-xs text-slate-400">
          Converted {formatClientDate(client.convertedAt)}
        </p>
      </div>
    </article>
  );
}
