// lib/api.ts
import axios from "axios";
import {
  SittingHeadData,
  OverallHeadTabData,
  MemberData,
  Sitting,
} from "@/types/dashboard";

import { Todo, TodoPayload } from "@/types/todo";

import { Profile, Notifications } from "@/types/user";
import { MenuItem } from "@/types/sidebar";
import { Checkin, CheckinPayload } from "@/types/checkin";
// ====================
// AXIOS CLIENT
// ====================
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Add Authorization header automatically
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ====================
// TYPES
// ====================
export interface DashboardSummaryResponse {
  sitting_head_data?: SittingHeadData;
  overall_head_data?: {
    total_sittings: number;
    average_progress: number;
    top_sittings: Array<{ id: number; name?: string; title?: string; progress?: number }>;
    bottom_sittings: Array<{ id: number; name?: string; title?: string; progress?: number }>;
  };
  member_data?: MemberData;
}



// ====================
// DASHBOARD API
// ====================
export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const res = await apiClient.get<DashboardSummaryResponse>("/dashboard/summary/");
  return res.data;
};

export const getOverallHeadSummary = async (): Promise<OverallHeadTabData> => {
  const res = await apiClient.get<{ overall_head_data?: DashboardSummaryResponse["overall_head_data"] }>(
    "/dashboard/summary/"
  );

  const raw = res.data.overall_head_data;
  if (!raw) {
    throw new Error("Overall head data missing from response");
  }

  return {
    total_sittings: raw.total_sittings,
    average_progress: raw.average_progress,
    top_sittings: raw.top_sittings.map<Sitting>((s) => ({
      id: s.id,
      name: s.name ?? s.title ?? "Untitled",
      progress: s.progress ?? 0,
    })),
    bottom_sittings: raw.bottom_sittings.map<Sitting>((s) => ({
      id: s.id,
      name: s.name ?? s.title ?? "Untitled",
      progress: s.progress ?? 0,
    })),
  };
};

// ====================
// AUTH
// ====================
export const loginUser = async (loginInput: string, password: string) => {
  const payload = {
    login: loginInput,
    email: loginInput.includes("@") ? loginInput : "",
    username: loginInput.includes("@") ? "" : loginInput,
    password,
  };
  const res = await apiClient.post("/accounts/cookie-token/", payload);
  return res.data;
};

export const registerUser = async (form: {
  email: string;
  username: string;
  password: string;
  role: string;
  location?: string;
  whatsapp?: string;
}) => {
  const res = await apiClient.post("/accounts/register/", form);
  return res.data;
};

export const logoutUser = async () => {
  const res = await apiClient.post("/accounts/logout/");
  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await apiClient.post("/accounts/token/refresh/");
  return res.data;
};

export const resendVerificationEmail = async (email: string) => {
  const res = await apiClient.post("/accounts/resend-verification/", { email });
  return res.data;
};

// ====================
// PASSWORD RESET
// ====================
export const requestPasswordReset = async (email: string) => {
  const res = await apiClient.post("/accounts/password-reset/", { email });
  return res.data;
};

export const confirmPasswordReset = async (
  uidb64: string,
  token: string,
  password: string
) => {
  const res = await apiClient.post(
    `/accounts/password-reset-confirm/${uidb64}/${token}/`,
    { password }
  );
  return res.data;
};

// ====================
// USER
// ====================
export const getProfile = async (): Promise<Profile> => {
  const res = await apiClient.get("/accounts/profile/");
  const data = res.data;
  return {
    id: data.id,
    username: data.username ?? data.name, // normalize
    role: data.role,
  };
};

export const getPermissions = async () => {
  const res = await apiClient.get("/accounts/permissions/");
  return res.data;
};

export const getUsers = async () => {
  const res = await apiClient.get("/accounts/");
  return res.data;
};

// ====================
// MENU
// ====================
export const getMenu = async (): Promise<MenuItem[]> => {
  const res = await apiClient.get("/accounts/menu/");
  return res.data;
};

// ====================
// NOTIFICATIONS
// ====================
export interface NotificationResponse {
  id: number;
  message: string;
  is_read?: boolean;
  read?: boolean; // API may send this instead
}

export interface NotificationsResponse {
  unread_count: number;
  notifications: NotificationResponse[];
}

export const getNotifications = async (): Promise<Notifications> => {
  const res = await apiClient.get<NotificationsResponse>("/notifications/");
  const data = res.data;

  return {
    unread_count: data.unread_count,
    notifications: data.notifications.map((n) => ({
      id: n.id,
      message: n.message,
      is_read: n.is_read ?? n.read ?? false, // normalize
    })),
  };
};

// ====================
// SITTINGS
// ====================
const SITTINGS_BASE = "/sittings/sittings/";

export const getSittings = async () => {
  const res = await apiClient.get(SITTINGS_BASE);
  return res.data;
};

export const getSitting = async (id: number) => {
  const res = await apiClient.get(`${SITTINGS_BASE}${id}/`);
  return res.data;
};

export interface SittingPayload {
  name: string;
  location?: string;
  sitting_head?: number | string;
  day_of_week?: string;
  max_members?: number;
  status?: string;
}

export const createSitting = async (payload: SittingPayload) => {
  const res = await apiClient.post(SITTINGS_BASE, payload);
  return res.data;
};

export const updateSitting = async (
  id: number,
  payload: Partial<SittingPayload>
) => {
  const res = await apiClient.patch<SittingPayload>(`${SITTINGS_BASE}${id}/`, payload);
  return res.data;
};

export const deleteSitting = async (id: number) => {
  const res = await apiClient.delete(`${SITTINGS_BASE}${id}/`);
  return res.status === 204 || res.status === 200;
};

// ====================
// TODOS
// ====================
const TODOS_BASE = "/todos/todos/";



export async function getTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  return res.json();
}

export const createTodo = async (payload: TodoPayload) => {
  const res = await apiClient.post(TODOS_BASE, payload);
  return res.data;
};

export async function updateTodo(id: number, data: Partial<TodoPayload>): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export const deleteTodo = async (id: number) => {
  const res = await apiClient.delete(`${TODOS_BASE}${id}/`);
  return res.status === 204 || res.status === 200;
};

// ====================
// CHECKINS
// ====================
const CHECKINS_BASE = "/checkins/checkins/";


export const getCheckins = async () => {
  const res = await apiClient.get(CHECKINS_BASE);
  return res.data;
};

export const createCheckin = async (payload: CheckinPayload): Promise<Checkin> => {
  const { data } = await axios.post("/checkins", payload);
  return data;
};

export const updateCheckin = async (id: number, payload: CheckinPayload): Promise<Checkin> => {
  const { data } = await axios.put(`/checkins/${id}`, payload);
  return data;
};

export const deleteCheckin = async (id: number) => {
  const res = await apiClient.delete(`${CHECKINS_BASE}${id}/`);
  return res.status === 204 || res.status === 200;
};

// ====================
// SWOT
// ====================
export const getSWOT = async () => {
  const res = await apiClient.get("/swot/swot/");
  return res.data[0]; // one SWOT per user
};

export const createSWOT = async (data: {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}) => {
  const res = await apiClient.post("/swot/swot/", data);
  return res.data;
};

export const updateSWOT = async (
  id: number,
  data: {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  }
) => {
  const res = await apiClient.put(`/swot/swot/${id}/`, data);
  return res.data;
};

export default apiClient;
