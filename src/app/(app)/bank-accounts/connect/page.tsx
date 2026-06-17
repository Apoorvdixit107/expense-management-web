"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BankAccountsSubNav } from "@/components/BankAccountsSubNav";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import type { BankAccount, BankAccountType } from "@/lib/types";

function statusLabel(status: BankAccount["status"]) {
  if (status === "NET_BANKING") return "Net banking";
  if (status === "CONNECTED") return "Connected";
  return "Manual";
}

function statusVariant(status: BankAccount["status"]): "brand" | "neutral" {
  if (status === "NET_BANKING" || status === "CONNECTED") return "brand";
  return "neutral";
}

export default function ConnectBankAccountPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [bankName, setBankName] = useState("");
  const [nickname, setNickname] = useState("");
  const [lastFour, setLastFour] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountType, setAccountType] = useState<BankAccountType>("SAVINGS");
  const [connectNow, setConnectNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function confirmDeleteBankAccount() {
    if (!currentOrgId || !deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteBankAccount(currentOrgId, deleteTarget.id);
      loadAccounts();
      toast.success("Bank account removed.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove account");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSetPrimary(id: number) {
    if (!currentOrgId) return;
    try {
      await api.setPrimaryBankAccount(currentOrgId, id);
      loadAccounts();
      toast.success("Primary bank account updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set primary account");
    }
  }

  async function handleConnectNetBanking(id: number) {
    if (!currentOrgId) return;
    try {
      await api.connectNetBanking(currentOrgId, id);
      loadAccounts();
      toast.success("Net banking connected. Sync to import transactions.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect net banking");
    }
  }

  async function handleSync(id: number) {
    if (!currentOrgId) return;
    setSyncingId(id);
    try {
      const result = await api.syncBankAccount(currentOrgId, id);
      loadAccounts();
      toast.success(
        result.importedCount > 0
          ? `Imported ${result.importedCount} transaction${result.importedCount === 1 ? "" : "s"}.`
          : "Sync complete. No new transactions."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sync account");
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <SubscriberGuard>
      <div className="space-y-8">
        <PageHeader
          title="Connect bank account"
          subtitle={
            currentOrg
              ? `Link net banking for ${currentOrg.name}. Credits and debits sync as transactions.`
              : "Select an organization to manage bank accounts"
          }
        />

        <BankAccountsSubNav />

        {!currentOrg ? (
          <div className="py-20 text-center text-muted">Select an organization first.</div>
        ) : (
          <>
            <Card>
              <div className="flex items-start gap-2">
                <PremiumStarIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-ink">Premium net banking</h2>
                  <p className="mt-1 text-sm text-muted">
                    Connect via net banking to auto-import credits and debits. Full bank APIs (Account
                    Aggregator) can replace the demo sync later.
                  </p>
                </div>
              </div>

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
                    {loading ? "Saving..." : "Add bank account"}
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
                  <Card key={account.id} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{account.accountNickname}</p>
                          <Badge variant={statusVariant(account.status)}>{statusLabel(account.status)}</Badge>
                          {account.primaryAccount ? <Badge variant="brand">Primary</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {account.bankName}
                          {account.accountLastFour ? ` · •••• ${account.accountLastFour}` : ""}
                          {account.ifscCode ? ` · ${account.ifscCode}` : ""}
                        </p>
                        {account.lastSyncedAt ? (
                          <p className="mt-1 text-xs text-muted">
                            Last synced {new Date(account.lastSyncedAt).toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {!account.primaryAccount ? (
                          <Button variant="secondary" onClick={() => void handleSetPrimary(account.id)}>
                            Set primary
                          </Button>
                        ) : null}
                        {account.status !== "NET_BANKING" ? (
                          <Button onClick={() => void handleConnectNetBanking(account.id)}>
                            Connect net banking
                          </Button>
                        ) : (
                          <Button
                            disabled={syncingId === account.id}
                            onClick={() => void handleSync(account.id)}
                          >
                            {syncingId === account.id ? "Syncing..." : "Sync transactions"}
                          </Button>
                        )}
                        <Button variant="danger" onClick={() => setDeleteTarget(account)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <p className="text-sm text-muted">
              View synced entries in{" "}
              <Link href="/bank-accounts" className="font-semibold text-brand hover:text-brand-hover">
                Cash & Bank
              </Link>
              .
            </p>
          </>
        )}

        <ConfirmDeleteDialog
          open={deleteTarget != null}
          onClose={() => {
            if (!deleting) setDeleteTarget(null);
          }}
          onConfirm={confirmDeleteBankAccount}
          title="Delete bank account"
          itemName={deleteTarget?.accountNickname}
          message={
            deleteTarget
              ? `You will remove "${deleteTarget.accountNickname}" from this organization. Linked transaction history will stay, but the account link will be lost. Do you still want to delete?`
              : undefined
          }
          loading={deleting}
        />
      </div>
    </SubscriberGuard>
  );
}
