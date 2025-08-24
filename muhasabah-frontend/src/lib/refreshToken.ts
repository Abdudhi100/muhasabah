// lib/refreshTokens.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const API_BASE_URL = "http://127.0.0.1:8000/api/";
const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

/**
 * Create a reusable Axios instance.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor: attach access token to each request if available.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access = Cookies.get(ACCESS_KEY);
    if (access && config.headers) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Helper: Refresh the access token using the stored refresh token.
 */
async function refreshAccessToken(): Promise<string> {
  const refresh = Cookies.get(REFRESH_KEY);
  if (!refresh) throw new Error("No refresh token available");

  const res = await axios.post(`${API_BASE_URL}accounts/token/refresh/`, { refresh });
  const newAccess = res.data.access;

  Cookies.set(ACCESS_KEY, newAccess, {
    expires: 0.01, // ~15 minutes
    secure: true,
    sameSite: "Lax",
  });

  return newAccess;
}

/**
 * Response interceptor: auto-refresh token on 401 and retry the request.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        Cookies.remove(ACCESS_KEY);
        Cookies.remove(REFRESH_KEY);
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
