import { getToken } from "./auth";
import { logoutClient } from "./session";
import type {
  AuthResponse,
  BillingCompany,
  BillingDetails,
  CheckoutRequest,
  CheckoutSession,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ScanBillRequest,
  ScanBillResponse,
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
  WithdrawWalletRequest,
  WalletWithdrawalResponse,
  AssistantChatRequest,
  AssistantChatResponse,
  OrganizationBalanceRange,
  OrganizationReport,
  OrganizationReportType,
  PaymentMode,
  BankSyncResponse,
  ProfitabilityReport,
  Budget,
  BudgetPerformanceReport,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  GstTaxCategory,
  CreateGstTaxCategoryRequest,
  GstSummaryReport,
  GstTrendGroup,
  SpendStatus,
  SpendPolicy,
  CreateSpendPolicyRequest,
  SpendOverviewStats,
  OrganizationMember,
  OrganizationInvite,
  CreateOrganizationInviteRequest,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

import { isGenericHttpMessage } from "./apiErrors";
import { profitabilityFromSummary } from "./profitability";

function parseErrorMessage(body: string, status: number): string {
  // Never expose server internals to the client layer.
  if (status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  let message = body;
  try {
    const json = JSON.parse(body) as { detail?: string; message?: string; error?: string; title?: string };
    const detail = json.detail ?? json.message;
    const title =
      json.title && !isGenericHttpMessage(json.title) ? json.title : undefined;
    message = detail ?? json.error ?? title ?? body;
  } catch {
    // plain text error body
  }
  if (!message || isGenericHttpMessage(message)) {
    if (status === 400) return "Invalid request. Please check your input and try again.";
    if (status === 401) return "Invalid email or password";
    if (status === 403) {
      return "You don't have permission to do that.";
    }
    if (status === 404) return "The requested item was not found.";
    if (status === 409) return "Email already registered";
    if (status === 413) return "Bill file is too large. Try a smaller image or PDF.";
    if (status === 429) return "Too many requests. Please wait a moment and try again.";
    if (status === 503 || status === 502 || status === 504) {
      return "Service is temporarily unavailable. Please try again shortly.";
    }
    return `Request failed (${status})`;
  }
  return message;
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
    throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
  });

  if (response.status === 401 && auth) {
    logoutClient();
    if (typeof window !== "undefined") {
      const path = window.location.pathname + window.location.search;
      const next = encodeURIComponent(path.startsWith("/") ? path : "/dashboard");
      window.location.replace(`/login?next=${next}`);
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const message = parseErrorMessage(body, response.status);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/pdf") || contentType.includes("text/csv")) {
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

  withdrawWallet: (body: WithdrawWalletRequest) =>
    request<WalletWithdrawalResponse>("/api/referrals/withdraw", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getProfile: () => request<UserProfile>("/api/auth/profile"),

  updateProfile: (body: UpdateProfileRequest) =>
    request<UserProfile>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  listExpenses: (
    organizationId?: number,
    options?: {
      paymentMode?: PaymentMode;
      cashAndBankOnly?: boolean;
      deletedOnly?: boolean;
      spendStatus?: SpendStatus;
    }
  ) => {
    const params = new URLSearchParams();
    if (organizationId !== undefined) params.set("organizationId", String(organizationId));
    if (options?.paymentMode) params.set("paymentMode", options.paymentMode);
    if (options?.cashAndBankOnly) params.set("cashAndBankOnly", "true");
    if (options?.deletedOnly) params.set("deletedOnly", "true");
    if (options?.spendStatus) params.set("spendStatus", options.spendStatus);
    const query = params.toString();
    return request<Expense[]>(`/api/expenses${query ? `?${query}` : ""}`);
  },

  getExpense: (id: number) => request<Expense>(`/api/expenses/${id}`),

  createExpense: (body: CreateExpenseRequest) =>
    request<Expense>("/api/expenses", { method: "POST", body: JSON.stringify(body) }),

  scanBill: (body: ScanBillRequest) =>
    request<ScanBillResponse>("/api/expenses/scan-bill", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  assistantChat: (body: AssistantChatRequest) =>
    request<AssistantChatResponse>("/api/expenses/assistant/chat", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateExpense: (id: number, body: UpdateExpenseRequest) =>
    request<Expense>(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  deleteExpense: (id: number) => request<void>(`/api/expenses/${id}`, { method: "DELETE" }),

  restoreExpense: (id: number) =>
    request<Expense>(`/api/expenses/${id}/restore`, { method: "POST" }),

  submitExpense: (id: number) =>
    request<Expense>(`/api/expenses/${id}/submit`, { method: "POST" }),

  voidExpense: (id: number) =>
    request<Expense>(`/api/expenses/${id}/void`, { method: "POST" }),

  getSpendOverview: (organizationId: number, fromDate: string, toDate: string) => {
    const params = new URLSearchParams({ fromDate, toDate });
    return request<SpendOverviewStats>(
      `/api/organizations/${organizationId}/spend/overview?${params}`
    );
  },

  listPendingApprovals: (organizationId: number) =>
    request<Expense[]>(`/api/organizations/${organizationId}/approvals/pending`),

  approveSpend: (organizationId: number, expenseId: number, comment?: string) =>
    request<Expense>(`/api/organizations/${organizationId}/approvals/${expenseId}/approve`, {
      method: "POST",
      body: JSON.stringify({ comment: comment ?? null }),
    }),

  rejectSpend: (organizationId: number, expenseId: number, comment?: string) =>
    request<Expense>(`/api/organizations/${organizationId}/approvals/${expenseId}/reject`, {
      method: "POST",
      body: JSON.stringify({ comment: comment ?? null }),
    }),

  listSpendPolicies: (organizationId: number) =>
    request<SpendPolicy[]>(`/api/organizations/${organizationId}/policies`),

  createSpendPolicy: (organizationId: number, body: CreateSpendPolicyRequest) =>
    request<SpendPolicy>(`/api/organizations/${organizationId}/policies`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSpendPolicy: (
    organizationId: number,
    policyId: number,
    body: CreateSpendPolicyRequest
  ) =>
    request<SpendPolicy>(`/api/organizations/${organizationId}/policies/${policyId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteSpendPolicy: (organizationId: number, policyId: number) =>
    request<void>(`/api/organizations/${organizationId}/policies/${policyId}`, {
      method: "DELETE",
    }),

  listTeamMembers: (organizationId: number) =>
    request<OrganizationMember[]>(`/api/organizations/${organizationId}/team/members`),

  listTeamInvites: (organizationId: number) =>
    request<OrganizationInvite[]>(`/api/organizations/${organizationId}/team/invites`),

  inviteTeamMember: (organizationId: number, body: CreateOrganizationInviteRequest) =>
    request<OrganizationInvite>(`/api/organizations/${organizationId}/team/invites`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  revokeTeamInvite: (organizationId: number, inviteId: number) =>
    request<void>(`/api/organizations/${organizationId}/team/invites/${inviteId}`, {
      method: "DELETE",
    }),

  acceptTeamInvite: (token: string) =>
    request<OrganizationMember>(`/api/organizations/team/invites/accept?token=${encodeURIComponent(token)}`, {
      method: "POST",
    }),

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

  listBudgets: (organizationId: number, year?: number) => {
    const params = year !== undefined ? `?year=${year}` : "";
    return request<Budget[]>(`/api/organizations/${organizationId}/budgets${params}`);
  },

  getBudgetPerformance: (organizationId: number, year: number) =>
    request<BudgetPerformanceReport>(
      `/api/organizations/${organizationId}/budgets/performance?year=${year}`
    ),

  createBudget: (organizationId: number, body: CreateBudgetRequest) =>
    request<Budget>(`/api/organizations/${organizationId}/budgets`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateBudget: (organizationId: number, budgetId: number, body: UpdateBudgetRequest) =>
    request<Budget>(`/api/organizations/${organizationId}/budgets/${budgetId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteBudget: (organizationId: number, budgetId: number) =>
    request<void>(`/api/organizations/${organizationId}/budgets/${budgetId}`, {
      method: "DELETE",
    }),

  listTaxCategories: (organizationId: number) =>
    request<GstTaxCategory[]>(`/api/organizations/${organizationId}/tax/categories`),

  createTaxCategory: (organizationId: number, body: CreateGstTaxCategoryRequest) =>
    request<GstTaxCategory>(`/api/organizations/${organizationId}/tax/categories`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteTaxCategory: (organizationId: number, categoryId: number) =>
    request<void>(`/api/organizations/${organizationId}/tax/categories/${categoryId}`, {
      method: "DELETE",
    }),

  getGstSummary: (
    organizationId: number,
    fromDate: string,
    toDate: string,
    groupBy: GstTrendGroup = "MONTH"
  ) => {
    const params = new URLSearchParams({ fromDate, toDate, groupBy });
    return request<GstSummaryReport>(
      `/api/organizations/${organizationId}/tax/gst-summary?${params}`
    );
  },

  downloadGstSummaryCsv: async (
    organizationId: number,
    fromDate: string,
    toDate: string,
    groupBy: GstTrendGroup = "MONTH"
  ) => {
    const params = new URLSearchParams({ fromDate, toDate, groupBy });
    const blob = await request<Blob>(
      `/api/organizations/${organizationId}/tax/gst-summary/export?${params}`
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gst-summary-${fromDate}-to-${toDate}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  },

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

  setPrimaryBankAccount: (organizationId: number, bankAccountId: number) =>
    request<BankAccount>(
      `/api/organizations/${organizationId}/bank-accounts/${bankAccountId}/primary`,
      { method: "PATCH" }
    ),

  connectNetBanking: (organizationId: number, bankAccountId: number) =>
    request<BankAccount>(
      `/api/organizations/${organizationId}/bank-accounts/${bankAccountId}/connect-net-banking`,
      { method: "POST" }
    ),

  syncBankAccount: (organizationId: number, bankAccountId: number) =>
    request<BankSyncResponse>(
      `/api/organizations/${organizationId}/bank-accounts/${bankAccountId}/sync`,
      { method: "POST" }
    ),

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

  reportProfitability: async (
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

    try {
      return await request<ProfitabilityReport>(`/api/reports/profitability?${params}`);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status >= 500)) {
        const summary = await request<ExpenseReport>(`/api/reports/summary?${params}`);
        return profitabilityFromSummary(summary, organizationId);
      }
      throw err;
    }
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

  sendTestNotification: () =>
    request<{ status: string; message: string }>("/api/notifications/test", {
      method: "POST",
    }),
};
