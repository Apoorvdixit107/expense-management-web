"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useOrganization } from "@/components/OrganizationProvider";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { addGuestExpense } from "@/lib/guest";
import { ensureTrialStarted } from "@/lib/trial";
import { EXPENSE_CATEGORIES, type BankAccount, type CreateExpenseRequest, type ExpenseCategory } from "@/lib/types";

type ExpenseFormProps = {
  mode: "api" | "guest";
  onCreated: () => void;
};

export function ExpenseForm({ mode, onCreated }: ExpenseFormProps) {
  const { currentOrg, currentOrgId } = useOrganization();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [bankAccountId, setBankAccountId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [spentAt, setSpentAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const [guestCategory, setGuestCategory] = useState<string>(EXPENSE_CATEGORIES[0]);

  useEffect(() => {
    if (mode !== "api" || !currentOrgId) return;
    Promise.all([api.listCategories(currentOrgId), api.listBankAccounts(currentOrgId)])
      .then(([cats, banks]) => {
        setCategories(cats);
        setBankAccounts(banks);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(() => {
        setCategories([]);
        setBankAccounts([]);
      });
  }, [mode, currentOrgId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "guest") {
        ensureTrialStarted();
        addGuestExpense({
          category: guestCategory,
          amount: Number(amount),
          description: description.trim() || undefined,
          spentAt: new Date(spentAt).toISOString(),
        });
      } else {
        if (!currentOrgId || categoryId === "") {
          toast.error("Select an organization and category first.");
          return;
        }
        const payload: CreateExpenseRequest = {
          organizationId: currentOrgId,
          categoryId: Number(categoryId),
          bankAccountId: bankAccountId === "" ? undefined : Number(bankAccountId),
          amount: Number(amount),
          description: description.trim() || undefined,
          spentAt: new Date(spentAt).toISOString(),
        };
        await api.createExpense(payload);
      }
      setAmount("");
      setDescription("");
      setBankAccountId("");
      setSpentAt(new Date().toISOString().slice(0, 16));
      toast.success("Expense saved successfully.");
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "api" && !currentOrg) {
    return (
      <Card>
        <p className="text-sm text-muted">Select an organization to add expenses.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-ink">Add expense</h2>
      {mode === "api" && currentOrg ? (
        <p className="mt-1 text-sm text-muted">
          Recording for <span className="font-semibold text-ink">{currentOrg.name}</span>
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Category</span>
            {mode === "guest" ? (
              <select
                value={guestCategory}
                onChange={(e) => setGuestCategory(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                {EXPENSE_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                required
              >
                {categories.length === 0 ? (
                  <option value="">No categories — create an organization first</option>
                ) : (
                  categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                )}
              </select>
            )}
          </label>
          {mode === "api" && bankAccounts.length > 0 ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Bank account (optional)</span>
              <select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value ? Number(e.target.value) : "")}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="">None</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNickname} ({account.bankName})
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <Input
            label="Amount (INR)"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label="Date & time"
            name="spentAt"
            type="datetime-local"
            required
            value={spentAt}
            onChange={(e) => setSpentAt(e.target.value)}
          />
          <Input
            label="Description"
            name="description"
            placeholder="Optional note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="sm:col-span-2"
          />
        </div>
        <Button type="submit" disabled={loading || (mode === "api" && categories.length === 0)}>
          {loading ? "Saving..." : "Save expense"}
        </Button>
      </form>
    </Card>
  );
}
