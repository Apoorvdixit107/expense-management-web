"use client";

import { useEffect, useState } from "react";
import {
  CategoryDonutChart,
  DashboardChartCard,
  PeriodSelector,
  SpendingTrendChart,
  TodayOverviewPanel,
  TopCategoriesChart,
} from "@/components/charts/DashboardCharts";
import { StatCard } from "@/components/ReportCards";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { ExpenseReport, Notification, ReportPeriod } from "@/lib/types";

type DashboardPeriod = Extract<ReportPeriod, "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS">;

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  TODAY: "today",
  LAST_7_DAYS: "the last 7 days",
  LAST_30_DAYS: "the last 30 days",
};

export default function DashboardPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [period, setPeriod] = useState<DashboardPeriod>("LAST_7_DAYS");
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [todayReport, setTodayReport] = useState<ExpenseReport | null>(null);
  const [weekTrend, setWeekTrend] = useState<ExpenseReport | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentOrgId) return;
    Promise.all([
      api.reportSummary(period, currentOrgId),
      api.reportSummary("TODAY", currentOrgId),
      api.reportSummary("LAST_7_DAYS", currentOrgId),
      api.listNotifications(),
    ])
      .then(([periodReport, today, week, items]) => {
        setSummary(periodReport);
        setTodayReport(today);
        setWeekTrend(week);
        setNotifications(items.slice(0, 5));
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, [currentOrgId, period]);

  const periodLabel = PERIOD_LABELS[period];

  return (
    <SubscriberGuard>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          subtitle={
            currentOrg
              ? `Spending insights for ${currentOrg.name}`
              : "Your spending overview"
          }
          action={<PeriodSelector value={period} onChange={setPeriod} />}
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label={`Total spent (${period === "TODAY" ? "today" : period === "LAST_7_DAYS" ? "7 days" : "30 days"})`}
            value={formatCurrency(summary?.totalAmount ?? 0)}
            highlight
          />
          <StatCard label="Transactions" value={String(summary?.transactionCount ?? 0)} />
          <StatCard label="Top category" value={summary?.byCategory[0]?.category ?? "—"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardChartCard title="Today" subtitle="Live spending for today">
            <TodayOverviewPanel report={todayReport} />
          </DashboardChartCard>

          <DashboardChartCard
            title="Expense by category"
            subtitle={`Share of spend for ${periodLabel}`}
          >
            <CategoryDonutChart
              items={summary?.byCategory ?? []}
              total={summary?.totalAmount ?? 0}
            />
          </DashboardChartCard>

          <DashboardChartCard title="7-day trend" subtitle="Daily spending over the last week">
            <SpendingTrendChart items={weekTrend?.breakdown ?? []} title="" />
          </DashboardChartCard>

          <DashboardChartCard title="Top categories" subtitle={`Highest spend for ${periodLabel}`}>
            <TopCategoriesChart items={summary?.byCategory ?? []} />
          </DashboardChartCard>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-ink">Recent notifications</h2>
          <div className="mt-4 space-y-3">
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
