import type { ExpenseReport, ProfitabilityReport, ProfitPeriodPoint } from "./types";

function marginPercent(income: number, profit: number): number {
  if (income <= 0) return 0;
  return Math.round((profit / income) * 10000) / 100;
}

/** Derive profitability metrics from a summary report (works when /profitability is unavailable). */
export function profitabilityFromSummary(
  summary: ExpenseReport,
  organizationId?: number
): ProfitabilityReport {
  const income = summary.totalInAmount ?? 0;
  const expenses = summary.totalAmount ?? 0;
  const profit = income - expenses;

  const trend: ProfitPeriodPoint[] = summary.breakdown.map((out, index) => {
    const inc = summary.breakdownIn[index];
    const incomeAmount = inc?.totalAmount ?? 0;
    const expenseAmount = out.totalAmount ?? 0;
    const pointProfit = incomeAmount - expenseAmount;
    return {
      label: out.label,
      fromDate: summary.fromDate,
      toDate: summary.toDate,
      income: incomeAmount,
      expenses: expenseAmount,
      profit: pointProfit,
      profitMarginPercent: marginPercent(incomeAmount, pointProfit),
    };
  });

  return {
    periodType: summary.periodType,
    label: summary.label,
    fromDate: summary.fromDate,
    toDate: summary.toDate,
    organizationId: organizationId ?? null,
    totalIncome: income,
    totalExpenses: expenses,
    profit,
    profitMarginPercent: marginPercent(income, profit),
    trend,
    organizationComparison: [],
    topExpenseCategories: (summary.byCategory ?? []).slice(0, 5),
  };
}
