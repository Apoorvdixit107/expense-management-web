"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { TrialGate } from "@/components/TrialGate";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api";
import { listGuestExpenses, type GuestExpense } from "@/lib/guest";
import { isSubscriber } from "@/lib/navigation";
import { ensureTrialStarted } from "@/lib/trial";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [subscriber, setSubscriber] = useState(false);
  const [apiExpenses, setApiExpenses] = useState<Expense[]>([]);
  const [guestExpenses, setGuestExpenses] = useState<GuestExpense[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const loadExpenses = useCallback(() => {
    if (isSubscriber()) {
      api
        .listExpenses()
        .then(setApiExpenses)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to load expenses"));
    } else {
      ensureTrialStarted();
      setGuestExpenses(listGuestExpenses());
    }
  }, []);

  useEffect(() => {
    const sub = isSubscriber();
    setSubscriber(sub);
    loadExpenses();
    setReady(true);
  }, [loadExpenses]);

  if (!ready) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  const content = (
    <div className="space-y-8">
      <PageHeader
        title={subscriber ? "Expenses" : "Start tracking expenses"}
        subtitle={
          subscriber
            ? "Synced to your Pro account"
            : "No sign-up required. Your 7-day free trial starts now — add your first expense below."
        }
      />
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <ExpenseForm mode={subscriber ? "api" : "guest"} onCreated={loadExpenses} />
      {subscriber ? (
        <ExpenseList mode="api" expenses={apiExpenses} onChanged={loadExpenses} />
      ) : (
        <>
          <ExpenseList mode="guest" expenses={guestExpenses} onChanged={loadExpenses} />
          <div className="rounded-2xl border border-dashed border-border bg-white p-5 text-center text-sm text-muted">
            Data stored locally during trial.{" "}
            <Link href="/register" className="font-semibold text-brand hover:text-brand-hover">
              Create account
            </Link>{" "}
            or{" "}
            <Link href="/subscribe" className="font-semibold text-brand hover:text-brand-hover">
              subscribe
            </Link>{" "}
            to sync across devices.
          </div>
        </>
      )}
    </div>
  );

  return subscriber ? content : <TrialGate>{content}</TrialGate>;
}
