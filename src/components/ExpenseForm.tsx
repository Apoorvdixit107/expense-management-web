"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { EXPENSE_CATEGORIES, type CreateExpenseRequest } from "@/lib/types";

type ExpenseFormProps = {
  onCreated: () => void;
};

export function ExpenseForm({ onCreated }: ExpenseFormProps) {
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [spentAt, setSpentAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload: CreateExpenseRequest = {
      category,
      amount: Number(amount),
      description: description.trim() || undefined,
      spentAt: new Date(spentAt).toISOString(),
    };

    try {
      await api.createExpense(payload);
      setAmount("");
      setDescription("");
      setSpentAt(new Date().toISOString().slice(0, 16));
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Add expense</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-teal-500 focus:ring-2"
          >
            {EXPENSE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Amount (INR)"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="Date & time"
          name="spentAt"
          type="datetime-local"
          required
          value={spentAt}
          onChange={(e) => setSpentAt(e.target.value)}
        />
        <Input
          label="Description"
          name="description"
          placeholder="Optional note"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save expense"}
      </Button>
    </form>
  );
}
