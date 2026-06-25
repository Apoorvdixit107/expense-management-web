"use client";

import { useState } from "react";
import {
  BudgetCard,
  BudgetForm,
  BudgetPerformanceSummary,
  useBudgetData,
} from "@/components/budgets/BudgetManager";
import { useOrganization } from "@/components/OrganizationProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BudgetsPage() {
  const { currentOrg } = useOrganization();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showForm, setShowForm] = useState(false);
  const { budgets, performance, categories, loading, refresh } = useBudgetData(year);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Budgets"
        subtitle={
          currentOrg
            ? `Spending limits for ${currentOrg.name}`
            : "Set monthly, quarterly, and yearly budgets"
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              Year
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-10 rounded-lg border border-border bg-paper px-3 text-sm text-ink"
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={() => setShowForm((v) => !v)}>
              {showForm ? "Close form" : "Add budget"}
            </Button>
          </div>
        }
      />

      <BudgetPerformanceSummary performance={performance} />

      {performance && performance.budgetsOverLimit > 0 ? (
        <Card className="border-amber-200 bg-amber-50 text-sm text-amber-900">
          {performance.budgetsOverLimit} budget
          {performance.budgetsOverLimit === 1 ? "" : "s"} over limit this year. Review spending in
          highlighted categories.
        </Card>
      ) : null}

      {showForm ? (
        <BudgetForm
          categories={categories}
          year={year}
          onCreated={() => {
            setShowForm(false);
            void refresh();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Budget list</h2>
        {loading ? (
          <Card>
            <p className="text-sm text-muted">Loading budgets…</p>
          </Card>
        ) : budgets.length === 0 ? (
          <Card>
            <p className="rounded-xl border border-dashed border-border bg-paper px-6 py-12 text-center text-sm text-muted">
              No budgets for {year}. Create one to track spending against a limit.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} onUpdated={refresh} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
