"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import type { BankAccount, BankAccountType } from "@/lib/types";

export default function BankAccountsPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [bankName, setBankName] = useState("");
  const [nickname, setNickname] = useState("");
  const [lastFour, setLastFour] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountType, setAccountType] = useState<BankAccountType>("SAVINGS");
  const [connectNow, setConnectNow] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadAccounts = useCallback(() => {
    if (!currentOrgId) return;
    api
      .listBankAccounts(currentOrgId)
      .then(setAccounts)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load accounts"));
  }, [currentOrgId]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!currentOrgId || !bankName.trim() || !nickname.trim()) return;
    setLoading(true);
    try {
      await api.connectBankAccount(currentOrgId, {
        bankName: bankName.trim(),
        accountNickname: nickname.trim(),
        accountLastFour: lastFour.trim() || undefined,
        ifscCode: ifsc.trim() || undefined,
        accountType,
        connectNow,
      });
      setBankName("");
      setNickname("");
      setLastFour("");
      setIfsc("");
      loadAccounts();
      toast.success(connectNow ? "Bank account connected." : "Bank account saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect account");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!currentOrgId || !confirm("Remove this bank account?")) return;
    try {
      await api.deleteBankAccount(currentOrgId, id);
      loadAccounts();
      toast.success("Bank account removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove account");
    }
  }

  if (!currentOrg) {
    return <div className="py-20 text-center text-muted">Select an organization first.</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cash & Bank"
        subtitle={`Linked accounts for ${currentOrg.name}. Connect a bank to tag expenses to an account.`}
      />

      <Card>
        <h2 className="text-lg font-bold text-ink">Connect bank account</h2>
        <p className="mt-1 text-sm text-muted">
          Add your bank details for this organization. Full account linking via your bank&apos;s API can be added later.
        </p>
        <form onSubmit={handleConnect} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          <Input
            label="Account nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Business current"
            required
          />
          <Input
            label="Last 4 digits"
            value={lastFour}
            onChange={(e) => setLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
          />
          <Input label="IFSC code" value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Account type</span>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as BankAccountType)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="SAVINGS">Savings</option>
              <option value="CURRENT">Current</option>
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 self-end text-sm text-ink">
            <input
              type="checkbox"
              checked={connectNow}
              onChange={(e) => setConnectNow(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Mark as connected
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Connect account"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
            No bank accounts yet for {currentOrg.name}.
          </div>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{account.accountNickname}</p>
                  <Badge variant={account.status === "CONNECTED" ? "brand" : "neutral"}>
                    {account.status === "CONNECTED" ? "Connected" : "Manual"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {account.bankName}
                  {account.accountLastFour ? ` · •••• ${account.accountLastFour}` : ""}
                  {account.ifscCode ? ` · ${account.ifscCode}` : ""}
                </p>
              </div>
              <Button variant="danger" onClick={() => handleDelete(account.id)}>
                Remove
              </Button>
            </Card>
          ))
        )}
      </div>

      <p className="text-sm text-muted">
        Need another organization?{" "}
        <Link href="/organizations" className="font-semibold text-brand hover:text-brand-hover">
          Manage organizations
        </Link>
      </p>
    </div>
  );
}
