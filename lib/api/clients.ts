import { api } from "@/lib/axios";
import type {
  ApiResponse,
  Client,
  PaginationMeta,
  PaymentStatus,
} from "@/lib/types";

export interface ClientsQuery {
  page?: number;
  limit?: number;
  partnerId?: string;
  paymentStatus?: PaymentStatus;
  city?: string;
  search?: string;
}

export interface UpdateClientPayload {
  schoolName?: string;
  address?: string;
  city?: string;
  targetClasses?: number[];
  targetTitle?: string;
  dealValue?: number;
  notes?: string;
}

export interface UpdatePaymentStatusPayload {
  paymentStatus: PaymentStatus;
  amountPaid?: number;
}

export async function getAllClients(params?: ClientsQuery) {
  const { data } = await api.get<
    ApiResponse<{ clients: Client[]; pagination: PaginationMeta }>
  >("/clients", { params });
  return data.data;
}

export async function getClientsCount(
  params?: Omit<ClientsQuery, "page" | "limit">
): Promise<number> {
  const { pagination } = await getAllClients({ ...params, page: 1, limit: 1 });
  return pagination.total;
}

export async function getClient(id: string) {
  const { data } = await api.get<ApiResponse<{ client: Client }>>(
    `/clients/${id}`
  );
  return data.data;
}

export async function updateClient(id: string, payload: UpdateClientPayload) {
  const { data } = await api.put<ApiResponse<{ client: Client }>>(
    `/clients/${id}`,
    payload
  );
  return data.data;
}

export async function updatePaymentStatus(
  id: string,
  payload: UpdatePaymentStatusPayload
) {
  const { data } = await api.put<ApiResponse<{ client: Client }>>(
    `/clients/${id}/payment-status`,
    payload
  );
  return data.data;
}
