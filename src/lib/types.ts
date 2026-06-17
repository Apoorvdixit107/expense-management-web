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
