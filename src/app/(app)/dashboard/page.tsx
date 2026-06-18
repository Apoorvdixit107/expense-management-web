"use client";

import { useEffect, useState } from "react";
import {
  CashFlowTrendChart,
  CategoryDonutChart,
  DashboardChartCard,
  PeriodSelector,
  TodayOverviewPanel,
  TopCategoriesChart,
} from "@/components/charts/DashboardCharts";
import { StatCard } from "@/components/ReportCards";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import {
  createDefaultDashboardFilter,
  filterToDateRange,
  filterToSummaryOptions,
  periodDescription,
  periodStatLabel,
  trendChartSubtitle,
  trendChartTitle,
  type DashboardFilter,
} from "@/lib/dashboard-period";
import { formatCurrency } from "@/lib/format";
import type { ExpenseReport, Notification, OrganizationBalanceRange } from "@/lib/types";

export default function DashboardPage() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [filter, setFilter] = useState<DashboardFilter>(createDefaultDashboardFilter);
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [todayReport, setTodayReport] = useState<ExpenseReport | null>(null);
  const [weekTrend, setWeekTrend] = useState<ExpenseReport | null>(null);
  const [balanceSummary, setBalanceSummary] = useState<OrganizationBalanceRange | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentOrgId) return;

    if (filter.period === "CUSTOM_RANGE" && filter.fromDate > filter.toDate) {
      toast.error("End date must be on or after start date.");
      return;
    }

    const options = filterToSummaryOptions(filter);
    const { fromDate, toDate } = filterToDateRange(filter);
    const summaryRequest = api.reportSummary(filter.period, currentOrgId, options);
    const balanceRequest = api.getOrganizationBalanceSummary(currentOrgId, fromDate, toDate);

    Promise.all([
      summaryRequest,
      balanceRequest,
      api.reportSummary("TODAY", currentOrgId),
      filter.period === "TODAY"
        ? api.reportSummary("LAST_7_DAYS", currentOrgId)
        : Promise.resolve(null),
      api.listNotifications(),
    ])
      .then(([periodReport, balance, today, week, items]) => {
        setSummary(periodReport);
        setBalanceSummary(balance);
        setTodayReport(today);
        setWeekTrend(week);
        setNotifications(items.slice(0, 5));
      })
      .catch((err) => showApiError(err, "Failed to load dashboard"));
  }, [
    currentOrgId,
    filter.period,
    filter.monthInput,
    filter.yearInput,
    filter.fromDate,
    filter.toDate,
  ]);

  const periodLabel = periodDescription(filter, summary?.label);
  const trendOutItems =
    filter.period === "TODAY" ? (weekTrend?.breakdown ?? []) : (summary?.breakdown ?? []);
  const trendInItems =
    filter.period === "TODAY" ? (weekTrend?.breakdownIn ?? []) : (summary?.breakdownIn ?? []);
  const moneyIn = summary?.totalInAmount ?? 0;
  const moneyOut = summary?.totalAmount ?? 0;
  const netFlow = moneyIn - moneyOut;

  return (
    <SubscriberGuard>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          subtitle={
            currentOrg
              ? `Cash flow insights for ${currentOrg.name}`
              : "Your cash flow overview"
          }
          action={<PeriodSelector filter={filter} onChange={setFilter} />}
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={`Money in (${periodStatLabel(filter)})`}
            value={formatCurrency(moneyIn)}
          />
          <StatCard
            label={`Money out (${periodStatLabel(filter)})`}
            value={formatCurrency(moneyOut)}
            highlight
          />
          <StatCard
            label={`Net flow (${periodStatLabel(filter)})`}
            value={formatCurrency(netFlow)}
            highlight={netFlow >= 0}
          />
          <StatCard
            label="Transactions"
            value={`${summary?.inTransactionCount ?? 0} in · ${summary?.outTransactionCount ?? 0} out`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Top expense category" value={summary?.byCategory[0]?.category ?? "—"} />
          <StatCard label="Top income category" value={summary?.byCategoryIn[0]?.category ?? "—"} />
          <StatCard
            label="Top category (any)"
            value={
              [summary?.byCategory[0], summary?.byCategoryIn[0]]
                .filter(Boolean)
                .sort((a, b) => (b?.amount ?? 0) - (a?.amount ?? 0))[0]?.category ?? "—"
            }
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={`Opening balance (${periodStatLabel(filter)})`}
            value={formatCurrency(balanceSummary?.openingBalance ?? 0)}
          />
          <StatCard
            label={`Closing balance (${periodStatLabel(filter)})`}
            value={formatCurrency(balanceSummary?.closingBalance ?? 0)}
            highlight
          />
          <StatCard
            label="Money in (period)"
            value={formatCurrency(balanceSummary?.periodTotalIn ?? 0)}
          />
          <StatCard
            label="Money out (period)"
            value={formatCurrency(balanceSummary?.periodTotalOut ?? 0)}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardChartCard title="Today" subtitle="Live cash flow for today">
            <TodayOverviewPanel report={todayReport} />
          </DashboardChartCard>

          <DashboardChartCard
            title="Expenses by category"
            subtitle={`Money out for ${periodLabel}`}
          >
            <CategoryDonutChart
              items={summary?.byCategory ?? []}
              total={moneyOut}
              emptyMessage="No expenses in this period."
              centerLabel="Spent"
            />
          </DashboardChartCard>

          <DashboardChartCard
            title="Income by category"
            subtitle={`Money in for ${periodLabel}`}
          >
            <CategoryDonutChart
              items={summary?.byCategoryIn ?? []}
              total={moneyIn}
              emptyMessage="No income in this period."
              centerLabel="Earned"
            />
          </DashboardChartCard>

          <DashboardChartCard title={trendChartTitle(filter)} subtitle={trendChartSubtitle(filter)}>
            <CashFlowTrendChart outItems={trendOutItems} inItems={trendInItems} title="" />
          </DashboardChartCard>

          <DashboardChartCard title="Top expense categories" subtitle={`Highest spend for ${periodLabel}`}>
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
