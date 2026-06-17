"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { isSubscriber } from "@/lib/navigation";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [subscriber, setSubscriber] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);

  const loadExpenses = useCallback(() => {
    api
      .listExpenses()
      .then(setExpenses)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load expenses"));
  }, []);

  useEffect(() => {
    setSubscriber(isSubscriber());
    loadExpenses();
    setReady(true);
  }, [loadExpenses]);

  if (!ready) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        subtitle={subscriber ? "Synced to your account" : "Subscribe to unlock full reports and notifications"}
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
