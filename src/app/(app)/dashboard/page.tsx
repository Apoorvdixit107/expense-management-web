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
import {
  OrganizationProfitTable,
  ProfitTrendChart,
} from "@/components/charts/ProfitabilityCharts";
import { StatCard } from "@/components/ReportCards";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
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
import { formatCurrency, formatPercent } from "@/lib/format";
import type { ExpenseReport, ProfitabilityReport } from "@/lib/types";

export default function DashboardPage() {
  const { currentOrg, currentOrgId, organizations } = useOrganization();
  const [filter, setFilter] = useState<DashboardFilter>(createDefaultDashboardFilter);
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [todayReport, setTodayReport] = useState<ExpenseReport | null>(null);
  const [weekTrend, setWeekTrend] = useState<ExpenseReport | null>(null);
  const [profitability, setProfitability] = useState<ProfitabilityReport | null>(null);

  useEffect(() => {
    if (!currentOrgId) return;

    if (filter.period === "CUSTOM_RANGE" && filter.fromDate > filter.toDate) {
      toast.error("End date must be on or after start date.");
      return;
    }

    const options = filterToSummaryOptions(filter);

    Promise.all([
      api.reportSummary(filter.period, currentOrgId, options),
      api.reportProfitability(filter.period, currentOrgId, options),
      api.reportSummary("TODAY", currentOrgId),
      filter.period === "TODAY"
        ? api.reportSummary("LAST_7_DAYS", currentOrgId)
        : Promise.resolve(null),
    ])
      .then(([periodReport, profitReport, today, week]) => {
        setSummary(periodReport);
        setProfitability(profitReport);
        setTodayReport(today);
        setWeekTrend(week);
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
  const totalIn = summary?.totalInAmount ?? 0;
  const totalOut = summary?.totalAmount ?? 0;
  const profit = profitability?.profit ?? totalIn - totalOut;
  const profitMargin = profitability?.profitMarginPercent ?? 0;

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
            value={formatCurrency(totalIn)}
          />
          <StatCard
            label={`Money out (${periodStatLabel(filter)})`}
            value={formatCurrency(totalOut)}
            highlight
          />
          <StatCard
            label={`Profit (${periodStatLabel(filter)})`}
            value={formatCurrency(profit)}
            highlight={profit >= 0}
          />
          <StatCard
            label={`Profit margin (${periodStatLabel(filter)})`}
            value={formatPercent(profitMargin)}
            highlight={profitMargin >= 0}
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
              total={totalOut}
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
              total={totalIn}
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

          <DashboardChartCard
            title="Profit trend"
            subtitle={`Income minus expenses for ${periodLabel}`}
          >
            <ProfitTrendChart items={profitability?.trend ?? []} />
          </DashboardChartCard>

          <div className="lg:col-span-2">
            <DashboardChartCard
              title="Profit by organization"
              subtitle="Compare profitability across your organizations"
            >
              <OrganizationProfitTable
                rows={profitability?.organizationComparison ?? []}
                organizations={organizations}
                currentOrgId={currentOrgId}
              />
            </DashboardChartCard>
          </div>
        </div>
      </div>
    </SubscriberGuard>
  );
}
