"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PromptDialog } from "@/components/ui/PromptDialog";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import {
  canApproveExpense,
  canCorrectExpense,
  canEditExpense,
  canSubmitExpense,
  canVoidExpense,
  CHANGE_CATEGORY_CONFIRM,
  VOID_SPEND_CONFIRM,
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

type ConfirmAction = "void" | "correct" | null;

export function ExpenseRowActions({
  expense,
  currentUserId,
  currentUserRole,
  organizationId,
  onChanged,
  onDelete,
  compact = false,
}: ExpenseRowActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const isOwner = currentUserId != null && expense.userId === currentUserId;
  const voidButtonLabel =
    expense.spendStatus === "PENDING_APPROVAL" ? "Withdraw request" : "Remove from reports";

  async function run(action: string, fn: () => Promise<void>) {
    if (busy) return;
    setBusy(action);
    try {
      await fn();
      onChanged();
    } catch (err) {
      showApiError(err, `Couldn't ${action}. Please try again.`);
    } finally {
      setBusy(null);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    const action = confirmAction;
    setConfirmAction(null);

    if (action === "correct") {
      await run("correct", async () => {
        await api.voidExpense(expense.id);
            toast.success("Spend unlocked — update the category and submit again.");
        router.push(`/expenses/${expense.id}/edit`);
      });
      return;
    }

    await run("void", async () => {
      await api.voidExpense(expense.id);
      toast.success("Spend removed from reports. Find it under Rejected to edit or delete.");
    });
  }

  async function handleReject(comment: string) {
    setRejectOpen(false);
    await run("reject", async () => {
      await api.rejectSpend(organizationId, expense.id, comment || undefined);
      toast.success("Spend rejected.");
    });
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

  if (isOwner && canCorrectExpense(expense)) {
    buttons.push(
      <Button
        key="correct"
        variant="primary"
        disabled={busy != null}
        onClick={() => setConfirmAction("correct")}
      >
        {busy === "correct" ? "Opening…" : "Change category"}
      </Button>
    );
  }

  if (isOwner && canVoidExpense(expense)) {
    buttons.push(
      <Button
        key="void"
        variant="secondary"
        disabled={busy != null}
        onClick={() => setConfirmAction("void")}
      >
        {busy === "void" ? "Working…" : voidButtonLabel}
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
        onClick={() => setRejectOpen(true)}
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

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">{buttons}</div>

      <ConfirmDialog
        open={confirmAction === "void"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title="Remove from reports?"
        message={VOID_SPEND_CONFIRM}
        confirmLabel="Remove"
        confirmVariant="danger"
        loading={busy === "void"}
        loadingLabel="Removing..."
      />

      <ConfirmDialog
        open={confirmAction === "correct"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title="Change category?"
        message={CHANGE_CATEGORY_CONFIRM}
        confirmLabel="Continue"
        confirmVariant="primary"
        loading={busy === "correct"}
        loadingLabel="Opening..."
      />

      <PromptDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject spend"
        message="Optionally add a reason. The submitter will see this when fixing the spend."
        placeholder="Reason for rejection (optional)"
        confirmLabel="Reject"
        loading={busy === "reject"}
      />
    </>
  );
}
