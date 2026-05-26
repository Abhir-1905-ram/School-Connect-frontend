import { api } from "@/lib/axios";
import type {
  ApiResponse,
  AuthLoginResponse,
  MeResponse,
  User,
  UserRole,
} from "@/lib/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  city?: string;
  localArea?: string;
  pincode?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<AuthLoginResponse>>(
    "/auth/login",
    payload
  );
  return data.data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<ApiResponse<AuthLoginResponse>>(
    "/auth/register",
    payload
  );
  return data.data;
}

export async function getMe() {
  const { data } = await api.get<ApiResponse<MeResponse>>("/auth/me");
  return data.data;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await api.put<ApiResponse<null>>(
    "/auth/change-password",
    payload
  );
  return data;
}

export type { User };
