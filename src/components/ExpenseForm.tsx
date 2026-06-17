"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useOrganization } from "@/components/OrganizationProvider";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { localDatetimeInputValue, localDatetimeToISO } from "@/lib/format";
import { addGuestExpense } from "@/lib/guest";
import { ensureTrialStarted } from "@/lib/trial";
import {
  EXPENSE_CATEGORIES,
  type BankAccount,
  type CreateExpenseRequest,
  type ExpenseCategory,
  type ExpenseType,
} from "@/lib/types";

type ExpenseFormProps = {
  mode: "api" | "guest";
  onCreated: () => void;
};

export function ExpenseForm({ mode, onCreated }: ExpenseFormProps) {
  const { currentOrg, currentOrgId } = useOrganization();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [type, setType] = useState<ExpenseType>("OUT");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [bankAccountId, setBankAccountId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [spentAt, setSpentAt] = useState(() => localDatetimeInputValue());
  const [loading, setLoading] = useState(false);
  const [guestCategory, setGuestCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const loadCategories = useCallback(async () => {
    if (!currentOrgId) return;
    const cats = await api.listCategories(currentOrgId);
    setCategories(cats);
    if (cats.length > 0) {
      setCategoryId((prev) => (prev !== "" && cats.some((c) => c.id === prev) ? prev : cats[0].id));
    }
  }, [currentOrgId]);

  useEffect(() => {
    if (mode !== "api" || !currentOrgId) return;
    Promise.all([loadCategories(), api.listBankAccounts(currentOrgId)])
      .then(([, banks]) => setBankAccounts(banks))
      .catch(() => {
        setCategories([]);
        setBankAccounts([]);
      });
  }, [mode, currentOrgId, loadCategories]);

  async function handleAddCategory() {
    if (!currentOrgId || !newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const created = await api.createCategory(currentOrgId, newCategoryName.trim());
      setCategories((prev) => [...prev, created]);
      setCategoryId(created.id);
      setNewCategoryName("");
      setShowAddCategory(false);
      toast.success(`Category "${created.name}" added.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "guest") {
        ensureTrialStarted();
        addGuestExpense({
          type,
          category: guestCategory,
          amount: Number(amount),
          description: description.trim() || undefined,
          spentAt: localDatetimeToISO(spentAt),
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
          type,
          amount: Number(amount),
          description: description.trim() || undefined,
          spentAt: localDatetimeToISO(spentAt),
        };
        await api.createExpense(payload);
      }
      setAmount("");
      setDescription("");
      setBankAccountId("");
      setSpentAt(localDatetimeInputValue());
      toast.success(type === "IN" ? "Income recorded." : "Expense saved.");
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "api" && !currentOrg) {
    return (
      <Card>
        <p className="text-sm text-muted">Select an organization to add transactions.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-ink">Add transaction</h2>
      {mode === "api" && currentOrg ? (
        <p className="mt-1 text-sm text-muted">
          Recording for <span className="font-semibold text-ink">{currentOrg.name}</span>
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-paper p-1">
        <button
          type="button"
          onClick={() => setType("IN")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === "IN"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Money in
        </button>
        <button
          type="button"
          onClick={() => setType("OUT")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === "OUT"
              ? "bg-red-600 text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Money out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-ink">Category</span>
              {mode === "api" ? (
                <button
                  type="button"
                  onClick={() => setShowAddCategory((v) => !v)}
                  className="text-xs font-semibold text-brand hover:text-brand-hover"
                >
                  {showAddCategory ? "Cancel" : "+ Add custom category"}
                </button>
              ) : null}
            </div>
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
                  <option value="">Add a category below to get started</option>
                ) : (
                  categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                )}
              </select>
            )}
            {mode === "api" && showAddCategory ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleAddCategory();
                    }
                  }}
                  placeholder="e.g. Salary, Rent, Petrol"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <Button type="button" disabled={addingCategory} className="shrink-0" onClick={() => void handleAddCategory()}>
                  {addingCategory ? "..." : "Add"}
                </Button>
              </div>
            ) : null}
          </div>
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
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-ink">Date & time</span>
              <button
                type="button"
                onClick={() => setSpentAt(localDatetimeInputValue())}
                className="text-xs font-semibold text-brand hover:text-brand-hover"
              >
                Use now
              </button>
            </div>
            <input
              name="spentAt"
              type="datetime-local"
              required
              value={spentAt}
              onChange={(e) => setSpentAt(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <Input
            label="Description"
            name="description"
            placeholder={type === "IN" ? "e.g. Monthly salary" : "Optional note"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="sm:col-span-2"
          />
        </div>
        <Button type="submit" disabled={loading || (mode === "api" && categories.length === 0 && !showAddCategory)}>
          {loading ? "Saving..." : type === "IN" ? "Record income" : "Record expense"}
        </Button>
      </form>
    </Card>
  );
}
