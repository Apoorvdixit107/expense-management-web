"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Organization, OrganizationProfitRow, ProfitPeriodPoint } from "@/lib/types";

const PROFIT_POSITIVE = "#16a34a";
const PROFIT_NEGATIVE = "#dc2626";

function ProfitTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ProfitPeriodPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-ink">{row.label}</p>
      <p className="text-emerald-600">Income: {formatCurrency(row.income)}</p>
      <p className="text-brand">Expenses: {formatCurrency(row.expenses)}</p>
      <p className={row.profit >= 0 ? "text-emerald-600" : "text-red-600"}>
        Profit: {formatCurrency(row.profit)}
      </p>
      <p className="text-muted">Margin: {formatPercent(row.profitMarginPercent)}</p>
    </div>
  );
}

export function ProfitTrendChart({ items }: { items: ProfitPeriodPoint[] }) {
  const data = items.map((item) => ({
    ...item,
    shortLabel: item.label.length > 12 ? item.label.slice(0, 11) + "…" : item.label,
  }));

  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-muted">No profit trend data for this period.</p>;
  }

  return (
    <div className="h-[240px] w-full min-w-0 overflow-hidden sm:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="shortLabel"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (Math.abs(v) >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
            width={44}
          />
          <Tooltip content={<ProfitTooltip />} />
          <Bar dataKey="profit" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.profit >= 0 ? PROFIT_POSITIVE : PROFIT_NEGATIVE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrganizationProfitTable({
  rows,
  organizations,
  currentOrgId,
}: {
  rows: OrganizationProfitRow[];
  organizations: Organization[];
  currentOrgId: number | null;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-paper px-4 py-8 text-center text-sm text-muted">
        No organization data for this period.
      </p>
    );
  }

  const orgName = (id: number | null) => {
    if (id == null) return "Unassigned";
    return organizations.find((org) => org.id === id)?.name ?? `Org #${id}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="px-3 py-2 font-medium">Organization</th>
            <th className="px-3 py-2 font-medium">Income</th>
            <th className="px-3 py-2 font-medium">Expenses</th>
            <th className="px-3 py-2 font-medium">Profit</th>
            <th className="px-3 py-2 font-medium">Margin</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isCurrent = row.organizationId === currentOrgId;
            return (
              <tr
                key={row.organizationId ?? "none"}
                className={`border-b border-border/60 ${isCurrent ? "bg-brand/5" : ""}`}
              >
                <td className="px-3 py-3 font-medium text-ink">
                  {orgName(row.organizationId)}
                  {isCurrent ? (
                    <span className="ml-2 text-xs font-normal text-brand">(current)</span>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-emerald-600">{formatCurrency(row.totalIncome)}</td>
                <td className="px-3 py-3 text-brand">{formatCurrency(row.totalExpenses)}</td>
                <td
                  className={`px-3 py-3 font-semibold ${
                    row.profit >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(row.profit)}
                </td>
                <td className="px-3 py-3 text-muted">{formatPercent(row.profitMarginPercent)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
