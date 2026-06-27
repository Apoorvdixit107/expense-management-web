"use client";

import { useEffect, useState } from "react";
import {
  OrganizationProfitTable,
  ProfitTrendChart,
} from "@/components/charts/ProfitabilityCharts";
import {
  DashboardChartCard,
  PeriodSelector,
} from "@/components/charts/DashboardCharts";
import { StatCard } from "@/components/ReportCards";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { PageHeader } from "@/components/ui/PageHeader";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import {
  createDefaultDashboardFilter,
  filterToSummaryOptions,
  periodStatLabel,
  type DashboardFilter,
} from "@/lib/dashboard-period";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { ProfitabilityReport } from "@/lib/types";

export default function ProfitPage() {
  const { currentOrg, currentOrgId, organizations } = useOrganization();
  const [filter, setFilter] = useState<DashboardFilter>(createDefaultDashboardFilter);
  const [profitability, setProfitability] = useState<ProfitabilityReport | null>(null);

  useEffect(() => {
    if (!currentOrgId) return;
    const options = filterToSummaryOptions(filter);
    api
      .reportProfitability(filter.period, currentOrgId, options)
      .then(setProfitability)
      .catch((err) => showApiError(err, "Failed to load profitability"));
  }, [
    currentOrgId,
    filter.period,
    filter.monthInput,
    filter.yearInput,
    filter.fromDate,
    filter.toDate,
  ]);

  const profit = profitability?.profit ?? 0;
  const margin = profitability?.profitMarginPercent ?? 0;

  return (
    <SubscriberGuard>
      <div className="space-y-8">
        <PageHeader
          title="Insights"
          subtitle={
            currentOrg
              ? `Income vs spend for ${currentOrg.name}`
              : "Track profitability over time"
          }
          action={<PeriodSelector filter={filter} onChange={setFilter} />}
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Income" value={formatCurrency(profitability?.totalIncome ?? 0)} />
          <StatCard label="Expenses" value={formatCurrency(profitability?.totalExpenses ?? 0)} highlight />
          <StatCard
            label={`Profit (${periodStatLabel(filter)})`}
            value={formatCurrency(profit)}
            highlight={profit >= 0}
          />
          <StatCard
            label="Profit margin"
            value={formatPercent(margin)}
            highlight={margin >= 0}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardChartCard title="Profit trend" subtitle="Income minus expenses over time">
            <ProfitTrendChart items={profitability?.trend ?? []} />
          </DashboardChartCard>

          <DashboardChartCard title="Top expense categories" subtitle="Largest profit drains">
            <div className="space-y-3">
              {(profitability?.topExpenseCategories ?? []).length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">No expense data for this period.</p>
              ) : (
                (profitability?.topExpenseCategories ?? []).map((row) => (
                  <div
                    key={row.category}
                    className="flex items-center justify-between rounded-xl border border-border bg-paper px-4 py-3"
                  >
                    <span className="font-medium text-ink">{row.category}</span>
                    <span className="text-sm text-muted">{formatCurrency(row.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </DashboardChartCard>

          <div className="lg:col-span-2">
            <DashboardChartCard
              title="Profit by organization"
              subtitle="Compare profitability across organizations"
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
