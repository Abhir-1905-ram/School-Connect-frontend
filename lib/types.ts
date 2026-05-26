export type UserRole = "admin" | "partner";

export type LeadStatus =
  | "new"
  | "in_progress"
  | "negotiating"
  | "converted"
  | "lost";

export type PaymentStatus = "unpaid" | "paid" | "partial";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  partnerId?: string;
}

export interface Partner {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  partnerId: string;
  city: string;
  localArea: string;
  pincode: string;
  designation?: string;
  phone?: string;
  totalLeads: number;
  totalClients: number;
  totalRevenue: number;
  isActive: boolean;
  joinedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  _id: string;
  schoolName: string;
  description?: string;
  address: string;
  city: string;
  localArea?: string;
  pincode?: string;
  targetTitle: string;
  targetClasses: number[];
  dealValue: number;
  status: LeadStatus;
  partner: string | Partner;
  convertedAt?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  _id: string;
  lead: string | Lead;
  schoolName: string;
  address?: string;
  city?: string;
  partner: string | Partner;
  dealValue: number;
  targetClasses?: number[];
  targetTitle?: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  convertedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  client: string | Client;
  partner: string | Partner;
  amount: number;
  paymentDate: string;
  notes?: string;
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthLoginResponse {
  token: string;
  user: User;
  partnerId?: string;
}

export interface MeResponse {
  user: User;
  partner?: Partner;
}

export interface DashboardStats {
  totalPartners: number;
  totalLeads: number;
  totalClients: number;
  totalRevenue: number;
  leadsByCity: { city: string; count: number }[];
  partnerLeaderboard: {
    partner: { id: string; partnerId: string; name?: string; email?: string };
    leadCount: number;
    clientCount: number;
    revenue: number;
    rank: number;
  }[];
  recentActivity: {
    type: "lead" | "client" | "payment";
    description: string;
    timestamp: string;
  }[];
  monthlyLeadTrend: { month: string; count: number }[];
}

export interface PaymentStats {
  totalRevenue: number;
  totalOutstanding: number;
  monthlyCollections: { month: string; amount: number }[];
  revenueByPartner: {
    partnerId: string;
    partnerName: string;
    revenue: number;
  }[];
}

export interface PartnerStats {
  totalLeads: number;
  totalClients: number;
  totalRevenue: number;
  leadsByMonth: { month: string; count: number }[];
  conversionRate: number;
}
