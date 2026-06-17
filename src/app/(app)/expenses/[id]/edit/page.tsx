"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import type { Expense } from "@/lib/types";

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = Number(params.id);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(expenseId)) {
      toast.error("Invalid transaction.");
      router.replace("/expenses");
      return;
    }

    api
      .getExpense(expenseId)
      .then((item) => setExpense(item))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load transaction");
        router.replace("/expenses");
      })
      .finally(() => setLoading(false));
  }, [expenseId, router]);

  if (loading) {
    return <div className="py-20 text-center text-muted">Loading transaction...</div>;
  }

  if (!expense) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit transaction"
        subtitle={`${expense.category} · ${expense.type === "IN" ? "Income" : "Expense"}`}
        action={
          <Link
            href="/expenses"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-ink transition hover:bg-paper"
          >
            Back to transactions
          </Link>
        }
      />
      <ExpenseForm
        mode="api"
        editingExpense={expense}
        onCancelEdit={() => router.push("/expenses")}
        onCreated={() => router.push("/expenses")}
      />
    </div>
  );
}
