import { api } from "@/lib/axios";
import type {
  ApiResponse,
  PaginationMeta,
  Partner,
  PartnerStats,
} from "@/lib/types";

export interface PartnersQuery {
  page?: number;
  limit?: number;
  city?: string;
  area?: string;
  sortBy?: "leads" | "clients" | "revenue" | "joinedAt";
  search?: string;
}

export interface CreatePartnerPayload {
  name: string;
  email: string;
  password?: string;
  city: string;
  localArea: string;
  pincode: string;
  designation?: string;
  phone?: string;
}

export interface UpdatePartnerPayload {
  city?: string;
  localArea?: string;
  pincode?: string;
  designation?: string;
  phone?: string;
  isActive?: boolean;
}

export async function getAllPartners(params?: PartnersQuery) {
  const { data } = await api.get<
    ApiResponse<{ partners: Partner[]; pagination: PaginationMeta }>
  >("/partners", { params });
  return data.data;
}

export async function getPartnersCount(
  params?: Omit<PartnersQuery, "page" | "limit">
): Promise<number> {
  const { pagination } = await getAllPartners({ ...params, page: 1, limit: 1 });
  return pagination.total;
}

export async function getPartner(id: string) {
  const { data } = await api.get<
    ApiResponse<{ partner: Partner; leadCount: number; clientCount: number }>
  >(`/partners/${id}`);
  return data.data;
}

export async function createPartner(payload: CreatePartnerPayload) {
  const { data } = await api.post<ApiResponse<{ partner: Partner }>>(
    "/partners",
    payload
  );
  return data.data;
}

export async function updatePartner(id: string, payload: UpdatePartnerPayload) {
  const { data } = await api.put<ApiResponse<{ partner: Partner }>>(
    `/partners/${id}`,
    payload
  );
  return data.data;
}

export async function getPartnerStats(id: string) {
  const { data } = await api.get<ApiResponse<PartnerStats>>(
    `/partners/${id}/stats`
  );
  return data.data;
}
