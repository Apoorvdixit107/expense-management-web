"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/ReportCards";
import { useOrganization } from "@/components/OrganizationProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { withFeatureGuideAction } from "@/components/FeatureGuide";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { GstSummaryReport, GstTaxCategory, GstTrendGroup } from "@/lib/types";

function defaultDateRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10),
  };
}

export function useGstData(fromDate: string, toDate: string, groupBy: GstTrendGroup) {
  const { currentOrgId } = useOrganization();
  const [categories, setCategories] = useState<GstTaxCategory[]>([]);
  const [summary, setSummary] = useState<GstSummaryReport | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!currentOrgId) {
      setCategories([]);
      setSummary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [cats, report] = await Promise.all([
        api.listTaxCategories(currentOrgId),
        api.getGstSummary(currentOrgId, fromDate, toDate, groupBy),
      ]);
      setCategories(cats);
      setSummary(report);
    } catch (err) {
      showApiError(err, "Failed to load GST data");
      setCategories([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [currentOrgId, fromDate, toDate, groupBy]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { categories, summary, loading, refresh };
}

type TaxCategoryFormProps = {
  onCreated: () => void;
  onCancel: () => void;
};

export function TaxCategoryForm({ onCreated, onCancel }: TaxCategoryFormProps) {
  const { currentOrgId } = useOrganization();
  const [name, setName] = useState("");
  const [rate, setRate] = useState("18");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentOrgId) return;
    const parsedRate = Number(rate);
    if (!name.trim() || Number.isNaN(parsedRate) || parsedRate < 0) {
      toast.error("Enter a valid name and GST rate.");
      return;
    }
    setSaving(true);
    try {
      await api.createTaxCategory(currentOrgId, { name: name.trim(), rate: parsedRate });
      toast.success("Tax category added.");
      onCreated();
    } catch (err) {
      showApiError(err, "Failed to add tax category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-bold text-ink">Custom GST rate</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="Rate (%)"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          required
        />
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add category"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

type GstSummaryCardsProps = {
  summary: GstSummaryReport | null;
};

export function GstSummaryCards({ summary }: GstSummaryCardsProps) {
  if (!summary) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Input tax (ITC)" value={formatCurrency(summary.totalInputTax)} />
      <StatCard label="Output tax" value={formatCurrency(summary.totalOutputTax)} />
      <StatCard
        label="Net GST payable"
        value={formatCurrency(summary.netGstPayable)}
        highlight={summary.netGstPayable > 0}
      />
      <StatCard
        label="Taxable transactions"
        value={`${summary.transactionCount} · ${formatCurrency(summary.totalGrossAmount)}`}
      />
    </div>
  );
}

type GstTrendTableProps = {
  summary: GstSummaryReport | null;
};

export function GstTrendTable({ summary }: GstTrendTableProps) {
  if (!summary || summary.trend.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No GST-tagged transactions in this period.</p>
      </Card>
    );
  }
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-2 py-3 font-semibold">Period</th>
            <th className="px-2 py-3 font-semibold">Input tax</th>
            <th className="px-2 py-3 font-semibold">Output tax</th>
            <th className="px-2 py-3 font-semibold">Net GST</th>
            <th className="px-2 py-3 font-semibold">Txns</th>
          </tr>
        </thead>
        <tbody>
          {summary.trend.map((row) => (
            <tr key={row.periodLabel} className="border-b border-border/60">
              <td className="px-2 py-3 font-medium text-ink">{row.periodLabel}</td>
              <td className="px-2 py-3">{formatCurrency(row.inputTax)}</td>
              <td className="px-2 py-3">{formatCurrency(row.outputTax)}</td>
              <td className="px-2 py-3">{formatCurrency(row.netGstPayable)}</td>
              <td className="px-2 py-3 text-muted">{row.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

type GstRateTableProps = {
  summary: GstSummaryReport | null;
};

export function GstRateTable({ summary }: GstRateTableProps) {
  if (!summary || summary.byRate.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-ink">By GST rate</h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-2 py-3 font-semibold">Rate</th>
              <th className="px-2 py-3 font-semibold">Input tax</th>
              <th className="px-2 py-3 font-semibold">Output tax</th>
              <th className="px-2 py-3 font-semibold">Taxable out</th>
              <th className="px-2 py-3 font-semibold">Taxable in</th>
              <th className="px-2 py-3 font-semibold">Txns</th>
            </tr>
          </thead>
          <tbody>
            {summary.byRate.map((row) => (
              <tr key={String(row.rate)} className="border-b border-border/60">
                <td className="px-2 py-3 font-medium text-ink">{row.rate}%</td>
                <td className="px-2 py-3">{formatCurrency(row.inputTax)}</td>
                <td className="px-2 py-3">{formatCurrency(row.outputTax)}</td>
                <td className="px-2 py-3">{formatCurrency(row.taxableOut)}</td>
                <td className="px-2 py-3">{formatCurrency(row.taxableIn)}</td>
                <td className="px-2 py-3 text-muted">{row.transactionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

type TaxCategoryListProps = {
  categories: GstTaxCategory[];
  onDeleted: () => void;
};

export function TaxCategoryList({ categories, onDeleted }: TaxCategoryListProps) {
  const { currentOrgId } = useOrganization();
  const [deleteTarget, setDeleteTarget] = useState<GstTaxCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!currentOrgId || !deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteTaxCategory(currentOrgId, deleteTarget.id);
      toast.success("Tax category removed.");
      setDeleteTarget(null);
      onDeleted();
    } catch (err) {
      showApiError(err, "Failed to remove tax category");
    } finally {
      setDeleting(false);
    }
  }

  if (categories.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No tax categories yet.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{cat.name}</p>
              <p className="text-sm text-muted">{cat.rate}% GST</p>
            </div>
            <Button type="button" variant="secondary" onClick={() => setDeleteTarget(cat)}>
              Remove
            </Button>
          </Card>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={deleteTarget != null}
        onClose={() => {
          if (deleting) return;
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Remove tax category"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.name}"? Existing transactions keep their stored tax.`
            : ""
        }
        confirmLabel="Remove"
        loading={deleting}
      />
    </>
  );
}

export function GstTaxPageContent() {
  const { currentOrg } = useOrganization();
  const initialRange = useMemo(() => defaultDateRange(), []);
  const [fromDate, setFromDate] = useState(initialRange.fromDate);
  const [toDate, setToDate] = useState(initialRange.toDate);
  const [groupBy, setGroupBy] = useState<GstTrendGroup>("MONTH");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { categories, summary, loading, refresh } = useGstData(fromDate, toDate, groupBy);

  async function handleExport() {
    if (!currentOrg) return;
    setExporting(true);
    try {
      await api.downloadGstSummaryCsv(currentOrg.id, fromDate, toDate, groupBy);
      toast.success("GST summary exported.");
    } catch (err) {
      showApiError(err, "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tax & compliance"
        subtitle={
          currentOrg
            ? `GST summary for ${currentOrg.name}`
            : "Track input tax, output tax, and net payable"
        }
        action={withFeatureGuideAction(
          "tax",
          <div className="flex flex-wrap items-end gap-3">
            <label className="space-y-1 text-sm text-muted">
              From
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="block h-10 rounded-lg border border-border bg-paper px-3 text-sm text-ink"
              />
            </label>
            <label className="space-y-1 text-sm text-muted">
              To
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="block h-10 rounded-lg border border-border bg-paper px-3 text-sm text-ink"
              />
            </label>
            <label className="space-y-1 text-sm text-muted">
              Trend
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GstTrendGroup)}
                className="block h-10 rounded-lg border border-border bg-paper px-3 text-sm text-ink"
              >
                <option value="MONTH">Monthly</option>
                <option value="QUARTER">Quarterly</option>
                <option value="YEAR">Yearly</option>
              </select>
            </label>
            <Button variant="secondary" disabled={exporting || !currentOrg} onClick={() => void handleExport()}>
              {exporting ? "Exporting…" : "Export CSV"}
            </Button>
            <Button onClick={() => setShowCategoryForm((v) => !v)}>
              {showCategoryForm ? "Close" : "Add rate"}
            </Button>
          </div>
        )}
      />

      <Card className="text-sm text-muted">
        Amounts are treated as <span className="font-medium text-ink">tax-inclusive</span>. Expenses
        (OUT) contribute input tax credit; income (IN) contributes output tax.
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-muted">Loading GST summary…</p>
        </Card>
      ) : (
        <>
          <GstSummaryCards summary={summary} />
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">Trend</h2>
            <GstTrendTable summary={summary} />
          </section>
          <GstRateTable summary={summary} />
        </>
      )}

      {showCategoryForm ? (
        <TaxCategoryForm
          onCreated={() => {
            setShowCategoryForm(false);
            void refresh();
          }}
          onCancel={() => setShowCategoryForm(false)}
        />
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">GST categories</h2>
        <TaxCategoryList categories={categories} onDeleted={() => void refresh()} />
      </section>
    </div>
  );
}
