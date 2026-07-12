import { getToken } from "./auth";
import { reportTypeLabel, type OrganizationReport, type OrganizationReportType } from "./reports";
import { logoutClient } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

export async function downloadReportPdf(
  organizationId: number,
  type: OrganizationReportType,
  fromDate: string,
  toDate: string
) {
  const token = getToken();
  const params = new URLSearchParams({ type, fromDate, toDate });
  const response = await fetch(
    `${API_URL}/api/organizations/${organizationId}/reports/pdf?${params}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (response.status === 401) {
    logoutClient();
    if (typeof window !== "undefined") {
      window.location.replace("/login?next=/reports");
    }
    throw new Error("Session expired. Please sign in again.");
  }
  if (!response.ok) throw new Error("Failed to download PDF");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `expensekit-report-${fromDate}-to-${toDate}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadReportExcel(report: OrganizationReport) {
  const category = report.type === "CATEGORY_WISE";
  const headers = category
    ? ["Category", "Total", "Money In", "Money Out", "Opening Balance", "Closing Balance", "Transactions"]
    : ["Date", "Amount", "Money In", "Money Out", "Opening Balance", "Closing Balance", "Flow"];

  const rows = report.rows.map((row) => {
    const label = row.date ? row.date : row.label;
    const sign = row.flow === "IN" ? "+" : "-";
    return category
      ? [label, row.totalAmount, row.totalIn, row.totalOut, row.openingBalance, row.closingBalance, row.transactionCount]
      : [label, `${sign}${row.totalAmount}`, row.totalIn, row.totalOut, row.openingBalance, row.closingBalance, row.flow];
  });

  const csv = [headers, ...rows]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `expensekit-report-${report.fromDate}-to-${report.toDate}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatReportShareText(report: OrganizationReport): string {
  const lines = [
    `ExpenseKit — ${reportTypeLabel(report.type)}`,
    `Organization: ${report.organizationName}`,
    `Period: ${report.fromDate} to ${report.toDate}`,
    `Opening balance: ₹${report.periodOpeningBalance}`,
    `Closing balance: ₹${report.periodClosingBalance}`,
    `Money in: ₹${report.periodTotalIn}`,
    `Money out: ₹${report.periodTotalOut}`,
    "",
    "View full report in ExpenseKit app.",
  ];
  return lines.join("\n");
}

export function shareReportEmail(report: OrganizationReport, toEmail?: string) {
  const subject = encodeURIComponent(
    `ExpenseKit Report — ${report.organizationName} (${report.fromDate} to ${report.toDate})`
  );
  const body = encodeURIComponent(formatReportShareText(report));
  const recipient = toEmail?.trim() ? encodeURIComponent(toEmail.trim()) : "";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

export function shareReportWhatsApp(report: OrganizationReport, phone?: string) {
  const text = encodeURIComponent(formatReportShareText(report));
  const base = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "https://wa.me/";
  window.open(`${base}?text=${text}`, "_blank", "noopener,noreferrer");
}
