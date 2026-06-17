import { clearSession, getToken } from "./auth";
import type {
  AuthResponse,
  CheckoutSession,
  CreateExpenseRequest,
  Expense,
  ExpenseReport,
  LoginRequest,
  Notification,
  Plan,
  PlanCode,
  RegisterRequest,
  ReportPeriod,
  Subscription,
  VerifyPaymentRequest,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

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
      "Cannot reach the API. Start the backend: cd ExpenseManagementSystem && docker compose up (gateway on :8081)",
      0
    );
  });

  if (response.status === 401 && auth) {
    clearSession();
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    let message = body;
    try {
      const json = JSON.parse(body) as { detail?: string; message?: string };
      message = json.detail ?? json.message ?? body;
    } catch {
      // plain text error body
    }
    if (!message) {
      if (response.status === 401) message = "Invalid email or password";
      else if (response.status === 403) message = "Access denied. Try Google sign-in or create a new account.";
      else if (response.status === 409) message = "Email already registered";
      else message = `Request failed (${response.status})`;
    }
    throw new ApiError(message, response.status);
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

  listPlans: () => request<Plan[]>("/api/billing/plans", {}, false),

  getSubscription: () => request<Subscription>("/api/billing/subscription"),

  getSubscriptionStatus: () =>
    request<{ subscribed: boolean; subscription: Subscription }>("/api/billing/subscription/status"),

  createCheckout: (planCode: PlanCode) =>
    request<CheckoutSession>("/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ planCode }),
    }),

  verifyPayment: (body: VerifyPaymentRequest) =>
    request<Subscription>("/api/billing/verify", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
