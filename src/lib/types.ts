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
  referralCode?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ExpenseType = "IN" | "OUT";

export type Expense = {
  id: number;
  userId: number;
  organizationId: number | null;
  categoryId: number | null;
  bankAccountId: number | null;
  category: string;
  type: ExpenseType;
  amount: number;
  description: string | null;
  spentAt: string;
  createdAt: string;
};

export type CreateExpenseRequest = {
  organizationId: number;
  categoryId: number;
  bankAccountId?: number;
  type: ExpenseType;
  amount: number;
  description?: string;
  spentAt?: string;
};

export type OrganizationType = "COMPANY" | "HOME" | "SHOP" | "OTHER" | "CUSTOM";

export type Organization = {
  id: number;
  name: string;
  type: OrganizationType;
  customTypeLabel: string | null;
  balance: number;
  createdAt: string;
};

export type CreateOrganizationRequest = {
  name: string;
  type: OrganizationType;
  customTypeLabel?: string;
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

export const ORGANIZATION_TYPE_LABELS: Record<Exclude<OrganizationType, "CUSTOM">, string> = {
  COMPANY: "Company",
  HOME: "Home",
  SHOP: "Shop",
  OTHER: "Other",
};

export const ORGANIZATION_TYPE_OPTIONS: Exclude<OrganizationType, "CUSTOM">[] = [
  "COMPANY",
  "HOME",
  "SHOP",
  "OTHER",
];

export function organizationTypeLabel(org: Pick<Organization, "type" | "customTypeLabel">): string {
  if (org.type === "CUSTOM" && org.customTypeLabel) {
    return org.customTypeLabel;
  }
  if (org.type === "CUSTOM") {
    return "Custom";
  }
  return ORGANIZATION_TYPE_LABELS[org.type];
}

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

export type ReportPeriod =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "MONTH"
  | "YEAR"
  | "CUSTOM_RANGE";

export type DashboardPeriod = ReportPeriod;

export type ReportSummaryOptions = {
  year?: number;
  month?: number;
  fromDate?: string;
  toDate?: string;
};

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
  profileImageUrl: string | null;
  preferredCurrency: AccountCurrency;
  preferredLanguage: AppLanguage;
  updatedAt: string | null;
};

export type AccountCurrency = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD" | "JPY" | "CAD" | "AUD";

export type AppLanguage = "EN_IN" | "EN_US" | "HI_IN" | "ES_ES" | "FR_FR" | "DE_DE" | "AR_AE";

export type UpdateProfileRequest = {
  fullName: string;
  phone?: string;
  profileImageUrl?: string | null;
  preferredCurrency: AccountCurrency;
  preferredLanguage: AppLanguage;
};

export type ReferralProfile = {
  referralCode: string;
  shareUrl: string;
  walletBalancePaise: number;
  referrerRewardPaise: number;
  refereeRewardPaise: number;
  totalEarnedPaise: number;
  pendingReferrals: number;
  rewardedReferrals: number;
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
