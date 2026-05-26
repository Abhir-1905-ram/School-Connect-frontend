import type { UserRole } from "@/lib/types";

export const TOKEN_COOKIE = "sc_token";
export const ROLE_COOKIE = "sc_role";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setAuthCookies(token: string, role: UserRole) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}
