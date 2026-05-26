import { api } from "@/lib/axios";
import type {
  ApiResponse,
  Lead,
  LeadStatus,
  PaginationMeta,
} from "@/lib/types";

export interface LeadsQuery {
  page?: number;
  limit?: number;
  partnerId?: string;
  status?: LeadStatus;
  city?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface CreateLeadPayload {
  schoolName: string;
  description?: string;
  address: string;
  city: string;
  localArea?: string;
  pincode?: string;
  targetTitle: string;
  targetClasses: number[];
  dealValue: number;
  notes?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {
  status?: LeadStatus;
}

export async function getAllLeads(params?: LeadsQuery) {
  const { data } = await api.get<
    ApiResponse<{ leads: Lead[]; pagination: PaginationMeta }>
  >("/leads", { params });
  return data.data;
}

export async function getLeadsCount(
  params?: Omit<LeadsQuery, "page" | "limit">
): Promise<number> {
  const { pagination } = await getAllLeads({ ...params, page: 1, limit: 1 });
  return pagination.total;
}

export async function getLead(id: string) {
  const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
  return data.data;
}

export async function createLead(payload: CreateLeadPayload) {
  const { data } = await api.post<ApiResponse<{ lead: Lead }>>("/leads", payload);
  return data.data;
}

export async function updateLead(id: string, payload: UpdateLeadPayload) {
  const { data } = await api.put<ApiResponse<{ lead: Lead }>>(
    `/leads/${id}`,
    payload
  );
  return data.data;
}

export async function convertLeadToClient(id: string) {
  const { data } = await api.put<ApiResponse<{ lead: Lead }>>(
    `/leads/${id}/convert`
  );
  return data.data;
}

export async function deleteLead(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/leads/${id}`);
  return data;
}
