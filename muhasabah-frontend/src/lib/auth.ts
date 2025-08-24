// lib/auth.ts
import Cookies from "js-cookie";

// ====================
// Cookie Keys
// ====================
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// ====================
// Default Cookie Options
// ====================
const defaultOptions: Cookies.CookieAttributes = {
  secure: process.env.NODE_ENV === "production", // only secure in prod
  sameSite: "Lax", // CSRF protection
  path: "/",       // important for remove() consistency
};

// ====================
// Token Management
// ====================

export function setTokens(access: string, refresh: string, remember: boolean) {
  const options: Cookies.CookieAttributes = remember
    ? { ...defaultOptions, expires: 7 } // 7 days
    : defaultOptions;                   // session cookie

  Cookies.set(ACCESS_TOKEN_KEY, access, options);
  Cookies.set(REFRESH_TOKEN_KEY, refresh, options);
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/accounts/token/refresh/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    if (data.access) {
      Cookies.set(ACCESS_TOKEN_KEY, data.access, defaultOptions);
      return data.access;
    }
    return null;
  } catch (err) {
    console.error("Token refresh failed:", err);
    clearTokens();
    return null;
  }
}


