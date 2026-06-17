"use client";

import { useEffect, useState } from "react";
import { CategoryBars, StatCard } from "@/components/ReportCards";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { ExpenseReport, Notification } from "@/lib/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    Promise.all([api.reportSummary("LAST_7_DAYS"), api.listNotifications()])
      .then(([report, items]) => {
        setSummary(report);
        setNotifications(items.slice(0, 5));
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, []);

  return (
    <SubscriberGuard>
      <div className="space-y-8">
        <PageHeader title="Dashboard" subtitle="Your spending overview for the last 7 days" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total spent (7 days)" value={formatCurrency(summary?.totalAmount ?? 0)} highlight />
          <StatCard label="Transactions" value={String(summary?.transactionCount ?? 0)} />
          <StatCard label="Top category" value={summary?.byCategory[0]?.category ?? "—"} />
        </div>

        <Card>
          <h2 className="text-xl font-bold text-ink">Category breakdown</h2>
          <div className="mt-6">
            <CategoryBars items={summary?.byCategory ?? []} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-ink">Recent notifications</h2>
          <div className="mt-6 space-y-3">
            {notifications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-paper px-4 py-8 text-center text-sm text-muted">
                No notifications yet.
              </p>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-paper px-4 py-4">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </SubscriberGuard>
  );
}
