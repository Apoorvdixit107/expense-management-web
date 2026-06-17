"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdown, ExpenseReport, PeriodBreakdown } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const BRAND = "#FF6C37";
const PALETTE = [
  "#FF6C37",
  "#FF8F6B",
  "#FFB899",
  "#2D9CDB",
  "#27AE60",
  "#9B51E0",
  "#F2994A",
  "#6B7280",
];

import type { DashboardFilter } from "@/lib/dashboard-period";
import type { DashboardPeriod } from "@/lib/types";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      {label ? <p className="font-medium text-ink">{label}</p> : null}
      <p className="text-brand">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function CategoryDonutChart({ items, total }: { items: CategoryBreakdown[]; total: number }) {
  const data = items.map((item, index) => ({
    name: item.category,
    value: item.amount,
    color: PALETTE[index % PALETTE.length],
  }));

  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-muted">No expenses in this period.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row">
      <div className="relative h-[240px] w-full max-w-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={96}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Total</p>
          <p className="text-lg font-bold text-ink">{formatCurrency(total)}</p>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-2">
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <li key={item.name} className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: item.color }} />
              <span className="flex-1 truncate font-medium text-ink">{item.name}</span>
              <span className="text-muted">{pct}%</span>
              <span className="font-semibold text-ink">{formatCurrency(item.value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SpendingTrendChart({
  items,
  title,
}: {
  items: PeriodBreakdown[];
  title: string;
}) {
  const data = items.map((item) => ({
    label: item.label.length > 12 ? item.label.replace(/^\w+\s/, "") : item.label,
    fullLabel: item.label,
    amount: item.amount,
  }));

  if (data.every((d) => d.amount === 0)) {
    return <p className="py-16 text-center text-sm text-muted">No spending data for this period.</p>;
  }

  return (
    <div className="h-[260px] w-full">
      <p className="mb-4 text-sm font-medium text-muted">{title}</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
              <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
            width={48}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as { fullLabel: string; amount: number };
              return (
                <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
                  <p className="font-medium text-ink">{row.fullLabel}</p>
                  <p className="text-brand">{formatCurrency(row.amount)}</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={BRAND}
            strokeWidth={2.5}
            fill="url(#spendGradient)"
            dot={{ r: 3, fill: BRAND, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: BRAND }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopCategoriesChart({ items }: { items: CategoryBreakdown[] }) {
  const top = [...items].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const data = top.map((item, index) => ({
    name: item.category,
    amount: item.amount,
    fill: PALETTE[index % PALETTE.length],
  }));

  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-muted">No category data yet.</p>;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={88}
            tick={{ fontSize: 12, fill: "var(--ink)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={22}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TodayOverviewPanel({ report }: { report: ExpenseReport | null }) {
  const hourly = report?.breakdown ?? [];
  const activeHours = hourly.filter((h) => h.amount > 0);
  const data = hourly.map((h) => ({ label: h.label, amount: h.amount }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Spent today</p>
        <p className="mt-2 text-3xl font-bold text-brand">{formatCurrency(report?.totalAmount ?? 0)}</p>
        <p className="mt-1 text-sm text-muted">
          {report?.transactionCount ?? 0} transaction{(report?.transactionCount ?? 0) === 1 ? "" : "s"}
        </p>
      </div>

      {activeHours.length > 0 ? (
        <div className="h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "var(--muted)" }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" fill={BRAND} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-paper px-4 py-6 text-center text-sm text-muted">
          No expenses recorded today yet.
        </p>
      )}

      {activeHours.length > 0 ? (
        <ul className="max-h-32 space-y-2 overflow-y-auto text-sm">
          {activeHours
            .slice()
            .reverse()
            .map((slot) => (
              <li key={slot.label} className="flex justify-between text-muted">
                <span>{slot.label}</span>
                <span className="font-semibold text-ink">
                  {formatCurrency(slot.amount)} · {slot.transactionCount} txn
                </span>
              </li>
            ))}
        </ul>
      ) : null}
    </div>
  );
}

export function DashboardChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </Card>
  );
}

const PRESET_PERIODS: { label: string; value: DashboardPeriod }[] = [
  { label: "Today", value: "TODAY" },
  { label: "7 days", value: "LAST_7_DAYS" },
  { label: "30 days", value: "LAST_30_DAYS" },
  { label: "Monthly", value: "MONTH" },
  { label: "Yearly", value: "YEAR" },
  { label: "Custom", value: "CUSTOM_RANGE" },
];

function periodButtonClass(active: boolean) {
  return `h-10 rounded-xl px-4 text-sm font-semibold transition ${
    active
      ? "bg-brand text-white shadow-sm"
      : "border border-border bg-surface text-ink hover:bg-paper"
  }`;
}

export function PeriodSelector({
  filter,
  onChange,
}: {
  filter: DashboardFilter;
  onChange: (next: DashboardFilter) => void;
}) {
  function setPeriod(period: DashboardPeriod) {
    onChange({ ...filter, period });
  }

  return (
    <div className="flex w-full max-w-3xl flex-col items-end gap-3">
      <div className="flex flex-wrap justify-end gap-2">
        {PRESET_PERIODS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPeriod(opt.value)}
            className={periodButtonClass(filter.period === opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filter.period === "MONTH" ? (
        <label className="flex items-center gap-2 text-sm text-muted">
          <span>Month</span>
          <input
            type="month"
            value={filter.monthInput}
            onChange={(e) => onChange({ ...filter, monthInput: e.target.value })}
            className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
      ) : null}

      {filter.period === "YEAR" ? (
        <label className="flex items-center gap-2 text-sm text-muted">
          <span>Year</span>
          <input
            type="number"
            min={2000}
            max={2100}
            value={filter.yearInput}
            onChange={(e) => onChange({ ...filter, yearInput: Number(e.target.value) })}
            className="h-10 w-28 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
      ) : null}

      {filter.period === "CUSTOM_RANGE" ? (
        <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted">
          <span>From</span>
          <input
            type="date"
            value={filter.fromDate}
            onChange={(e) => onChange({ ...filter, fromDate: e.target.value })}
            className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <span>To</span>
          <input
            type="date"
            value={filter.toDate}
            min={filter.fromDate}
            onChange={(e) => onChange({ ...filter, toDate: e.target.value })}
            className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      ) : null}
    </div>
  );
}
