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

export type DailyBalanceSummary = {
  date: string;
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  netChange: number;
  closingBalance: number;
};

export type OrganizationBalanceRange = {
  organizationId: number;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  closingBalance: number;
  currentBalance: number;
  periodTotalIn: number;
  periodTotalOut: number;
  periodNetChange: number;
  dailySummaries: DailyBalanceSummary[];
};

export type OrganizationReportType =
  | "ORGANIZATION_BALANCE"
  | "DATE_WISE_IN"
  | "DATE_WISE_OUT"
  | "CATEGORY_WISE";

export type OrganizationReportRow = {
  date: string | null;
  label: string;
  totalAmount: number;
  totalIn: number;
  totalOut: number;
  openingBalance: number;
  closingBalance: number;
  transactionCount: number;
  flow: "IN" | "OUT";
};

export type OrganizationReport = {
  type: OrganizationReportType;
  organizationId: number;
  organizationName: string;
  fromDate: string;
  toDate: string;
  periodOpeningBalance: number;
  periodClosingBalance: number;
  periodTotalIn: number;
  periodTotalOut: number;
  periodTotalAmount: number;
  rows: OrganizationReportRow[];
};

export type SpendStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "POSTED"
  | "REJECTED";

export type OrgMemberRole = "OWNER" | "FINANCE" | "MEMBER";

export type ExpenseType = "IN" | "OUT";

export type PaymentMode = "CASH" | "ONLINE" | "BANK";

export type Expense = {
  id: number;
  userId: number;
  organizationId: number | null;
  categoryId: number | null;
  bankAccountId: number | null;
  category: string;
  type: ExpenseType;
  paymentMode: PaymentMode;
  amount: number;
  taxCategoryId?: number | null;
  gstRate?: number | null;
  taxableAmount?: number | null;
  taxAmount?: number | null;
  description: string | null;
  spentAt: string;
  createdAt: string;
  deletedAt?: string | null;
  spendStatus?: SpendStatus;
  policyViolation?: boolean;
  policyMessage?: string | null;
  submittedAt?: string | null;
  approvedByUserId?: number | null;
  approvedAt?: string | null;
  rejectionComment?: string | null;
  voidedAt?: string | null;
};

export type CreateExpenseRequest = {
  organizationId: number;
  categoryId: number;
  bankAccountId?: number;
  type: ExpenseType;
  paymentMode?: PaymentMode;
  amount: number;
  description?: string;
  spentAt?: string;
  taxCategoryId?: number;
  gstRate?: number;
  saveAsDraft?: boolean;
  hasReceipt?: boolean;
};

export type UpdateExpenseRequest = {
  categoryId: number;
  bankAccountId?: number;
  type: ExpenseType;
  paymentMode?: PaymentMode;
  amount: number;
  description?: string;
  spentAt?: string;
  taxCategoryId?: number;
  gstRate?: number;
};

export type GstTaxCategory = {
  id: number;
  organizationId: number;
  name: string;
  rate: number;
  sortOrder: number;
  createdAt: string;
};

export type CreateGstTaxCategoryRequest = {
  name: string;
  rate: number;
};

export type GstTrendGroup = "MONTH" | "QUARTER" | "YEAR";

export type GstRateBreakdown = {
  rate: number;
  inputTax: number;
  outputTax: number;
  taxableIn: number;
  taxableOut: number;
  transactionCount: number;
};

export type GstPeriodTrend = {
  periodLabel: string;
  inputTax: number;
  outputTax: number;
  netGstPayable: number;
  transactionCount: number;
};

export type GstSummaryReport = {
  organizationId: number;
  fromDate: string;
  toDate: string;
  groupBy: GstTrendGroup;
  totalInputTax: number;
  totalOutputTax: number;
  netGstPayable: number;
  totalTaxableIn: number;
  totalTaxableOut: number;
  totalGrossAmount: number;
  transactionCount: number;
  byRate: GstRateBreakdown[];
  trend: GstPeriodTrend[];
};

export type ScanBillRequest = {
  organizationId: number;
  type: ExpenseType;
  fileName: string;
  mimeType: string;
  contentBase64: string;
};

export type ScanBillResponse = {
  type: ExpenseType;
  amount: number | null;
  spentAt: string | null;
  merchant: string | null;
  description: string | null;
  suggestedCategory: string | null;
  categoryId: number | null;
  confidence: string | null;
  notes: string | null;
  mock: boolean;
};

export type BillScanPrefill = {
  amount?: string;
  spentAt?: string;
  description?: string;
  categoryId?: number;
  suggestedCategory?: string;
  confidence?: string | null;
  notes?: string | null;
  mock?: boolean;
};

export type OrganizationType = "COMPANY" | "HOME" | "SHOP" | "OTHER" | "CUSTOM";

