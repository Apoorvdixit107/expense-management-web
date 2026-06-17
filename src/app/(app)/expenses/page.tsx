"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { isSubscriber } from "@/lib/navigation";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [subscriber, setSubscriber] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);

  const loadExpenses = useCallback(() => {
    if (!currentOrgId) return;
    api
      .listExpenses(currentOrgId)
      .then(setExpenses)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load expenses"));
  }, [currentOrgId]);

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
        title="Expenses"
        subtitle={
          currentOrg
            ? `Day-to-day spending for ${currentOrg.name}`
            : "Select an organization to view expenses"
        }
      />
      <ExpenseForm mode="api" onCreated={loadExpenses} />
      <ExpenseList mode="api" expenses={expenses} onChanged={loadExpenses} />
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
