"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BankAccountsSubNav } from "@/components/BankAccountsSubNav";
import { ExpenseList } from "@/components/ExpenseList";
import { ReportDateFilter as ReportDateFilterBar } from "@/components/reports/ReportDateFilter";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureGuideTrigger } from "@/components/FeatureGuide";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import {
  createDefaultReportDateFilter,
  resolveReportDateRange,
  type ReportDateFilter,
} from "@/lib/reports";
import type { Expense, PaymentMode } from "@/lib/types";

function expenseInRange(spentAt: string, fromDate: string, toDate: string): boolean {
  const local = new Date(spentAt);
  const y = local.getFullYear();
  const m = String(local.getMonth() + 1).padStart(2, "0");
  const d = String(local.getDate()).padStart(2, "0");
  const date = `${y}-${m}-${d}`;
  return date >= fromDate && date <= toDate;
}

const PAYMENT_MODE_OPTIONS: { value: "" | PaymentMode; label: string }[] = [
  { value: "", label: "All payment types" },
  { value: "CASH", label: "Cash" },
  { value: "ONLINE", label: "Online" },
  { value: "BANK", label: "Bank" },
];

export default function CashAndBankPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentMode, setPaymentMode] = useState<"" | PaymentMode>("");
  const [dateFilter, setDateFilter] = useState<ReportDateFilter>(createDefaultReportDateFilter);
  const [ready, setReady] = useState(false);

  const { fromDate, toDate } = useMemo(() => resolveReportDateRange(dateFilter), [dateFilter]);

  const loadLedger = useCallback(() => {
    if (!currentOrgId) return;
    api
      .listExpenses(currentOrgId, {
        cashAndBankOnly: true,
        paymentMode: paymentMode || undefined,
      })
      .then(setExpenses)
      .catch((err) => showApiError(err, "Failed to load ledger"));
  }, [currentOrgId, paymentMode]);

  useEffect(() => {
    if (currentOrgId) loadLedger();
    setReady(true);
  }, [currentOrgId, loadLedger]);

  const filteredExpenses = useMemo(() => {
    if (fromDate > toDate) return [];
    return expenses.filter((expense) => expenseInRange(expense.spentAt, fromDate, toDate));
  }, [expenses, fromDate, toDate]);

  if (!ready) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  if (!currentOrg) {
    return <div className="py-20 text-center text-muted">Select an organization first.</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cash & Bank"
        subtitle={`Cash, online, and bank transactions for ${currentOrg.name}`}
        action={<FeatureGuideTrigger guideId="ledger" />}
      />

      <BankAccountsSubNav />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink">Payment type</span>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as "" | PaymentMode)}
            className="h-11 w-full min-w-[200px] rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {PAYMENT_MODE_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <ReportDateFilterBar filter={dateFilter} onChange={setDateFilter} />
      </div>

      <ExpenseList
        mode="api"
        expenses={filteredExpenses}
        onChanged={loadLedger}
        showPaymentMode
      />
    </div>
  );
}
