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
import {
  createDefaultDashboardFilter,
  filterToSummaryOptions,
  periodDescription,
  periodStatLabel,
  trendChartSubtitle,
  trendChartTitle,
  type DashboardFilter,
} from "@/lib/dashboard-period";
import { formatCurrency } from "@/lib/format";
import type { ExpenseReport, Notification } from "@/lib/types";

export default function DashboardPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [filter, setFilter] = useState<DashboardFilter>(createDefaultDashboardFilter);
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [todayReport, setTodayReport] = useState<ExpenseReport | null>(null);
  const [weekTrend, setWeekTrend] = useState<ExpenseReport | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentOrgId) return;

    if (filter.period === "CUSTOM_RANGE" && filter.fromDate > filter.toDate) {
      toast.error("End date must be on or after start date.");
      return;
    }

    const options = filterToSummaryOptions(filter);
    const summaryRequest = api.reportSummary(filter.period, currentOrgId, options);

    Promise.all([
      summaryRequest,
      api.reportSummary("TODAY", currentOrgId),
      filter.period === "TODAY"
        ? api.reportSummary("LAST_7_DAYS", currentOrgId)
        : Promise.resolve(null),
      api.listNotifications(),
    ])
      .then(([periodReport, today, week, items]) => {
        setSummary(periodReport);
        setTodayReport(today);
        setWeekTrend(week);
        setNotifications(items.slice(0, 5));
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, [
    currentOrgId,
    filter.period,
    filter.monthInput,
    filter.yearInput,
    filter.fromDate,
    filter.toDate,
  ]);

  const periodLabel = periodDescription(filter, summary?.label);
  const trendItems =
    filter.period === "TODAY" ? (weekTrend?.breakdown ?? []) : (summary?.breakdown ?? []);

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
          action={<PeriodSelector filter={filter} onChange={setFilter} />}
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label={`Total spent (${periodStatLabel(filter)})`}
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

          <DashboardChartCard title={trendChartTitle(filter)} subtitle={trendChartSubtitle(filter)}>
            <SpendingTrendChart items={trendItems} title="" />
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
