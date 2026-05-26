import { api } from "@/lib/axios";

export async function exportLeadsCsv(): Promise<Blob> {
  const { data } = await api.get<Blob>("/admin/export/leads", {
    responseType: "blob",
  });
  return data;
}

export async function exportPaymentsCsv(): Promise<Blob> {
  const { data } = await api.get<Blob>("/admin/export/payments", {
    responseType: "blob",
  });
  return data;
}
