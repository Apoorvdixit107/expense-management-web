"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/ReportCards";
import { ReportDateFilter as ReportDateFilterBar } from "@/components/reports/ReportDateFilter";
import { ReportExportBar } from "@/components/reports/ReportExportBar";
import { ReportTable } from "@/components/reports/ReportTable";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureGuideTrigger } from "@/components/FeatureGuide";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  createDefaultReportDateFilter,
  REPORT_TYPE_OPTIONS,
  resolveReportDateRange,
  type OrganizationReport,
  type OrganizationReportType,
  type ReportDateFilter as ReportDateFilterState,
} from "@/lib/reports";

function ReportsContent() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [reportType, setReportType] = useState<OrganizationReportType>("ORGANIZATION_BALANCE");
  const [dateFilter, setDateFilter] = useState<ReportDateFilterState>(createDefaultReportDateFilter);
  const [report, setReport] = useState<OrganizationReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const { fromDate, toDate } = useMemo(() => resolveReportDateRange(dateFilter), [dateFilter]);
  const periodProfit = (report?.periodTotalIn ?? 0) - (report?.periodTotalOut ?? 0);
  const periodMargin =
    (report?.periodTotalIn ?? 0) > 0 ? (periodProfit / (report?.periodTotalIn ?? 1)) * 100 : 0;

  useEffect(() => {
    if (!currentOrgId) {
      setReport(null);
      setReportLoading(false);
      return;
    }
    if (fromDate > toDate) {
      toast.error("End date must be on or after start date.");
      return;
    }

    setReportLoading(true);
    api
      .getOrganizationReport(currentOrgId, reportType, fromDate, toDate)
      .then((data) => setReport(data))
      .catch((err) => showApiError(err, "Failed to load report"))
      .finally(() => setReportLoading(false));
  }, [currentOrgId, reportType, fromDate, toDate]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        subtitle={
          currentOrg
            ? `Financial reports for ${currentOrg.name}`
            : "Select an organization to view reports"
        }
        action={<FeatureGuideTrigger guideId="reports" />}
      />

      <Card className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-ink">Report type</span>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as OrganizationReportType)}
            className="h-11 w-full max-w-md rounded-xl border border-border bg-paper px-3 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {REPORT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <ReportDateFilterBar filter={dateFilter} onChange={setDateFilter} />
      </Card>

      {currentOrgId ? (
        <ReportExportBar
          organizationId={currentOrgId}
          reportType={reportType}
          fromDate={fromDate}
          toDate={toDate}
          report={report}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Opening balance" value={formatCurrency(report?.periodOpeningBalance ?? 0)} />
        <StatCard
          label="Closing balance"
          value={formatCurrency(report?.periodClosingBalance ?? 0)}
          highlight
        />
        <StatCard label="Money in" value={formatCurrency(report?.periodTotalIn ?? 0)} />
        <StatCard label="Money out" value={formatCurrency(report?.periodTotalOut ?? 0)} />
        <StatCard
          label="Profit"
          value={formatCurrency(periodProfit)}
          highlight={periodProfit >= 0}
        />
        <StatCard label="Profit margin" value={formatPercent(periodMargin)} highlight={periodMargin >= 0} />
      </div>

      <Card>
        <h2 className="text-xl font-bold text-ink">Report data</h2>
        <p className="mt-1 text-sm text-muted">
          {fromDate === toDate ? `For ${fromDate}` : `${fromDate} to ${toDate}`}
        </p>
        <div className="mt-6">
          {!currentOrgId ? (
            <p className="rounded-xl border border-dashed border-border bg-paper px-6 py-12 text-center text-sm text-muted">
              <Link href="/select-account" className="font-semibold text-brand hover:underline">
                Select an organization
              </Link>{" "}
              to view reports.
            </p>
          ) : (
            <ReportTable report={report} loading={reportLoading} />
          )}
        </div>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <SubscriberGuard featureName="Reports">
      <ReportsContent />
    </SubscriberGuard>
  );
}
