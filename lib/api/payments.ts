import { api } from "@/lib/axios";
import type { ApiResponse, PaginationMeta, Payment, PaymentStats } from "@/lib/types";

export interface PaymentsQuery {
  page?: number;
  limit?: number;
  partnerId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface RecordPaymentPayload {
  clientId: string;
  amount: number;
  paymentDate?: string;
  notes?: string;
}

export async function getAllPayments(params?: PaymentsQuery) {
  const { data } = await api.get<
    ApiResponse<{ payments: Payment[]; pagination: PaginationMeta }>
  >("/payments", { params });
  return data.data;
}

export async function recordPayment(payload: RecordPaymentPayload) {
  const { data } = await api.post<
    ApiResponse<{ payment: Payment; client: unknown }>
  >("/payments", payload);
  return data.data;
}

export async function getPaymentStats() {
  const { data } = await api.get<ApiResponse<PaymentStats>>("/payments/stats");
  return data.data;
}
