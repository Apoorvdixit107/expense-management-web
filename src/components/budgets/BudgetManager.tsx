"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ReportCards";
import { useOrganization } from "@/components/OrganizationProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Budget, BudgetPeriodType, CreateBudgetRequest, ExpenseCategory } from "@/lib/types";

type BudgetFormProps = {
  categories: ExpenseCategory[];
  year: number;
  onCreated: () => void;
  onCancel: () => void;
};

export function BudgetForm({ categories, year, onCreated, onCancel }: BudgetFormProps) {
  const { currentOrgId } = useOrganization();
  const [periodType, setPeriodType] = useState<BudgetPeriodType>("MONTHLY");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [quarter, setQuarter] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentOrgId) return;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Enter a valid budget amount.");
      return;
    }

    const body: CreateBudgetRequest = {
      periodType,
      year,
      amount: parsedAmount,
    };
    if (periodType === "MONTHLY") body.month = Number(month);
    if (periodType === "QUARTERLY") body.quarter = Number(quarter);
    if (categoryId) body.categoryId = Number(categoryId);

    setSaving(true);
    try {
      await api.createBudget(currentOrgId, body);
      toast.success("Budget created.");
      onCreated();
    } catch (err) {
      showApiError(err, "Failed to create budget");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-bold text-ink">New budget</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Period type</span>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as BudgetPeriodType)}
            className="h-11 w-full rounded-xl border border-border bg-paper px-3 text-sm"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </label>

        {periodType === "MONTHLY" ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-ink">Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-paper px-3 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {periodType === "QUARTERLY" ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-ink">Quarter</span>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-paper px-3 text-sm"
            >
              <option value="1">Q1 (Jan–Mar)</option>
              <option value="2">Q2 (Apr–Jun)</option>
              <option value="3">Q3 (Jul–Sep)</option>
              <option value="4">Q4 (Oct–Dec)</option>
            </select>
          </label>
        ) : null}

        <label className="block space-y-2 sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Scope</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-paper px-3 text-sm"
          >
            <option value="">All categories (organization-wide)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-2">
          <Input
            label="Budget amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000"
          />
        </div>

        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Create budget"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function utilizationColor(percent: number, overBudget: boolean) {
  if (overBudget || percent >= 100) return "bg-red-500";
  if (percent >= 90) return "bg-amber-500";
  if (percent >= 75) return "bg-yellow-500";
  return "bg-emerald-500";
}

export function BudgetCard({
  budget,
  onUpdated,
}: {
  budget: Budget;
  onUpdated: () => void;
}) {
  const { currentOrgId } = useOrganization();
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(String(budget.budgetAmount));
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const barWidth = Math.min(budget.utilizationPercent, 100);

  async function saveAmount() {
    if (!currentOrgId) return;
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    setSaving(true);
    try {
      await api.updateBudget(currentOrgId, budget.id, { amount: parsed });
      toast.success("Budget updated.");
      setEditing(false);
      onUpdated();
    } catch (err) {
      showApiError(err, "Failed to update budget");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!currentOrgId) return;
    setDeleting(true);
    try {
      await api.deleteBudget(currentOrgId, budget.id);
      toast.success("Budget deleted.");
      setDeleteOpen(false);
      onUpdated();
    } catch (err) {
      showApiError(err, "Failed to delete budget");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{budget.periodLabel}</p>
          <p className="mt-1 text-xs text-muted">
            {budget.categoryName} · {budget.periodType.toLowerCase()}
          </p>
        </div>
        {budget.overBudget ? (
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
            Over budget
          </span>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted">
            Spent {formatCurrency(budget.actualSpent)} of {formatCurrency(budget.budgetAmount)}
          </span>
          <span className="font-semibold text-ink">{formatPercent(budget.utilizationPercent)}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-paper">
          <div
            className={`h-full rounded-full transition-all ${utilizationColor(budget.utilizationPercent, budget.overBudget)}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Remaining</p>
          <p className={`mt-1 font-semibold ${budget.remainingAmount < 0 ? "text-red-600" : "text-emerald-600"}`}>
            {formatCurrency(budget.remainingAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Actual</p>
          <p className="mt-1 font-semibold text-brand">{formatCurrency(budget.actualSpent)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Budget</p>
          {editing ? (
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-2 text-sm"
            />
          ) : (
            <p className="mt-1 font-semibold text-ink">{formatCurrency(budget.budgetAmount)}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {editing ? (
          <>
            <Button className="h-9 px-3 text-xs" onClick={saveAmount} disabled={saving}>
              Save
            </Button>
            <Button className="h-9 px-3 text-xs" variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button className="h-9 px-3 text-xs" variant="secondary" onClick={() => setEditing(true)}>
            Edit amount
          </Button>
        )}
        <Button className="h-9 px-3 text-xs" variant="danger" onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
      </div>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => {
          if (deleting) return;
          setDeleteOpen(false);
        }}
        onConfirm={confirmDelete}
        title="Delete budget"
        message={`Delete the budget for ${budget.categoryName} (${budget.periodLabel})? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </Card>
  );
}

export function BudgetPerformanceSummary({
  performance,
}: {
  performance: import("@/lib/types").BudgetPerformanceReport | null;
}) {
  if (!performance) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total budgeted" value={formatCurrency(performance.totalBudgetAmount)} />
      <StatCard label="Total spent" value={formatCurrency(performance.totalActualSpent)} highlight />
      <StatCard
        label="Remaining"
        value={formatCurrency(performance.totalRemainingAmount)}
        highlight={performance.totalRemainingAmount >= 0}
      />
      <StatCard
        label="Avg utilization"
        value={formatPercent(performance.averageUtilizationPercent)}
        highlight={performance.averageUtilizationPercent < 100}
      />
    </div>
  );
}

export function useBudgetData(year: number) {
  const { currentOrgId } = useOrganization();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [performance, setPerformance] = useState<import("@/lib/types").BudgetPerformanceReport | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!currentOrgId) {
      setBudgets([]);
      setPerformance(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [budgetList, perf, cats] = await Promise.all([
        api.listBudgets(currentOrgId, year),
        api.getBudgetPerformance(currentOrgId, year),
        api.listCategories(currentOrgId),
      ]);
      setBudgets(budgetList);
      setPerformance(perf);
      setCategories(cats);
    } catch (err) {
      showApiError(err, "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [currentOrgId, year]);

  return { budgets, performance, categories, loading, refresh };
}
