import type { Client, Partner, PaymentStatus } from "@/lib/types";
import { getPartnerName, getAvatarColor, getInitials } from "@/components/partners/partner-utils";
import { formatINRCurrency } from "@/lib/dashboard-utils";
import dayjs from "dayjs";

export { formatINRCurrency, getAvatarColor, getInitials, getPartnerName };

export function getClientPartner(client: Client): Partner | null {
  if (typeof client.partner === "object" && client.partner !== null) {
    return client.partner as Partner;
  }
  return null;
}

export function getClientBalance(client: Client): number {
  return Math.max(0, client.dealValue - client.amountPaid);
}

export function formatClientDate(date: string): string {
  return dayjs(date).format("DD MMM YYYY");
}

export const PAYMENT_STATUS_OPTIONS: {
  value: PaymentStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "partial", label: "Partial" },
];
