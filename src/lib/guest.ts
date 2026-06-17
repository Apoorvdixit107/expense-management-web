import { formatCurrency } from "./format";
import { ensureTrialStarted, getDaysLeft } from "./trial";
import type { ExpenseReport, ReportPeriod } from "./types";

const EXPENSES_KEY = "ems_guest_expenses";
const CONTACT_KEY = "ems_guest_contact";
const ACTIVITY_KEY = "ems_guest_activity";

export type GuestExpense = {
  id: string;
  category: string;
  amount: number;
  description?: string;
  spentAt: string;
  createdAt: string;
};

export type GuestContact = {
  email: string;
  mobile?: string;
};

export type GuestActivity = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function listGuestExpenses(): GuestExpense[] {
  return readJson<GuestExpense[]>(EXPENSES_KEY, []).sort(
    (a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime()
  );
}

export function addGuestExpense(input: {
  category: string;
  amount: number;
  description?: string;
  spentAt: string;
}): GuestExpense {
  ensureTrialStarted();
  const expense: GuestExpense = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  const items = listGuestExpenses();
  items.unshift(expense);
  writeJson(EXPENSES_KEY, items);

  addGuestActivity({
    title: "Expense added",
    message: `${input.category} · ${formatCurrency(input.amount)} recorded`,
  });

  const daysLeft = getDaysLeft();
  if (daysLeft <= 2) {
    addGuestActivity({
      title: "Trial reminder",
      message: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your free trial. Subscribe to keep your data.`,
    });
  }

  return expense;
}

export function deleteGuestExpense(id: string): void {
  writeJson(
    EXPENSES_KEY,
    listGuestExpenses().filter((item) => item.id !== id)
  );
}

export function getGuestContact(): GuestContact | null {
  return readJson<GuestContact | null>(CONTACT_KEY, null);
}

export function saveGuestContact(contact: GuestContact): void {
  writeJson(CONTACT_KEY, contact);
  addGuestActivity({
    title: "Contact saved",
    message: `Alerts will be sent to ${contact.email}${contact.mobile ? ` · ${contact.mobile}` : ""}`,
  });
}

export function listGuestActivity(): GuestActivity[] {
  return readJson<GuestActivity[]>(ACTIVITY_KEY, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addGuestActivity(input: { title: string; message: string }): GuestActivity {
  const item: GuestActivity = {
    id: crypto.randomUUID(),
    title: input.title,
    message: input.message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const items = listGuestActivity();
  items.unshift(item);
  writeJson(ACTIVITY_KEY, items);
  return item;
}

export function markGuestActivityRead(id: string): void {
  writeJson(
    ACTIVITY_KEY,
    listGuestActivity().map((item) => (item.id === id ? { ...item, read: true } : item))
  );
}

function periodRange(period: ReportPeriod): { from: Date; to: Date; label: string } {
  const to = new Date();
  const from = new Date();

  if (period === "LAST_7_DAYS") {
    from.setDate(from.getDate() - 7);
    return { from, to, label: "Last 7 days" };
  }

  from.setDate(from.getDate() - 30);
  return { from, to, label: "Last 30 days" };
}

function expensesInRange(from: Date, to: Date): GuestExpense[] {
  return listGuestExpenses().filter((expense) => {
    const spentAt = new Date(expense.spentAt);
    return spentAt >= from && spentAt <= to;
  });
}

function reportFromExpenses(
  expenses: GuestExpense[],
  meta: { periodType: string; label: string; from: Date; to: Date }
): ExpenseReport {
  const byCategory = new Map<string, { amount: number; transactionCount: number }>();

  for (const expense of expenses) {
    const current = byCategory.get(expense.category) ?? { amount: 0, transactionCount: 0 };
    current.amount += expense.amount;
    current.transactionCount += 1;
    byCategory.set(expense.category, current);
  }

  return {
    periodType: meta.periodType,
    label: meta.label,
    fromDate: meta.from.toISOString(),
    toDate: meta.to.toISOString(),
    totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    transactionCount: expenses.length,
    byCategory: [...byCategory.entries()]
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.amount - a.amount),
    breakdown: [],
  };
}

export function guestReportSummary(period: ReportPeriod): ExpenseReport {
  const { from, to, label } = periodRange(period);
  return reportFromExpenses(expensesInRange(from, to), {
    periodType: period,
    label,
    from,
    to,
  });
}

export function guestReportMonthly(year: number): ExpenseReport {
  const from = new Date(year, 0, 1);
  const to = new Date(year, 11, 31, 23, 59, 59, 999);
  const expenses = expensesInRange(from, to);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const breakdown = months.map((label, index) => {
    const monthExpenses = expenses.filter((expense) => new Date(expense.spentAt).getMonth() === index);
    return {
      label,
      amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      transactionCount: monthExpenses.length,
    };
  });

  return {
    ...reportFromExpenses(expenses, {
      periodType: "MONTH",
      label: `Year ${year}`,
      from,
      to,
    }),
    breakdown,
  };
}
