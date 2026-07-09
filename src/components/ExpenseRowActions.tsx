"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import {
  canApproveExpense,
  canEditExpense,
  canSubmitExpense,
  canVoidExpense,
} from "@/lib/spend";
import type { Expense, OrgMemberRole } from "@/lib/types";

type ExpenseRowActionsProps = {
  expense: Expense;
  currentUserId: number | null;
  currentUserRole?: OrgMemberRole | null;
  organizationId: number;
  onChanged: () => void;
  onDelete: () => void;
  compact?: boolean;
};

export function ExpenseRowActions({
  expense,
  currentUserId,
  currentUserRole,
  organizationId,
  onChanged,
  onDelete,
  compact = false,
}: ExpenseRowActionsProps) {
  const [busy, setBusy] = useState<string | null>(null);
  const isOwner = currentUserId != null && expense.userId === currentUserId;

  async function run(action: string, fn: () => Promise<void>) {
    if (busy) return;
    setBusy(action);
    try {
      await fn();
      onChanged();
    } catch (err) {
      showApiError(err, `Failed to ${action}`);
    } finally {
      setBusy(null);
    }
  }

  const buttons: React.ReactNode[] = [];

  if (isOwner && canEditExpense(expense)) {
    buttons.push(
      <Link
        key="edit"
        href={`/expenses/${expense.id}/edit`}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
      >
        Edit
      </Link>
    );
  } else if (!compact) {
    buttons.push(
      <Link
        key="view"
        href={`/expenses/${expense.id}/edit`}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-muted transition hover:text-ink"
      >
        View
      </Link>
    );
  }

  if (isOwner && canSubmitExpense(expense)) {
    buttons.push(
      <Button
        key="submit"
        variant="primary"
        disabled={busy != null}
        onClick={() =>
          void run("submit", async () => {
            await api.submitExpense(expense.id);
            toast.success("Spend submitted for approval.");
          })
        }
      >
        {busy === "submit" ? "Submitting…" : "Submit"}
      </Button>
    );
  }

  if (isOwner && canVoidExpense(expense)) {
    buttons.push(
      <Button
        key="void"
        variant="secondary"
        disabled={busy != null}
        onClick={() => {
          if (!window.confirm("Void this spend? It will be removed from reports and ledger.")) return;
          void run("void", async () => {
            await api.voidExpense(expense.id);
            toast.success("Spend voided.");
          });
        }}
      >
        {busy === "void" ? "Voiding…" : "Void"}
      </Button>
    );
  }

  if (canApproveExpense(expense, currentUserRole) && !isOwner) {
    buttons.push(
      <Button
        key="approve"
        variant="primary"
        disabled={busy != null}
        onClick={() =>
          void run("approve", async () => {
            await api.approveSpend(organizationId, expense.id);
            toast.success("Spend approved.");
          })
        }
      >
        {busy === "approve" ? "…" : "Approve"}
      </Button>
    );
    buttons.push(
      <Button
        key="reject"
        variant="secondary"
        disabled={busy != null}
        onClick={() => {
          const comment = window.prompt("Reason for rejection (optional):") ?? undefined;
          void run("reject", async () => {
            await api.rejectSpend(organizationId, expense.id, comment);
            toast.success("Spend rejected.");
          });
        }}
      >
        Reject
      </Button>
    );
  }

  if (isOwner) {
    buttons.push(
      <Button key="delete" variant="danger" disabled={busy != null} onClick={onDelete}>
        Delete
      </Button>
    );
  }

  if (buttons.length === 0) return null;

  return <div className="flex flex-wrap items-center gap-2">{buttons}</div>;
}
