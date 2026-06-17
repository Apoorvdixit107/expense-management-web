"use client";

import { useEffect, useState } from "react";
import { CategoryBars, StatCard } from "@/components/ReportCards";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { ExpenseReport, Notification } from "@/lib/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.reportSummary("LAST_7_DAYS"), api.listNotifications()])
      .then(([report, items]) => {
        setSummary(report);
        setNotifications(items.slice(0, 5));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Your spending overview for the last 7 days</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total spent (7 days)" value={formatCurrency(summary?.totalAmount ?? 0)} />
        <StatCard label="Transactions" value={String(summary?.transactionCount ?? 0)} />
        <StatCard label="Top category" value={summary?.byCategory[0]?.category ?? "—"} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Category breakdown</h2>
        <div className="mt-4">
          <CategoryBars items={summary?.byCategory ?? []} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Recent notifications</h2>
        <div className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No notifications yet. Add an expense to get started.</p>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
