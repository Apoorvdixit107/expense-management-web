export type AuthResponse = {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type Expense = {
  id: number;
  userId: number;
  organizationId: number | null;
  categoryId: number | null;
  bankAccountId: number | null;
  category: string;
  amount: number;
  description: string | null;
  spentAt: string;
  createdAt: string;
};

export type CreateExpenseRequest = {
  organizationId: number;
  categoryId: number;
  bankAccountId?: number;
  amount: number;
  description?: string;
  spentAt?: string;
};

export type OrganizationType = "COMPANY" | "HOME" | "SHOP" | "OTHER";

export type Organization = {
  id: number;
  name: string;
  type: OrganizationType;
  createdAt: string;
};

export type CreateOrganizationRequest = {
  name: string;
  type: OrganizationType;
};

export type UpdateOrganizationRequest = CreateOrganizationRequest;

export type ExpenseCategory = {
  id: number;
  organizationId: number;
  name: string;
  sortOrder: number;
  createdAt: string;
};

export type BankAccountType = "SAVINGS" | "CURRENT";
export type BankAccountStatus = "MANUAL" | "CONNECTED";

export type BankAccount = {
  id: number;
  organizationId: number;
  bankName: string;
  accountNickname: string;
  accountLastFour: string | null;
  ifscCode: string | null;
  accountType: BankAccountType;
  status: BankAccountStatus;
  connectedAt: string;
};

export type ConnectBankAccountRequest = {
  bankName: string;
  accountNickname: string;
  accountLastFour?: string;
  ifscCode?: string;
  accountType: BankAccountType;
  connectNow: boolean;
};

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  COMPANY: "Company",
  HOME: "Home",
  SHOP: "Shop",
  OTHER: "Other",
};

export const ORGANIZATION_TYPE_OPTIONS: OrganizationType[] = ["COMPANY", "HOME", "SHOP", "OTHER"];

export type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  expenseId: number | null;
  read: boolean;
  createdAt: string;
};

export type CategoryBreakdown = {
  category: string;
  amount: number;
  transactionCount: number;
};

export type PeriodBreakdown = {
  label: string;
  amount: number;
  transactionCount: number;
};

export type ExpenseReport = {
  periodType: string;
  label: string;
  fromDate: string;
  toDate: string;
  totalAmount: number;
  transactionCount: number;
  byCategory: CategoryBreakdown[];
  breakdown: PeriodBreakdown[];
};

export type ReportPeriod = "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS" | "MONTH" | "YEAR";

export type PlanCode = "PRO" | "BEAST";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export type Plan = {
  code: PlanCode;
  name: string;
  description: string;
  amountPaise: number;
  currency: string;
  billingInterval: string;
};

export type Subscription = {
  subscribed: boolean;
  planCode: PlanCode | null;
  planName: string | null;
  status: SubscriptionStatus | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canRenew: boolean;
};

export type CheckoutSession = {
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency: string;
  planCode: PlanCode;
  planName: string;
  mock: boolean;
};

export type VerifyPaymentRequest = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type ShippingDetails = {
  email: string;
  name?: string;
  phone?: string;
  gst?: string;
  pan?: string;
  address?: string;
  pincode?: string;
};

export type CheckoutRequest = {
  planCode: PlanCode;
  shippingDetails: ShippingDetails;
  sendInvoiceEmail: boolean;
};

export type BillingDetails = {
  email: string | null;
  name: string | null;
  phone: string | null;
  gst: string | null;
  pan: string | null;
  address: string | null;
  pincode: string | null;
  sendInvoiceByEmail: boolean;
  saved: boolean;
};

export type UpdateBillingDetailsRequest = {
  shippingDetails: ShippingDetails;
  sendInvoiceByEmail: boolean;
};

export type BillingCompany = {
  companyName: string;
  location: string;
  email: string;
};

export type Invoice = {
  id: number;
  invoiceNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  planCode: PlanCode;
  planName: string;
  amountPaise: number;
  currency: string;
  customerEmail: string;
  customerName: string | null;
  issuedAt: string;
  emailed: boolean;
};

export type NotificationPreferences = {
  email: string;
  phone: string | null;
  emailEnabled: boolean;
  smsEnabled: boolean;
  dailySummaryEnabled: boolean;
  expenseAlertsEnabled: boolean;
};

export type UserProfile = {
  userId: number;
  email: string;
  fullName: string;
  phone: string | null;
  authProvider: "LOCAL" | "GOOGLE";
  updatedAt: string | null;
};

export type UpdateProfileRequest = {
  fullName: string;
  phone?: string;
};

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Travel",
  "Other",
] as const;
