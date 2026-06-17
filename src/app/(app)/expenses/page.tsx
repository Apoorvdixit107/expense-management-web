"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpensesSubNav } from "@/components/ExpensesSubNav";
import { OrganizationBalance } from "@/components/TransactionAmount";
import { ReportDateFilter as ReportDateFilterBar } from "@/components/reports/ReportDateFilter";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { isSubscriber } from "@/lib/navigation";
import {
  createDefaultReportDateFilter,
  resolveReportDateRange,
  type ReportDateFilter,
} from "@/lib/reports";
import type { Expense } from "@/lib/types";

function expenseInRange(spentAt: string, fromDate: string, toDate: string): boolean {
  const local = new Date(spentAt);
  const y = local.getFullYear();
  const m = String(local.getMonth() + 1).padStart(2, "0");
  const d = String(local.getDate()).padStart(2, "0");
  const date = `${y}-${m}-${d}`;
  return date >= fromDate && date <= toDate;
}

export default function ExpensesPage() {
  const { currentOrg, currentOrgId, refreshOrgs } = useOrganization();
  const [subscriber, setSubscriber] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dateFilter, setDateFilter] = useState<ReportDateFilter>(createDefaultReportDateFilter);
  const [ready, setReady] = useState(false);

  const { fromDate, toDate } = useMemo(() => resolveReportDateRange(dateFilter), [dateFilter]);

  const filteredExpenses = useMemo(() => {
    if (fromDate > toDate) return [];
    return expenses.filter((expense) => expenseInRange(expense.spentAt, fromDate, toDate));
  }, [expenses, fromDate, toDate]);

  const loadExpenses = useCallback(() => {
    if (!currentOrgId) return;
    Promise.all([api.listExpenses(currentOrgId), refreshOrgs()])
      .then(([items]) => setExpenses(items))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load expenses"));
  }, [currentOrgId, refreshOrgs]);

  useEffect(() => {
    setSubscriber(isSubscriber());
    if (currentOrgId) {
      loadExpenses();
    }
    setReady(true);
  }, [currentOrgId, loadExpenses]);

  if (!ready) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        subtitle={
          currentOrg
            ? `Money in and out for ${currentOrg.name}`
            : "Select an organization to view transactions"
        }
        action={
          currentOrg ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/expenses/new?type=OUT"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 5V19M12 19L6 13M12 19L18 13"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Expense
              </Link>
              <Link
                href="/expenses/new?type=IN"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 19V5M12 5L6 11M12 5L18 11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Income
              </Link>
            </div>
          ) : null
        }
      />

      <ExpensesSubNav />

      {currentOrg ? (
        <Card className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Organization balance</p>
            <p className="mt-1 text-2xl font-bold text-ink">{currentOrg.name}</p>
          </div>
          <OrganizationBalance balance={currentOrg.balance ?? 0} size="lg" />
        </Card>
      ) : null}

      <Card className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Transaction history</h2>
            <p className="mt-1 text-sm text-muted">
              {filteredExpenses.length} transaction{filteredExpenses.length === 1 ? "" : "s"} in selected range
            </p>
          </div>
        </div>
        <ReportDateFilterBar filter={dateFilter} onChange={setDateFilter} />
        {fromDate > toDate ? (
          <p className="text-sm text-error">End date must be on or after start date.</p>
        ) : (
          <ExpenseList mode="api" expenses={filteredExpenses} onChanged={loadExpenses} />
        )}
      </Card>

      {!subscriber ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-center text-sm text-muted">
          Upgrade for dashboard, email alerts, and cloud reports.{" "}
          <Link href="/manage-plan" className="font-semibold text-brand hover:text-brand-hover">
            View plans
          </Link>
        </div>
      ) : null}
    </div>
  );
}
