"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Expense } from "@/lib/types";

type ExpenseListProps = {
  expenses: Expense[];
  onChanged: () => void;
};

export function ExpenseList({ expenses, onChanged }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: number) {
    setError("");
    setDeletingId(id);
    try {
      await api.deleteExpense(id);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No expenses yet. Add your first expense above.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {expenses.map((expense) => (
        <article
          key={expense.id}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                {expense.category}
              </span>
              <span className="text-lg font-bold text-slate-900">{formatCurrency(expense.amount)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{formatDateTime(expense.spentAt)}</p>
            {expense.description ? <p className="mt-1 text-sm text-slate-700">{expense.description}</p> : null}
          </div>
          <Button
            variant="danger"
            disabled={deletingId === expense.id}
            onClick={() => handleDelete(expense.id)}
          >
            {deletingId === expense.id ? "Deleting..." : "Delete"}
          </Button>
        </article>
      ))}
    </div>
  );
}
