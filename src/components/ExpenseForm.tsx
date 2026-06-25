"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useOrganization } from "@/components/OrganizationProvider";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { isoToLocalDatetimeInput, localDatetimeInputValue, localDatetimeToISO, formatCurrency } from "@/lib/format";
import { splitInclusiveGst } from "@/lib/gst";
import { addGuestExpense } from "@/lib/guest";
import { ensureTrialStarted } from "@/lib/trial";
import {
  EXPENSE_CATEGORIES,
  type BankAccount,
  type BillScanPrefill,
  type CreateExpenseRequest,
  type Expense,
  type ExpenseCategory,
  type ExpenseType,
  type GstTaxCategory,
  type PaymentMode,
  type UpdateExpenseRequest,
} from "@/lib/types";

type ExpenseFormProps = {
  mode: "api" | "guest";
  defaultType?: ExpenseType;
  billPrefill?: BillScanPrefill | null;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
  onCreated: () => void;
};

function defaultFormState(type: ExpenseType = "OUT") {
  return {
    type,
    categoryId: "" as number | "",
    bankAccountId: "" as number | "",
    paymentMode: "CASH" as PaymentMode,
    amount: "",
    description: "",
    spentAt: localDatetimeInputValue(),
    guestCategory: EXPENSE_CATEGORIES[0],
    taxCategoryId: "" as number | "",
  };
}