export type Organization = {
  id: number;
  name: string;
  type: OrganizationType;
  customTypeLabel: string | null;
  gstin?: string | null;
  industry?: string | null;
  fyStartMonth?: number | null;
  currentUserRole?: OrgMemberRole | null;
  balance: number;
  createdAt: string;
};

export type CreateOrganizationRequest = {
  name: string;
  type: OrganizationType;
  customTypeLabel?: string;
  gstin?: string;
  industry?: string;
  fyStartMonth?: number;
};

export type UpdateOrganizationRequest = CreateOrganizationRequest;

export type SpendPolicy = {
  id: number;
  organizationId: number;
  name: string;
  maxAmountPerTransaction: number | null;
  receiptRequiredAbove: number | null;
  allowedCategoryIds: string | null;
  blockOnViolation: boolean;
  active: boolean;
  createdAt: string;
};

export type CreateSpendPolicyRequest = {
  name: string;
  maxAmountPerTransaction?: number;
  receiptRequiredAbove?: number;
  allowedCategoryIds?: string;
  blockOnViolation?: boolean;
};

export type SpendOverviewStats = {
  pendingApprovals: number;
  policyFlags: number;
  totalSpendOut: number;
};

export type OrganizationMember = {
  id: number;
  userId: number;
  role: OrgMemberRole;
  joinedAt: string;
};

export type OrganizationInvite = {
  id: number;
  organizationId: number;
  email: string;
  role: OrgMemberRole;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  createdAt: string;
  expiresAt: string | null;
  acceptUrl: string;
};

export type CreateOrganizationInviteRequest = {
  email: string;
  role: Exclude<OrgMemberRole, "OWNER">;
};

export type ExpenseCategory = {
  id: number;
  organizationId: number;
  name: string;
  sortOrder: number;
  createdAt: string;
};

export type BankAccountType = "SAVINGS" | "CURRENT";
export type BankAccountStatus = "MANUAL" | "CONNECTED" | "NET_BANKING";

export type BankAccount = {
  id: number;
  organizationId: number;
  bankName: string;
  accountNickname: string;
  accountLastFour: string | null;
  ifscCode: string | null;
  accountType: BankAccountType;
  status: BankAccountStatus;
  primaryAccount: boolean;
  lastSyncedAt: string | null;
  connectedAt: string;
};

export type BankSyncResponse = {
  importedCount: number;
  transactions: Expense[];
  mock: boolean;
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
  totalAmount: number;
  transactionCount: number;
  /** @deprecated use totalAmount */
  amount?: number;
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
  totalInAmount: number;
  inTransactionCount: number;
  outTransactionCount: number;
  byCategoryIn: CategoryBreakdown[];
  breakdownIn: PeriodBreakdown[];
};

export type ProfitPeriodPoint = {
  label: string;
  fromDate: string;
  toDate: string;
  income: number;
  expenses: number;
  profit: number;
  profitMarginPercent: number;
};

export type OrganizationProfitRow = {
  organizationId: number | null;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  profitMarginPercent: number;
};

export type ProfitabilityReport = {
  periodType: string;
  label: string;
  fromDate: string;
  toDate: string;
  organizationId: number | null;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  profitMarginPercent: number;
  trend: ProfitPeriodPoint[];
  organizationComparison: OrganizationProfitRow[];
  topExpenseCategories: CategoryBreakdown[];
};

export type BudgetPeriodType = "MONTHLY" | "QUARTERLY" | "YEARLY";

export type Budget = {
  id: number;
  organizationId: number;
  categoryId: number | null;
  categoryName: string;
  periodType: BudgetPeriodType;
  year: number;
  month: number | null;
  quarter: number | null;
  periodLabel: string;
  fromDate: string;
  toDate: string;
  budgetAmount: number;
  actualSpent: number;
  remainingAmount: number;
  utilizationPercent: number;
  overBudget: boolean;
};

export type CreateBudgetRequest = {
  periodType: BudgetPeriodType;
  year: number;
  month?: number;
  quarter?: number;
  categoryId?: number;
  amount: number;
};

export type UpdateBudgetRequest = {
  amount: number;
};

export type BudgetPerformanceReport = {
  organizationId: number;
  year: number;
  totalBudgetAmount: number;
  totalActualSpent: number;
  totalRemainingAmount: number;
  averageUtilizationPercent: number;
  budgetsOverLimit: number;
  budgets: Budget[];
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
  minWithdrawalPaise: number;
  canWithdraw: boolean;
  pendingWithdrawalPaise: number;
};

export type PayoutMethod = "UPI" | "BANK";

export type WithdrawWalletRequest = {
  payoutMethod: PayoutMethod;
  upiId?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
};

export type WalletWithdrawalResponse = {
  id: number;
  amountPaise: number;
  payoutMethod: PayoutMethod;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: string;
  walletBalancePaise: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantChatRequest = {
  organizationId: number;
  message: string;
  history?: ChatMessage[];
};

export type AssistantChatResponse = {
  reply: string;
  mock: boolean;
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
