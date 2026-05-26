import type { Client, Payment } from "@/lib/types";
import { getPartnerName } from "@/components/partners/partner-utils";
import { formatINRCurrency } from "@/lib/dashboard-utils";
import dayjs from "dayjs";

export { formatINRCurrency };

export function getPaymentClientName(payment: Payment): string {
  if (typeof payment.client === "object" && payment.client !== null) {
    return (payment.client as Client).schoolName ?? "—";
  }
  return "—";
}

export function getPaymentPartnerName(payment: Payment): string {
  if (typeof payment.partner === "object" && payment.partner !== null) {
    return getPartnerName(payment.partner as Parameters<typeof getPartnerName>[0]);
  }
  return "—";
}

export function formatPaymentDate(date: string): string {
  return dayjs(date).format("DD MMM YYYY");
}

export function getThisMonthCollections(
  monthly: { month: string; amount: number }[]
): number {
  const padded = dayjs().format("YYYY-MM");
  const match = monthly.find((m) => m.month === padded);
  return match?.amount ?? 0;
}

export function getCollectionRate(
  totalRevenue: number,
  totalOutstanding: number
): number {
  const total = totalRevenue + totalOutstanding;
  if (total <= 0) return 0;
  return Math.round((totalRevenue / total) * 100);
}

export function buildLastPaymentMap(
  payments: Payment[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const p of payments) {
    const clientId =
      typeof p.client === "object"
        ? (p.client as Client)._id
        : String(p.client);
    const existing = map.get(clientId);
    const date = p.paymentDate;
    if (!existing || dayjs(date).isAfter(dayjs(existing))) {
      map.set(clientId, date);
    }
  }
  return map;
}
