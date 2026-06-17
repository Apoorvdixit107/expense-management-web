"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { OrganizationBalance } from "@/components/TransactionAmount";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { isSubscriber } from "@/lib/navigation";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const { currentOrg, currentOrgId, refreshOrgs } = useOrganization();
  const [subscriber, setSubscriber] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);

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
      />

      {currentOrg ? (
        <Card className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Organization balance</p>
            <p className="mt-1 text-2xl font-bold text-ink">{currentOrg.name}</p>
          </div>
          <OrganizationBalance balance={currentOrg.balance ?? 0} size="lg" />
        </Card>
      ) : null}
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
