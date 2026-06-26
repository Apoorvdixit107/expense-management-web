"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfirmDeleteDialog, SOFT_DELETE_MESSAGE } from "@/components/ui/ConfirmDeleteDialog";
import { RecordSpendActions } from "@/components/RecordSpendActions";
import { TransactionAmount, TransactionTypeBadge } from "@/components/TransactionAmount";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { deleteGuestExpense, type GuestExpense } from "@/lib/guest";
import { formatDateTime } from "@/lib/format";
import type { Expense, ExpenseType, PaymentMode } from "@/lib/types";

type ExpenseListProps =
  | {
      mode: "api";
      expenses: Expense[];
      onChanged: () => void;
      showPaymentMode?: boolean;
      view?: "active" | "deleted";
    }
  | { mode: "guest"; expenses: GuestExpense[]; onChanged: () => void };

function expenseType(expense: Expense | GuestExpense): ExpenseType {
  return expense.type ?? "OUT";
}

function paymentModeLabel(mode: PaymentMode): string {
  if (mode === "ONLINE") return "Online";
  if (mode === "BANK") return "Bank";
  return "Cash";
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
  const view = props.mode === "api" ? (props.view ?? "active") : "active";
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string | number;
    label: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const actionBusyRef = useRef(false);

  async function confirmDelete() {
    if (!deleteTarget || actionBusyRef.current) return;
    actionBusyRef.current = true;
    setDeleting(true);
    try {
      if (props.mode === "guest") {
        deleteGuestExpense(String(deleteTarget.id));
        props.onChanged();
      } else {
        await api.deleteExpense(deleteTarget.id as number);
        props.onChanged();
      }
      toast.success("Transaction moved to Deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showApiError(err, "Failed to delete transaction");
    } finally {
      setDeleting(false);
      actionBusyRef.current = false;
    }
  }

  async function handleRestore(id: number) {
    if (actionBusyRef.current) return;
    actionBusyRef.current = true;
    setRestoringId(id);
    try {
      await api.restoreExpense(id);
      props.onChanged();
      toast.success("Transaction recovered.");
    } catch (err) {
      showApiError(err, "Failed to recover transaction");
    } finally {
      setRestoringId(null);
      actionBusyRef.current = false;
    }
  }

  if (props.expenses.length === 0) {
    return (
      <>
        <div className="rounded-2xl border border-dashed border-border bg-paper px-6 py-12 text-center text-sm text-muted">
          {view === "deleted"
            ? "No deleted transactions. Deleted items appear here and can be recovered."
            : "No spend recorded yet. Add your first entry or capture a receipt."}
          {view === "active" ? (
            <div className="mt-4 flex justify-center">
              <RecordSpendActions />
            </div>
          ) : null}
        </div>
        {view === "active" ? (
          <ConfirmDeleteDialog
            open={deleteTarget != null}
            onClose={() => {
              if (!deleting) setDeleteTarget(null);
            }}
            onConfirm={confirmDelete}
            title="Delete transaction"
            itemName={deleteTarget?.label}
            message={SOFT_DELETE_MESSAGE}
            loading={deleting}
          />
        ) : null}
      </>
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
        const paymentMode =
          props.mode === "api" ? (expense as Expense).paymentMode ?? "CASH" : null;
        const deletedAt = props.mode === "api" ? (expense as Expense).deletedAt : null;

        return (
          <Card
            key={id}
            padding="sm"
            className={`flex flex-col gap-4 border-l-4 sm:flex-row sm:items-center sm:justify-between ${
              view === "deleted"
                ? "border-l-neutral-400 opacity-90"
                : type === "IN"
                  ? "border-l-emerald-500"
                  : "border-l-red-500"
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{category}</Badge>
                <TransactionTypeBadge type={type} />
                {view === "deleted" ? <Badge variant="neutral">Deleted</Badge> : null}
                {props.mode === "api" && props.showPaymentMode && paymentMode ? (
                  <Badge variant="neutral">{paymentModeLabel(paymentMode)}</Badge>
                ) : null}
                <TransactionAmount type={type} amount={amount} />
              </div>
              <p className="mt-2 text-sm text-muted">{formatDateTime(spentAt)}</p>
              {deletedAt ? (
                <p className="mt-1 text-xs text-muted">Deleted {formatDateTime(deletedAt)}</p>
              ) : null}
              {description ? <p className="mt-1 text-sm text-neutral-700">{description}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {props.mode === "api" && view === "active" ? (
                <Link
                  href={`/expenses/${id}/edit`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:border-brand hover:text-brand"
                  aria-label="Edit transaction"
                  title="Edit transaction"
                >
                  <EditIcon />
                </Link>
              ) : null}
              {props.mode === "api" && view === "deleted" ? (
                <Button
                  variant="primary"
                  disabled={restoringId === id}
                  onClick={() => void handleRestore(id as number)}
                >
                  {restoringId === id ? "Recovering..." : "Recover"}
                </Button>
              ) : (
                <Button
                  variant="danger"
                  disabled={deleting && deleteTarget?.id === id}
                  onClick={() =>
                    setDeleteTarget({
                      id,
                      label: `${category} · ${formatDateTime(spentAt)}`,
                    })
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          </Card>
        );
      })}
      {view === "active" ? (
        <ConfirmDeleteDialog
          open={deleteTarget != null}
          onClose={() => {
            if (!deleting) setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
          title="Delete transaction"
          itemName={deleteTarget?.label}
          message={SOFT_DELETE_MESSAGE}
          loading={deleting}
        />
      ) : null}
    </div>
  );
}
