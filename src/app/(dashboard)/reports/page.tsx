"use client";

import { useEffect, useState } from "react";
import { CategoryBars, PeriodBars, StatCard } from "@/components/ReportCards";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { ExpenseReport, ReportPeriod } from "@/lib/types";

const periods: { label: string; value: ReportPeriod }[] = [
  { label: "Last 7 days", value: "LAST_7_DAYS" },
  { label: "Last 30 days", value: "LAST_30_DAYS" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("LAST_7_DAYS");
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [monthly, setMonthly] = useState<ExpenseReport | null>(null);
  const [error, setError] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    setError("");
    Promise.all([api.reportSummary(period), api.reportMonthly(year)])
      .then(([summaryReport, monthlyReport]) => {
        setSummary(summaryReport);
        setMonthly(monthlyReport);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports"));
  }, [period, year]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">Analyze spending by period and category</p>
        </div>
        <div className="flex gap-2">
          {periods.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                period === item.value ? "bg-teal-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label={summary?.label ?? "Summary"} value={formatCurrency(summary?.totalAmount ?? 0)} />
        <StatCard label="Transactions" value={String(summary?.transactionCount ?? 0)} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">By category</h2>
        <div className="mt-4">
          <CategoryBars items={summary?.byCategory ?? []} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Monthly trend ({year})</h2>
        <div className="mt-4">
          <PeriodBars items={monthly?.breakdown ?? []} />
        </div>
      </section>
    </div>
  );
}
