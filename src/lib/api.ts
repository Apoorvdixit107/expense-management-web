import { clearSession, getToken } from "./auth";
import type {
  AuthResponse,
  BillingCompany,
  BillingDetails,
  CheckoutRequest,
  CheckoutSession,
  CreateExpenseRequest,
  Expense,
  ExpenseReport,
  Invoice,
  LoginRequest,
  Notification,
  NotificationPreferences,
  Plan,
  PlanCode,
  RegisterRequest,
  ReportPeriod,
  ReportSummaryOptions,
  Subscription,
  UpdateBillingDetailsRequest,
  UpdateProfileRequest,
  UserProfile,
  VerifyPaymentRequest,
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  ExpenseCategory,
  BankAccount,
  ConnectBankAccountRequest,
  ReferralProfile,
  OrganizationBalanceRange,
  OrganizationReport,
  OrganizationReportType,
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

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/pdf")) {
    return response.blob() as Promise<T>;
  }

  return response.json() as Promise<T>;
}

export const api = {
  register: (body: RegisterRequest) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }, false),

  login: (body: LoginRequest) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }, false),

  googleLogin: (idToken: string, referralCode?: string) =>
    request<AuthResponse>(
      "/api/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ idToken, referralCode: referralCode || undefined }),
      },
      false
    ),

  getReferralProfile: () => request<ReferralProfile>("/api/referrals/me"),

  getProfile: () => request<UserProfile>("/api/auth/profile"),

  updateProfile: (body: UpdateProfileRequest) =>
    request<UserProfile>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  listExpenses: (organizationId?: number) =>
    request<Expense[]>(
      organizationId ? `/api/expenses?organizationId=${organizationId}` : "/api/expenses"
    ),

  createExpense: (body: CreateExpenseRequest) =>
    request<Expense>("/api/expenses", { method: "POST", body: JSON.stringify(body) }),

  deleteExpense: (id: number) => request<void>(`/api/expenses/${id}`, { method: "DELETE" }),

  listOrganizations: () => request<Organization[]>("/api/organizations"),

  createOrganization: (body: CreateOrganizationRequest) =>
    request<Organization>("/api/organizations", { method: "POST", body: JSON.stringify(body) }),

  updateOrganization: (id: number, body: UpdateOrganizationRequest) =>
    request<Organization>(`/api/organizations/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  deleteOrganization: (id: number) =>
    request<void>(`/api/organizations/${id}`, { method: "DELETE" }),

  getOrganizationBalanceSummary: (organizationId: number, fromDate: string, toDate: string) => {
    const params = new URLSearchParams({ fromDate, toDate });
    return request<OrganizationBalanceRange>(
      `/api/organizations/${organizationId}/balance-summary?${params}`
    );
  },

  getOrganizationReport: (
    organizationId: number,
    type: OrganizationReportType,
    fromDate: string,
    toDate: string
  ) => {
    const params = new URLSearchParams({ type, fromDate, toDate });
    return request<OrganizationReport>(`/api/organizations/${organizationId}/reports?${params}`);
  },

  listCategories: (organizationId: number) =>
    request<ExpenseCategory[]>(`/api/organizations/${organizationId}/categories`),

  createCategory: (organizationId: number, name: string) =>
    request<ExpenseCategory>(`/api/organizations/${organizationId}/categories`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  deleteCategory: (organizationId: number, categoryId: number) =>
    request<void>(`/api/organizations/${organizationId}/categories/${categoryId}`, {
      method: "DELETE",
    }),

  listBankAccounts: (organizationId: number) =>
    request<BankAccount[]>(`/api/organizations/${organizationId}/bank-accounts`),

  connectBankAccount: (organizationId: number, body: ConnectBankAccountRequest) =>
    request<BankAccount>(`/api/organizations/${organizationId}/bank-accounts`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteBankAccount: (organizationId: number, bankAccountId: number) =>
    request<void>(`/api/organizations/${organizationId}/bank-accounts/${bankAccountId}`, {
      method: "DELETE",
    }),

  listNotifications: () => request<Notification[]>("/api/notifications"),

  unreadCount: () => request<{ count: number }>("/api/notifications/unread-count"),

  markNotificationRead: (id: number) =>
    request<{ status: string }>(`/api/notifications/${id}/read`, { method: "PATCH" }),

  reportSummary: (
    period: ReportPeriod,
    organizationId?: number,
    options?: ReportSummaryOptions
  ) => {
    const params = new URLSearchParams({ period });
    if (organizationId !== undefined) params.set("organizationId", String(organizationId));
    if (options?.year !== undefined) params.set("year", String(options.year));
    if (options?.month !== undefined) params.set("month", String(options.month));
    if (options?.fromDate) params.set("fromDate", options.fromDate);
    if (options?.toDate) params.set("toDate", options.toDate);
    return request<ExpenseReport>(`/api/reports/summary?${params}`);
  },

  reportMonthly: (year: number, organizationId?: number) => {
    const params = new URLSearchParams({ year: String(year) });
    if (organizationId !== undefined) params.set("organizationId", String(organizationId));
    return request<ExpenseReport>(`/api/reports/monthly?${params}`);
  },

  reportYearly: (years = 5, organizationId?: number) => {
    const params = new URLSearchParams({ years: String(years) });
    if (organizationId !== undefined) params.set("organizationId", String(organizationId));
    return request<ExpenseReport>(`/api/reports/yearly?${params}`);
  },

  listPlans: () => request<Plan[]>("/api/billing/plans", {}, false),

  getBillingCompany: () => request<BillingCompany>("/api/billing/company", {}, false),

  getBillingDetails: () => request<BillingDetails>("/api/billing/details"),

  updateBillingDetails: (body: UpdateBillingDetailsRequest) =>
    request<BillingDetails>("/api/billing/details", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  listInvoices: () => request<Invoice[]>("/api/billing/invoices"),

  downloadInvoice: async (id: number) => {
    const blob = await request<Blob>(`/api/billing/invoices/${id}/pdf`);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `invoice-${id}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  },

  getSubscription: () => request<Subscription>("/api/billing/subscription"),

  getSubscriptionStatus: () =>
    request<{ subscribed: boolean; subscription: Subscription }>("/api/billing/subscription/status"),

  createCheckout: (body: CheckoutRequest) =>
    request<CheckoutSession>("/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyPayment: (body: VerifyPaymentRequest) =>
    request<Subscription>("/api/billing/verify", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getNotificationPreferences: () => request<NotificationPreferences>("/api/notifications/preferences"),

  updateNotificationPreferences: (body: NotificationPreferences) =>
    request<NotificationPreferences>("/api/notifications/preferences", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};
