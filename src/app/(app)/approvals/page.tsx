"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { showApiError } from "@/lib/apiErrors";
import { formatCurrency } from "@/lib/format";
import { OrgRequiredState } from "@/components/OrgRequiredState";
import { FinanceRoleGuard } from "@/components/FinanceRoleGuard";
import type { Expense } from "@/lib/types";

function statusLabel(status?: Expense["spendStatus"]) {
  switch (status) {
    case "PENDING_APPROVAL":
      return "Pending";
    case "DRAFT":
      return "Draft";
    case "REJECTED":
      return "Rejected";
    case "POSTED":
      return "Posted";
    default:
      return status ?? "Posted";
  }
}

export default function ApprovalsPage() {
  const { currentOrgId } = useOrganization();
  const [pending, setPending] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);

  function load() {
    if (!currentOrgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .listPendingApprovals(currentOrgId)
      .then(setPending)
      .catch((err) => showApiError(err, "Failed to load approvals"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [currentOrgId]);

  async function approve(expense: Expense) {
    if (!currentOrgId) return;
    setActingId(expense.id);
    try {
      await api.approveSpend(currentOrgId, expense.id);
      toast.success("Spend approved");
      load();
    } catch (err) {
      showApiError(err, "Could not approve");
    } finally {
      setActingId(null);
    }
  }

  async function reject(expense: Expense) {
    if (!currentOrgId) return;
    const comment = window.prompt("Reason for rejection (optional):") ?? undefined;
    setActingId(expense.id);
    try {
      await api.rejectSpend(currentOrgId, expense.id, comment);
      toast.success("Spend rejected");
      load();
    } catch (err) {
      showApiError(err, "Could not reject");
    } finally {
      setActingId(null);
    }
  }

  return (
    <SubscriberGuard>
      <FinanceRoleGuard>
      <OrgRequiredState>
      <PageHeader
        title="Approvals"
        subtitle="Nothing posts until finance says yes"
        action={
          <Button href="/expenses/new" variant="primary">
            Record spend
          </Button>
        }
      />

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : pending.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted">All clear — no spend waiting for approval.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((expense) => (
              <Card key={expense.id} padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{expense.category}</p>
                  <p className="text-sm text-muted">
                    {expense.description || "No description"} · {statusLabel(expense.spendStatus)}
                  </p>
                  {expense.policyViolation && expense.policyMessage ? (
                    <p className="mt-1 text-xs text-amber-700">{expense.policyMessage}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-ink">{formatCurrency(expense.amount)}</span>
                  <Button
                    variant="primary"
                    disabled={actingId === expense.id}
                    onClick={() => approve(expense)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={actingId === expense.id}
                    onClick={() => reject(expense)}
                  >
                    Reject
                  </Button>
                  <Link href={`/expenses/${expense.id}/edit`} className="text-sm text-brand hover:underline">
                    View
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </OrgRequiredState>
      </FinanceRoleGuard>
    </SubscriberGuard>
  );
}
