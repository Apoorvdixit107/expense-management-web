import type { DashboardPeriod, ReportSummaryOptions } from "./types";

export type DashboardFilter = {
  period: DashboardPeriod;
  /** YYYY-MM for month picker */
  monthInput: string;
  yearInput: number;
  fromDate: string;
  toDate: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function localDateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function createDefaultDashboardFilter(): DashboardFilter {
  const now = new Date();
  const today = localDateString(now);
  const monthAgo = new Date(now);
  monthAgo.setDate(monthAgo.getDate() - 29);
  return {
    period: "LAST_7_DAYS",
    monthInput: `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`,
    yearInput: now.getFullYear(),
    fromDate: localDateString(monthAgo),
    toDate: today,
  };
}

export function filterToSummaryOptions(filter: DashboardFilter): ReportSummaryOptions {
  switch (filter.period) {
    case "MONTH": {
      const [year, month] = filter.monthInput.split("-").map(Number);
      return { year, month };
    }
    case "YEAR":
      return { year: filter.yearInput };
    case "CUSTOM_RANGE":
      return { fromDate: filter.fromDate, toDate: filter.toDate };
    default:
      return {};
  }
}

export function periodStatLabel(filter: DashboardFilter): string {
  switch (filter.period) {
    case "TODAY":
      return "today";
    case "LAST_7_DAYS":
      return "7 days";
    case "LAST_30_DAYS":
      return "30 days";
    case "MONTH": {
      const [year, month] = filter.monthInput.split("-").map(Number);
      return new Date(year, month - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
    }
    case "YEAR":
      return String(filter.yearInput);
    case "CUSTOM_RANGE":
      return "custom range";
    default:
      return "period";
  }
}

export function periodDescription(filter: DashboardFilter, reportLabel?: string): string {
  if (reportLabel) return reportLabel;
  switch (filter.period) {
    case "TODAY":
      return "today";
    case "LAST_7_DAYS":
      return "the last 7 days";
    case "LAST_30_DAYS":
      return "the last 30 days";
    case "MONTH":
      return periodStatLabel(filter);
    case "YEAR":
      return `year ${filter.yearInput}`;
    case "CUSTOM_RANGE":
      return `${filter.fromDate} to ${filter.toDate}`;
    default:
      return "this period";
  }
}

export function trendChartTitle(filter: DashboardFilter): string {
  switch (filter.period) {
    case "TODAY":
      return "7-day trend";
    case "YEAR":
      return "Monthly trend";
    case "MONTH":
      return "Daily trend";
    case "CUSTOM_RANGE":
      return "Spending trend";
    default:
      return "Spending trend";
  }
}

export function trendChartSubtitle(filter: DashboardFilter): string {
  switch (filter.period) {
    case "TODAY":
      return "Daily spending over the last week";
    case "YEAR":
      return "Month-wise totals for the selected year";
    case "MONTH":
      return "Day-wise totals for the selected month";
    case "CUSTOM_RANGE":
      return "Day-wise totals for your custom range";
    case "LAST_7_DAYS":
      return "Daily spending over the last 7 days";
    case "LAST_30_DAYS":
      return "Daily spending over the last 30 days";
    default:
      return "";
  }
}
