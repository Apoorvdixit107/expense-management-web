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
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Expense, ExpenseReport, ProfitabilityReport, SpendOverviewStats } from "@/lib/types";
import Link from "next/link";
import { OrgRequiredState } from "@/components/OrgRequiredState";

export default function DashboardPage() {
  const { currentOrg, currentOrgId, organizations } = useOrganization();
  const [filter, setFilter] = useState<DashboardFilter>(createDefaultDashboardFilter);
  const [summary, setSummary] = useState<ExpenseReport | null>(null);
  const [todayReport, setTodayReport] = useState<ExpenseReport | null>(null);
  const [weekTrend, setWeekTrend] = useState<ExpenseReport | null>(null);
  const [profitability, setProfitability] = useState<ProfitabilityReport | null>(null);
  const [spendOverview, setSpendOverview] = useState<SpendOverviewStats | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<Expense[]>([]);

  useEffect(() => {
    if (!currentOrgId) return;

    if (filter.period === "CUSTOM_RANGE" && filter.fromDate > filter.toDate) {
      toast.error("End date must be on or after start date.");
      return;
    }

    const options = filterToSummaryOptions(filter);
    const { fromDate, toDate } = filterToDateRange(filter);

    Promise.all([
      api.reportSummary(filter.period, currentOrgId, options),
      api.reportProfitability(filter.period, currentOrgId, options),
      api.reportSummary("TODAY", currentOrgId),
      filter.period === "TODAY"
        ? api.reportSummary("LAST_7_DAYS", currentOrgId)
        : Promise.resolve(null),
      api.getSpendOverview(currentOrgId, fromDate, toDate).catch(() => null),
      api.listPendingApprovals(currentOrgId).catch(() => []),
    ])
      .then(([periodReport, profitReport, today, week, overview, pending]) => {
        setSummary(periodReport);
        setProfitability(profitReport);
        setTodayReport(today);
        setWeekTrend(week);
        setSpendOverview(overview);
        setPendingApprovals(pending.slice(0, 5));
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
    <OrgRequiredState>
      <div className="space-y-8">
        <PageHeader
          title="Overview"
          subtitle="Your spend command center"
          action={<PeriodSelector filter={filter} onChange={setFilter} />}
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={`Spend (${periodStatLabel(filter)})`} value={formatCurrency(spendOverview?.totalSpendOut ?? totalOut)} highlight />
          <StatCard
            label="Pending approvals"
            value={String(spendOverview?.pendingApprovals ?? 0)}
          />
          <StatCard
            label="Policy flags"
            value={String(spendOverview?.policyFlags ?? 0)}
          />
          <StatCard
            label={`Profit margin (${periodStatLabel(filter)})`}
            value={formatPercent(profitMargin)}
            highlight={profitMargin >= 0}
          />
        </div>

        {pendingApprovals.length > 0 ? (
          <DashboardChartCard title="Pending approvals" subtitle="Top items awaiting finance review">
            <ul className="divide-y divide-border">
              {pendingApprovals.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <span>
                    {item.category} · {item.description || "No description"}
                  </span>
                  <span className="font-semibold text-ink">{formatCurrency(item.amount)}</span>
                </li>
              ))}
            </ul>
            <Link href="/approvals" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
              View all approvals →
            </Link>
          </DashboardChartCard>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={`Money in (${periodStatLabel(filter)})`} value={formatCurrency(totalIn)} />
          <StatCard label={`Profit (${periodStatLabel(filter)})`} value={formatCurrency(profit)} highlight={profit >= 0} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardChartCard title="Today" subtitle="Live cash flow for today">
            <TodayOverviewPanel report={todayReport} />
          </DashboardChartCard>

          <DashboardChartCard
            title="Spend by category"
            subtitle={`Outbound payments for ${periodLabel}`}
          >
            <CategoryDonutChart
              items={summary?.byCategory ?? []}
              total={totalOut}
              emptyMessage="No spend in this period."
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
    </OrgRequiredState>
  );
}
