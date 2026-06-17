"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { addGuestExpense } from "@/lib/guest";
import { ensureTrialStarted } from "@/lib/trial";
import { EXPENSE_CATEGORIES, type CreateExpenseRequest } from "@/lib/types";

type ExpenseFormProps = {
  mode: "api" | "guest";
  onCreated: () => void;
};

export function ExpenseForm({ mode, onCreated }: ExpenseFormProps) {
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
      if (mode === "guest") {
        ensureTrialStarted();
        addGuestExpense({
          category: payload.category,
          amount: payload.amount,
          description: payload.description,
          spentAt: payload.spentAt ?? new Date().toISOString(),
        });
      } else {
        await api.createExpense(payload);
      }
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
    <Card>
      <h2 className="text-xl font-bold text-ink">Add expense</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
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
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save expense"}
        </Button>
      </form>
    </Card>
  );
}
