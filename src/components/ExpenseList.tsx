"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TransactionAmount, TransactionTypeBadge } from "@/components/TransactionAmount";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { deleteGuestExpense, type GuestExpense } from "@/lib/guest";
import { formatDateTime } from "@/lib/format";
import type { Expense, ExpenseType } from "@/lib/types";

type ExpenseListProps =
  | { mode: "api"; expenses: Expense[]; onChanged: () => void }
  | { mode: "guest"; expenses: GuestExpense[]; onChanged: () => void };

function expenseType(expense: Expense | GuestExpense): ExpenseType {
  return expense.type ?? "OUT";
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3L16.5 4.5a2.1 2.1 0 0 0-3 0L4 14v6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ExpenseList(props: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const actionBusyRef = useRef(false);

  async function handleDelete(id: string | number) {
    if (actionBusyRef.current) return;
    actionBusyRef.current = true;
    setDeletingId(id);
    try {
      if (props.mode === "guest") {
        deleteGuestExpense(String(id));
        props.onChanged();
      } else {
        await api.deleteExpense(id as number);
        props.onChanged();
      }
      toast.success("Transaction deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete transaction");
    } finally {
      setDeletingId(null);
      actionBusyRef.current = false;
    }
  }

  if (props.expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-paper px-6 py-12 text-center text-sm text-muted">
        No transactions in this date range.
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
        const type = expenseType(expense);
        const description =
          props.mode === "guest"
            ? (expense as GuestExpense).description
            : (expense as Expense).description;

        return (
          <Card
            key={id}
            padding="sm"
            className={`flex flex-col gap-4 border-l-4 sm:flex-row sm:items-center sm:justify-between ${
              type === "IN" ? "border-l-emerald-500" : "border-l-red-500"
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{category}</Badge>
                <TransactionTypeBadge type={type} />
                <TransactionAmount type={type} amount={amount} />
              </div>
              <p className="mt-2 text-sm text-muted">{formatDateTime(spentAt)}</p>
              {description ? <p className="mt-1 text-sm text-neutral-700">{description}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {props.mode === "api" ? (
                <Link
                  href={`/expenses/${id}/edit`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:border-brand hover:text-brand"
                  aria-label="Edit transaction"
                  title="Edit transaction"
                >
                  <EditIcon />
                </Link>
              ) : null}
              <Button
                variant="danger"
                disabled={deletingId === id}
                onClick={() => void handleDelete(id)}
              >
                {deletingId === id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
