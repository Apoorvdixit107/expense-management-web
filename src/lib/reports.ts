export type OrganizationReportType =
  | "ORGANIZATION_BALANCE"
  | "DATE_WISE_IN"
  | "DATE_WISE_OUT"
  | "CATEGORY_WISE";

export type ReportDateMode = "single" | "range" | "custom";

export type ReportDateFilter = {
  mode: ReportDateMode;
  singleDate: string;
  fromDate: string;
  toDate: string;
  rangePreset: "LAST_7_DAYS" | "LAST_30_DAYS" | "MONTH" | "YEAR";
  monthInput: string;
  yearInput: number;
};

export type OrganizationReportRow = {
  date: string | null;
  label: string;
  totalAmount: number;
  totalIn: number;
  totalOut: number;
  openingBalance: number;
  closingBalance: number;
  transactionCount: number;
  flow: "IN" | "OUT";
};

export type OrganizationReport = {
  type: OrganizationReportType;
  organizationId: number;
  organizationName: string;
  fromDate: string;
  toDate: string;
  periodOpeningBalance: number;
  periodClosingBalance: number;
  periodTotalIn: number;
  periodTotalOut: number;
  periodTotalAmount: number;
  rows: OrganizationReportRow[];
};

export const REPORT_TYPE_OPTIONS: { value: OrganizationReportType; label: string }[] = [
  { value: "ORGANIZATION_BALANCE", label: "Date-wise organization balance" },
  { value: "DATE_WISE_OUT", label: "Date-wise money out" },
  { value: "DATE_WISE_IN", label: "Date-wise money in" },
  { value: "CATEGORY_WISE", label: "Category-wise report" },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function createDefaultReportDateFilter(): ReportDateFilter {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  return {
    mode: "range",
    singleDate: localDateString(now),
    fromDate: localDateString(weekAgo),
    toDate: localDateString(now),
    rangePreset: "LAST_7_DAYS",
    monthInput: `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`,
    yearInput: now.getFullYear(),
  };
}

export function resolveReportDateRange(filter: ReportDateFilter): { fromDate: string; toDate: string } {
  const today = localDateString();

  if (filter.mode === "single") {
    return { fromDate: filter.singleDate, toDate: filter.singleDate };
  }

  if (filter.mode === "custom") {
    return { fromDate: filter.fromDate, toDate: filter.toDate };
  }

  const now = new Date();
  switch (filter.rangePreset) {
    case "LAST_7_DAYS": {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      return { fromDate: localDateString(from), toDate: today };
    }
    case "LAST_30_DAYS": {
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      return { fromDate: localDateString(from), toDate: today };
    }
    case "MONTH": {
      const [year, month] = filter.monthInput.split("-").map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      return {
        fromDate: `${year}-${pad2(month)}-01`,
        toDate: `${year}-${pad2(month)}-${pad2(lastDay)}`,
      };
    }
    case "YEAR":
      return {
        fromDate: `${filter.yearInput}-01-01`,
        toDate: `${filter.yearInput}-12-31`,
      };
    default:
      return { fromDate: filter.fromDate, toDate: filter.toDate };
  }
}

export function reportTypeLabel(type: OrganizationReportType): string {
  return REPORT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}
