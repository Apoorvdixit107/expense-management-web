"use client";

import { useCallback, useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { api } from "@/lib/api";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  const loadExpenses = useCallback(() => {
    api
      .listExpenses()
      .then(setExpenses)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load expenses"));
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
        <p className="text-sm text-slate-500">Add, view, and delete your expenses</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <ExpenseForm onCreated={loadExpenses} />
      <ExpenseList expenses={expenses} onChanged={loadExpenses} />
    </div>
  );
}
