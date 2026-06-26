"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { showApiError } from "@/lib/apiErrors";
import { formatCurrency } from "@/lib/format";
import type { CreateSpendPolicyRequest, SpendPolicy } from "@/lib/types";

export default function PoliciesPage() {
  const { currentOrgId } = useOrganization();
  const [policies, setPolicies] = useState<SpendPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [receiptAbove, setReceiptAbove] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    if (!currentOrgId) return;
    setLoading(true);
    api
      .listSpendPolicies(currentOrgId)
      .then(setPolicies)
      .catch((err) => showApiError(err, "Failed to load policies"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [currentOrgId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!currentOrgId) return;
    setSaving(true);
    const body: CreateSpendPolicyRequest = {
      name,
      maxAmountPerTransaction: maxAmount ? Number(maxAmount) : undefined,
      receiptRequiredAbove: receiptAbove ? Number(receiptAbove) : undefined,
      blockOnViolation: true,
    };
    try {
      await api.createSpendPolicy(currentOrgId, body);
      toast.success("Policy created");
      setShowForm(false);
      setName("");
      setMaxAmount("");
      setReceiptAbove("");
      load();
    } catch (err) {
      showApiError(err, "Could not create policy");
    } finally {
      setSaving(false);
    }
  }

  async function removePolicy(policy: SpendPolicy) {
    if (!currentOrgId) return;
    if (!window.confirm(`Deactivate policy "${policy.name}"?`)) return;
    try {
      await api.deleteSpendPolicy(currentOrgId, policy.id);
      toast.success("Policy deactivated");
      load();
    } catch (err) {
      showApiError(err, "Could not deactivate policy");
    }
  }

  return (
    <SubscriberGuard>
      <PageHeader
        title="Policies"
        subtitle="Set rules once — enforce on every spend"
        action={
          <Button variant="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "New policy"}
          </Button>
        }
      />

      {showForm ? (
        <Card className="mt-6" padding="lg">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input label="Policy name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input
              label="Max amount per transaction (₹)"
              type="number"
              min="0"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
            <Input
              label="Receipt required above (₹)"
              type="number"
              min="0"
              step="0.01"
              value={receiptAbove}
              onChange={(e) => setReceiptAbove(e.target.value)}
            />
            <div className="flex items-end">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving…" : "Save policy"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : policies.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted">No active policies. Create one to enforce spend limits.</p>
          </Card>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id} padding="md" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">{policy.name}</p>
                <p className="text-sm text-muted">
                  {policy.maxAmountPerTransaction != null
                    ? `Max ${formatCurrency(policy.maxAmountPerTransaction)} per txn`
                    : "No amount cap"}
                  {policy.receiptRequiredAbove != null
                    ? ` · Receipt above ${formatCurrency(policy.receiptRequiredAbove)}`
                    : ""}
                </p>
              </div>
              <Button variant="secondary" onClick={() => removePolicy(policy)}>
                Deactivate
              </Button>
            </Card>
          ))
        )}
      </div>
    </SubscriberGuard>
  );
}
