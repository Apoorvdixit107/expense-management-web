"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryBars, PeriodBars, StatCard } from "@/components/ReportCards";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { isSubscriber } from "@/lib/navigation";
import type { ExpenseReport, ReportPeriod } from "@/lib/types";

const periods: { label: string; value: ReportPeriod }[] = [
  { label: "Last 7 days", value: "LAST_7_DAYS" },
  { label: "Last 30 days", value: "LAST_30_DAYS" },
];

function ReportsContent() {
  const [period, setPeriod] = useState<ReportPeriod>("LAST_7_DAYS");
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [monthly, setMonthly] = useState<ExpenseReport | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    Promise.all([api.reportSummary(period), api.reportMonthly(year)])
      .then(([summaryReport, monthlyReport]) => {
        setSummary(summaryReport);
        setMonthly(monthlyReport);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load reports"));
  }, [period, year]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        subtitle="Analyze spending by period and category"
        action={
          <div className="flex gap-2">
            {periods.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value)}
                className={`h-11 rounded-xl px-5 text-sm font-semibold transition ${
                  period === item.value
                    ? "bg-brand text-white shadow-sm"
                    : "border border-border bg-surface text-ink hover:bg-paper"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <StatCard label={summary?.label ?? "Summary"} value={formatCurrency(summary?.totalAmount ?? 0)} highlight />
        <StatCard label="Transactions" value={String(summary?.transactionCount ?? 0)} />
      </div>

      <Card>
        <h2 className="text-xl font-bold text-ink">By category</h2>
        <div className="mt-6">
          <CategoryBars items={summary?.byCategory ?? []} />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-ink">Monthly trend ({year})</h2>
        <div className="mt-6">
          <PeriodBars items={monthly?.breakdown ?? []} />
        </div>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  const [subscriber, setSubscriber] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSubscriber(isSubscriber());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  if (!subscriber) {
    return (
      <div className="space-y-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-ink">Reports require a plan</h1>
        <p className="text-muted">Subscribe to unlock full analytics and monthly trends.</p>
        <Link href="/manage-plan" className="inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover">
          View plans
        </Link>
      </div>
    );
  }

  return (
    <SubscriberGuard>
      <ReportsContent />
    </SubscriberGuard>
  );
}