export function ExpenseForm({
  mode,
  defaultType = "OUT",
  billPrefill,
  editingExpense,
  onCancelEdit,
  onCreated,
}: ExpenseFormProps) {
  const { currentOrg, currentOrgId } = useOrganization();
  const submittingRef = useRef(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [taxCategories, setTaxCategories] = useState<GstTaxCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [type, setType] = useState<ExpenseType>("OUT");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [bankAccountId, setBankAccountId] = useState<number | "">("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [spentAt, setSpentAt] = useState(() => localDatetimeInputValue());
  const [loading, setLoading] = useState(false);
  const [guestCategory, setGuestCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [taxCategoryId, setTaxCategoryId] = useState<number | "">("");

  const isEditing = mode === "api" && editingExpense != null;

  const selectedGstRate =
    taxCategoryId !== ""
      ? taxCategories.find((c) => c.id === taxCategoryId)?.rate ?? 0
      : 0;

  const taxPreview = useMemo(() => {
    const total = Number(amount);
    if (!total || total <= 0 || selectedGstRate <= 0) return null;
    return splitInclusiveGst(total, selectedGstRate);
  }, [amount, selectedGstRate]);

  const resetForm = useCallback(() => {
    const defaults = defaultFormState(defaultType);
    setType(defaults.type);
    setCategoryId(defaults.categoryId);
    setBankAccountId(defaults.bankAccountId);
    setPaymentMode(defaults.paymentMode);
    setAmount(defaults.amount);
    setDescription(defaults.description);
    setSpentAt(defaults.spentAt);
    setGuestCategory(defaults.guestCategory);
    setTaxCategoryId(defaults.taxCategoryId);
    setShowAddCategory(false);
    setNewCategoryName("");
  }, [defaultType]);

  useEffect(() => {
    if (editingExpense) return;
    setType(defaultType);
  }, [defaultType, editingExpense]);

  useEffect(() => {
    if (!editingExpense) return;
    setType(editingExpense.type);
    setCategoryId(editingExpense.categoryId ?? "");
    setBankAccountId(editingExpense.bankAccountId ?? "");
    setPaymentMode(editingExpense.paymentMode ?? "CASH");
    setAmount(String(editingExpense.amount));
    setDescription(editingExpense.description ?? "");
    setSpentAt(isoToLocalDatetimeInput(editingExpense.spentAt));
    setTaxCategoryId(editingExpense.taxCategoryId ?? "");
  }, [editingExpense]);

  useEffect(() => {
    if (!billPrefill || editingExpense) return;
    if (billPrefill.amount) setAmount(billPrefill.amount);
    if (billPrefill.description) setDescription(billPrefill.description);
    if (billPrefill.categoryId) setCategoryId(billPrefill.categoryId);
    if (billPrefill.spentAt) {
      const normalized = billPrefill.spentAt.includes("T")
        ? billPrefill.spentAt.length === 16
          ? `${billPrefill.spentAt}:00`
          : billPrefill.spentAt
        : `${billPrefill.spentAt}T12:00:00`;
      try {
        setSpentAt(isoToLocalDatetimeInput(new Date(normalized).toISOString()));
      } catch {
        setSpentAt(localDatetimeInputValue());
      }
    }
  }, [billPrefill, editingExpense]);

  const loadCategories = useCallback(async () => {
    if (!currentOrgId) return;
    const cats = await api.listCategories(currentOrgId);
    setCategories(cats);
    if (!isEditing && cats.length > 0) {
      setCategoryId((prev) => (prev !== "" && cats.some((c) => c.id === prev) ? prev : cats[0].id));
    }
  }, [currentOrgId, isEditing]);

  useEffect(() => {
    if (mode !== "api" || !currentOrgId) return;
    Promise.all([loadCategories(), api.listBankAccounts(currentOrgId), api.listTaxCategories(currentOrgId)])
      .then(([, banks, taxCats]) => {
        setBankAccounts(banks);
        setTaxCategories(taxCats);
      })
      .catch(() => {
        setCategories([]);
        setBankAccounts([]);
        setTaxCategories([]);
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
      showApiError(err, "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
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
        const shared = {
          categoryId: Number(categoryId),
          bankAccountId: bankAccountId === "" ? undefined : Number(bankAccountId),
          type,
          paymentMode: bankAccountId !== "" ? "BANK" : paymentMode,
          amount: Number(amount),
          description: description.trim() || undefined,
          spentAt: localDatetimeToISO(spentAt),
          taxCategoryId: taxCategoryId === "" ? undefined : Number(taxCategoryId),
        };

        if (isEditing && editingExpense) {
          await api.updateExpense(editingExpense.id, shared as UpdateExpenseRequest);
        } else {
          const payload: CreateExpenseRequest = {
            organizationId: currentOrgId,
            ...shared,
          };
          await api.createExpense(payload);
        }
      }

      if (!isEditing) {
        setAmount("");
        setDescription("");
        setBankAccountId("");
        setPaymentMode("CASH");
        setTaxCategoryId("");
        setSpentAt(localDatetimeInputValue());
      }

      toast.success(
        isEditing
          ? "Transaction updated."
          : type === "IN"
            ? "Income recorded."
            : "Expense saved."
      );
      onCreated();
    } catch (err) {
      showApiError(err, "Failed to save transaction");
    } finally {
      submittingRef.current = false;
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
    <div id="expense-form">
    <Card>
      <h2 className="text-xl font-bold text-ink">
        {isEditing ? "Edit transaction" : billPrefill ? "Verify & create transaction" : "Add transaction"}
      </h2>
      {billPrefill ? (
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
          Review AI-extracted fields. Edit anything that looks wrong, then save.
        </p>
      ) : null}
      {mode === "api" && currentOrg ? (
        <p className="mt-1 text-sm text-muted">
          {isEditing ? "Updating entry for" : "Recording for"}{" "}
          <span className="font-semibold text-ink">{currentOrg.name}</span>
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-paper p-1">
        <button
          type="button"
          onClick={() => setType("IN")}
          disabled={loading}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === "IN"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Income
        </button>
        <button
          type="button"
          onClick={() => setType("OUT")}
          disabled={loading}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === "OUT"
              ? "bg-red-600 text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Expense
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
                disabled={loading}
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
                disabled={loading}
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
          {mode === "api" ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Payment type</span>
              <select
                value={bankAccountId !== "" ? "BANK" : paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                disabled={loading || bankAccountId !== ""}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
              >
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online</option>
                <option value="BANK">Bank</option>
              </select>
              {bankAccountId !== "" ? (
                <p className="text-xs text-muted">Payment type is Bank when a bank account is selected.</p>
              ) : null}
            </label>
          ) : null}
          {mode === "api" && bankAccounts.length > 0 ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Bank account (optional)</span>
              <select
                value={bankAccountId}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : "";
                  setBankAccountId(value);
                  if (value !== "") setPaymentMode("BANK");
                }}
                disabled={loading}
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
            disabled={loading}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {mode === "api" && taxCategories.length > 0 ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">GST category (optional)</span>
              <select
                value={taxCategoryId}
                onChange={(e) =>
                  setTaxCategoryId(e.target.value ? Number(e.target.value) : "")
                }
                disabled={loading}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="">No GST</option>
                {taxCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {taxPreview ? (
                <p className="text-xs text-muted">
                  Taxable {formatCurrency(taxPreview.taxableAmount)} + GST{" "}
                  {formatCurrency(taxPreview.taxAmount)} ({selectedGstRate}% inclusive)
                </p>
              ) : null}
            </label>
          ) : null}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-ink">Date & time</span>
              <button
                type="button"
                onClick={() => setSpentAt(localDatetimeInputValue())}
                disabled={loading}
                className="text-xs font-semibold text-brand hover:text-brand-hover"
              >
                Use now
              </button>
            </div>
            <input
              name="spentAt"
              type="datetime-local"
              required
              disabled={loading}
              value={spentAt}
              onChange={(e) => setSpentAt(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <Input
            label="Description"
            name="description"
            placeholder={type === "IN" ? "e.g. Monthly salary" : "Optional note"}
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="sm:col-span-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={loading || (mode === "api" && categories.length === 0 && !showAddCategory && !isEditing)}
          >
            {loading
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : type === "IN"
                  ? "Record income"
                  : "Record expense"}
          </Button>
          {isEditing && onCancelEdit ? (
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
    </div>
  );
}
