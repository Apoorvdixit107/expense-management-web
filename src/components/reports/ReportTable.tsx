"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import type { OrganizationReport } from "@/lib/reports";

function FlowSign({ flow, amount }: { flow: "IN" | "OUT"; amount: number }) {
  const isIn = flow === "IN";
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${isIn ? "text-emerald-600" : "text-red-600"}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        {isIn ? (
          <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
      {isIn ? "+" : "−"}
      {formatCurrency(amount)}
    </span>
  );
}

export function ReportTable({ report }: { report: OrganizationReport | null }) {
  if (!report) {
    return <p className="py-12 text-center text-sm text-muted">Loading report...</p>;
  }

  if (report.rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-paper px-6 py-12 text-center text-sm text-muted">
        No data found for this period.
      </p>
    );
  }

  const category = report.type === "CATEGORY_WISE";

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-brand text-left text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">{category ? "Category" : "Date"}</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Money in</th>
            <th className="px-4 py-3 font-semibold">Money out</th>
            <th className="px-4 py-3 font-semibold">Opening balance</th>
            <th className="px-4 py-3 font-semibold">Closing balance</th>
            <th className="px-4 py-3 font-semibold">{category ? "Txns" : "Flow"}</th>
          </tr>
        </thead>
        <tbody>
          {report.rows.map((row, index) => (
            <tr key={`${row.label}-${index}`} className="border-t border-border bg-surface even:bg-paper">
              <td className="px-4 py-3 font-medium text-ink">
                {row.date ? formatDate(row.date) : row.label}
              </td>
              <td className="px-4 py-3">
                <FlowSign flow={row.flow} amount={row.totalAmount} />
              </td>
              <td className="px-4 py-3 text-emerald-600">{formatCurrency(row.totalIn)}</td>
              <td className="px-4 py-3 text-red-600">{formatCurrency(row.totalOut)}</td>
              <td className="px-4 py-3">{formatCurrency(row.openingBalance)}</td>
              <td className="px-4 py-3 font-semibold">{formatCurrency(row.closingBalance)}</td>
              <td className="px-4 py-3 text-muted">
                {category ? row.transactionCount : row.flow === "IN" ? "In" : "Out"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
