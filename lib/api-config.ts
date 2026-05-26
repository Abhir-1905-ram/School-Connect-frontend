/** Railway production API (used when NEXT_PUBLIC_API_URL is missing on Vercel). */
export const PRODUCTION_API_URL =
  "https://school-connect-backend-production.up.railway.app/api/v1";

const LOCAL_API_URL = "http://localhost:5000/api/v1";

/**
 * NEXT_PUBLIC_* vars are baked in at build time. If Vercel omits them, avoid
 * defaulting to localhost in production (browsers block loopback from HTTPS sites).
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
}

export const API_BASE_URL = getApiBaseUrl();
