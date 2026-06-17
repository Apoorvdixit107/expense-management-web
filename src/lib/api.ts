import { clearSession, getToken } from "./auth";
import type {
  AuthResponse,
  CreateExpenseRequest,
  Expense,
  ExpenseReport,
  LoginRequest,
  Notification,
  RegisterRequest,
  ReportPeriod,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers }).catch(() => {
    throw new ApiError(
      "Cannot reach the API. Start the backend: cd ExpenseManagementSystem && docker compose up",
      0
    );
  });

  if (response.status === 401 && auth) {
    clearSession();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new ApiError(message || "Request failed", response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  register: (body: RegisterRequest) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }, false),

  login: (body: LoginRequest) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }, false),

  googleLogin: (idToken: string) =>
    request<AuthResponse>("/api/auth/google", { method: "POST", body: JSON.stringify({ idToken }) }, false),

  listExpenses: () => request<Expense[]>("/api/expenses"),

  createExpense: (body: CreateExpenseRequest) =>
    request<Expense>("/api/expenses", { method: "POST", body: JSON.stringify(body) }),

  deleteExpense: (id: number) => request<void>(`/api/expenses/${id}`, { method: "DELETE" }),

  listNotifications: () => request<Notification[]>("/api/notifications"),

  unreadCount: () => request<{ count: number }>("/api/notifications/unread-count"),

  markNotificationRead: (id: number) =>
    request<{ status: string }>(`/api/notifications/${id}/read`, { method: "PATCH" }),

  reportSummary: (period: ReportPeriod, year?: number, month?: number) => {
    const params = new URLSearchParams({ period });
    if (year !== undefined) params.set("year", String(year));
    if (month !== undefined) params.set("month", String(month));
    return request<ExpenseReport>(`/api/reports/summary?${params}`);
  },

  reportMonthly: (year: number) => request<ExpenseReport>(`/api/reports/monthly?year=${year}`),

  reportYearly: (years = 5) => request<ExpenseReport>(`/api/reports/yearly?years=${years}`),
};
