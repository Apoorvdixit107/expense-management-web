"use client";

import Link from "next/link";
import { RecordSpendActions } from "@/components/RecordSpendActions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpensesSubNav } from "@/components/ExpensesSubNav";
import { OrganizationBalance } from "@/components/TransactionAmount";
import { ReportDateFilter as ReportDateFilterBar } from "@/components/reports/ReportDateFilter";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { trialExpiredForUser } from "@/lib/premium-access";
import {
  createDefaultReportDateFilter,
  resolveReportDateRange,
  type ReportDateFilter,
} from "@/lib/reports";
import {
  SPEND_STATUS_TAB_HINTS,
  SpendStatusTabHint,
  SpendWorkflowGuide,
  SpendWorkflowHelpButton,
  useSpendWorkflowFirstVisit,
} from "@/components/SpendWorkflowGuide";
import { SPEND_STATUS_FILTERS, type SpendStatusFilter } from "@/lib/spend";
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deletedExpenses, setDeletedExpenses] = useState<Expense[]>([]);
  const [listView, setListView] = useState<"active" | "deleted">("active");
  const [statusFilter, setStatusFilter] = useState<SpendStatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<ReportDateFilter>(createDefaultReportDateFilter);
  const [ready, setReady] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { firstVisitOpen, closeFirstVisit } = useSpendWorkflowFirstVisit();

  const { fromDate, toDate } = useMemo(() => resolveReportDateRange(dateFilter), [dateFilter]);

  const filteredExpenses = useMemo(() => {
    if (fromDate > toDate) return [];
    return expenses.filter((expense) => expenseInRange(expense.spentAt, fromDate, toDate));
  }, [expenses, fromDate, toDate]);

  const filteredDeletedExpenses = useMemo(() => {
    if (fromDate > toDate) return [];
    return deletedExpenses.filter((expense) =>
      expenseInRange(expense.deletedAt ?? expense.spentAt, fromDate, toDate)
    );
  }, [deletedExpenses, fromDate, toDate]);

  const loadExpenses = useCallback(() => {
    if (!currentOrgId) return;
    const statusOpts =
      statusFilter === "all" ? undefined : { spendStatus: statusFilter };
    Promise.all([
      api.listExpenses(currentOrgId, statusOpts),
      api.listExpenses(currentOrgId, { deletedOnly: true }),
    ])
      .then(([items, deleted]) => {
        setExpenses(items);
        setDeletedExpenses(deleted);
      })
      .catch((err) => showApiError(err, "Failed to load expenses"));
    refreshOrgs().catch(() => undefined);
  }, [currentOrgId, refreshOrgs, statusFilter]);

  useEffect(() => {
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
        title="Spend"
        subtitle={
          currentOrg
            ? "Record and review every outbound payment"
            : "Select an entity to view spend"
        }
        action={<RecordSpendActions />}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Spend history</h2>
            <p className="mt-1 text-sm text-muted">
              {listView === "active"
                ? `${filteredExpenses.length} transaction${filteredExpenses.length === 1 ? "" : "s"} in selected range`
                : `${filteredDeletedExpenses.length} deleted transaction${filteredDeletedExpenses.length === 1 ? "" : "s"} in selected range`}
            </p>
          </div>
          <div className="flex rounded-xl border border-border bg-paper p-1">
            <button
              type="button"
              onClick={() => setListView("active")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                listView === "active" ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setListView("deleted")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                listView === "deleted" ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              Deleted{deletedExpenses.length > 0 ? ` (${deletedExpenses.length})` : ""}
            </button>
          </div>
        </div>

        {listView === "active" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {SPEND_STATUS_FILTERS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                    statusFilter === tab.id
                      ? "bg-brand text-white"
                      : "bg-paper text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <SpendWorkflowHelpButton onClick={() => setGuideOpen(true)} />
            </div>
            {SPEND_STATUS_TAB_HINTS[statusFilter] ? (
              <SpendStatusTabHint message={SPEND_STATUS_TAB_HINTS[statusFilter]!} />
            ) : null}
          </div>
        ) : null}

        <ReportDateFilterBar filter={dateFilter} onChange={setDateFilter} />
        {fromDate > toDate ? (
          <p className="text-sm text-error">End date must be on or after start date.</p>
        ) : listView === "active" ? (
          <ExpenseList
            mode="api"
            expenses={filteredExpenses}
            onChanged={loadExpenses}
            view="active"
            currentUserRole={currentOrg?.currentUserRole}
            organizationId={currentOrgId ?? undefined}
          />
        ) : (
          <ExpenseList
            mode="api"
            expenses={filteredDeletedExpenses}
            onChanged={loadExpenses}
            view="deleted"
          />
        )}
      </Card>

      {trialExpiredForUser() ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-center text-sm text-muted">
          Your free trial has ended. Subscribe for email alerts, cloud reports, and premium features.{" "}
          <Link href="/manage-plan" className="font-semibold text-brand hover:text-brand-hover">
            View plans
          </Link>
        </div>
      ) : null}

      <SpendWorkflowGuide open={guideOpen || firstVisitOpen} onClose={() => {
        closeFirstVisit();
        setGuideOpen(false);
      }} />
    </div>
  );
}
