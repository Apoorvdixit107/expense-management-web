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
  category: string;
  amount: number;
  description: string | null;
  spentAt: string;
  createdAt: string;
};

export type CreateExpenseRequest = {
  category: string;
  amount: number;
  description?: string;
  spentAt?: string;
};

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

export type ReportPeriod = "LAST_7_DAYS" | "LAST_30_DAYS" | "MONTH" | "YEAR";

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
