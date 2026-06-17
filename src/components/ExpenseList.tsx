"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { deleteGuestExpense, type GuestExpense } from "@/lib/guest";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Expense } from "@/lib/types";

type ExpenseListProps =
  | { mode: "api"; expenses: Expense[]; onChanged: () => void }
  | { mode: "guest"; expenses: GuestExpense[]; onChanged: () => void };

export function ExpenseList(props: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  async function handleDelete(id: string | number) {
    setDeletingId(id);
    try {
      if (props.mode === "guest") {
        deleteGuestExpense(String(id));
        props.onChanged();
      } else {
        await api.deleteExpense(id as number);
        props.onChanged();
      }
      toast.success("Expense deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  }

  if (props.expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
        No expenses yet. Add your first expense above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {props.expenses.map((expense) => {
        const id = props.mode === "guest" ? (expense as GuestExpense).id : (expense as Expense).id;
        const category = expense.category;
        const amount = expense.amount;
        const spentAt = expense.spentAt;
        const description =
          props.mode === "guest"
            ? (expense as GuestExpense).description
            : (expense as Expense).description;

        return (
          <Card key={id} padding="sm" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{category}</Badge>
                <span className="text-xl font-bold text-ink">{formatCurrency(amount)}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{formatDateTime(spentAt)}</p>
              {description ? <p className="mt-1 text-sm text-neutral-700">{description}</p> : null}
            </div>
            <Button
              variant="danger"
              className="shrink-0"
              disabled={deletingId === id}
              onClick={() => handleDelete(id)}
            >
              {deletingId === id ? "Deleting..." : "Delete"}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
