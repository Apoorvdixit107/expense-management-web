"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseRowActions } from "@/components/ExpenseRowActions";
import { PolicyWarning, SpendStatusBadge } from "@/components/SpendStatusBadge";
import { Card } from "@/components/ui/Card";
import { ConfirmDeleteDialog, SOFT_DELETE_MESSAGE } from "@/components/ui/ConfirmDeleteDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionAmount } from "@/components/TransactionAmount";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { useOrganization } from "@/components/OrganizationProvider";
import { canEditExpense, EDIT_BLOCKED_MESSAGE } from "@/lib/spend";
import {
  SpendWorkflowGuide,
  SpendWorkflowHelpButton,
} from "@/components/SpendWorkflowGuide";
import type { Expense } from "@/lib/types";

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = Number(params.id);
  const { currentOrg, currentOrgId } = useOrganization();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  function reload() {
    if (!Number.isFinite(expenseId)) return;
    api
      .getExpense(expenseId)
      .then(setExpense)
      .catch((err) => showApiError(err, "Failed to load transaction"));
  }

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
        showApiError(err, "Failed to load transaction");
        router.replace("/expenses");
      })
      .finally(() => setLoading(false));
  }, [expenseId, router]);

  if (loading) {
    return <div className="py-20 text-center text-muted">Loading transaction...</div>;
  }

  if (!expense || !currentOrgId) {
    return null;
  }

  const editable = canEditExpense(expense);

  return (
    <div className="space-y-8">
      <PageHeader
        title={editable ? "Edit spend" : "Spend details"}
        subtitle={`${expense.category} · ${expense.type === "IN" ? "Income (legacy)" : "Spend"}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <SpendWorkflowHelpButton onClick={() => setGuideOpen(true)} />
            <Link
              href="/expenses"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-ink transition hover:bg-paper"
            >
              Back to Spend
            </Link>
          </div>
        }
      />

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SpendStatusBadge status={expense.spendStatus} />
          {expense.policyViolation ? (
            <PolicyWarning message={expense.policyMessage ?? "Policy warning"} />
          ) : null}
          <TransactionAmount type={expense.type} amount={expense.amount} />
        </div>
        <p className="text-sm text-muted">{formatDateTime(expense.spentAt)}</p>
        {expense.description ? <p className="text-sm text-ink">{expense.description}</p> : null}
        {expense.rejectionComment ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
            <span className="font-semibold">Rejection reason:</span> {expense.rejectionComment}
          </p>
        ) : null}
        {expense.spendStatus === "PENDING_APPROVAL" ? (
          <p className="text-sm text-amber-700 dark:text-amber-300">Waiting for finance approval.</p>
        ) : null}
        {!editable ? (
          <p className="text-sm text-muted">{EDIT_BLOCKED_MESSAGE}</p>
        ) : null}
        <ExpenseRowActions
          expense={expense}
          currentUserId={getUser()?.userId ?? null}
          currentUserRole={currentOrg?.currentUserRole}
          organizationId={currentOrgId}
          onChanged={() => reload()}
          onDelete={() => setDeleteOpen(true)}
        />
      </Card>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        loading={deleting}
        title="Delete spend"
        message={SOFT_DELETE_MESSAGE}
        onConfirm={async () => {
          setDeleting(true);
          try {
            await api.deleteExpense(expense.id);
            toast.success("Spend deleted.");
            router.push("/expenses");
          } catch (err) {
            showApiError(err, "Failed to delete spend");
          } finally {
            setDeleting(false);
          }
        }}
      />

      {editable ? (
        <ExpenseForm
          mode="api"
          editingExpense={expense}
          onCancelEdit={() => router.push("/expenses")}
          onCreated={() => router.push("/expenses")}
        />
      ) : null}

      <SpendWorkflowGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
