import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearAuthCookies, TOKEN_COOKIE } from "@/lib/auth-cookies";

const TOKEN_KEY = TOKEN_COOKIE;

interface RequestConfigWithMeta extends InternalAxiosRequestConfig {
  metadata?: { startTime: number };
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: RequestConfigWithMeta) => {
  config.metadata = { startTime: Date.now() };
  config.signal = AbortSignal.timeout(15000);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      const config = response.config as RequestConfigWithMeta;
      const start = config.metadata?.startTime;
      if (start) {
        const ms = Date.now() - start;
        console.debug(
          `[API] ${config.method?.toUpperCase()} ${config.url} — ${ms}ms`
        );
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("sc_user");
      clearAuthCookies();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
