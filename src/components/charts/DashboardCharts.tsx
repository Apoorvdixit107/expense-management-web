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
import type { CategoryBreakdown, ExpenseReport, PeriodBreakdown, DashboardPeriod } from "@/lib/types";
import type { DashboardFilter } from "@/lib/dashboard-period";
import { Card } from "@/components/ui/Card";

const BRAND = "#FF6C37";
const INCOME_GREEN = "#16a34a";
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

function periodAmount(item: PeriodBreakdown): number {
  return item.totalAmount ?? item.amount ?? 0;
}

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

export function CategoryDonutChart({
  items,
  total,
  emptyMessage = "No data in this period.",
  centerLabel = "Total",
}: {
  items: CategoryBreakdown[];
  total: number;
  emptyMessage?: string;
  centerLabel?: string;
}) {
  const data = items.map((item, index) => ({
    name: item.category,
    value: item.amount,
    color: PALETTE[index % PALETTE.length],
  }));

  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="flex min-w-0 flex-col items-center gap-6 lg:flex-row">
      <div className="relative mx-auto h-[200px] w-[200px] shrink-0 sm:h-[240px] sm:w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="85%"
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
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted sm:text-xs">
            {centerLabel}
          </p>
          <p className="text-base font-bold text-ink sm:text-lg">{formatCurrency(total)}</p>
        </div>
      </div>
      <ul className="w-full min-w-0 flex-1 space-y-2">
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <li key={item.name} className="flex min-w-0 items-center gap-2 text-sm sm:gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: item.color }} />
              <span className="min-w-0 flex-1 truncate font-medium text-ink">{item.name}</span>
              <span className="shrink-0 text-muted">{pct}%</span>
              <span className="shrink-0 font-semibold text-ink">{formatCurrency(item.value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CashFlowTrendChart({
  outItems,
  inItems,
  title,
}: {
  outItems: PeriodBreakdown[];
  inItems: PeriodBreakdown[];
  title: string;
}) {
  const data = outItems.map((item, index) => ({
    label: item.label.length > 12 ? item.label.replace(/^\w+\s/, "") : item.label,
    fullLabel: item.label,
    moneyOut: periodAmount(item),
    moneyIn: periodAmount(inItems[index] ?? { label: item.label, totalAmount: 0, transactionCount: 0 }),
  }));

  if (data.every((d) => d.moneyOut === 0 && d.moneyIn === 0)) {
    return <p className="py-16 text-center text-sm text-muted">No money in or out for this period.</p>;
  }

  return (
    <div className="h-[240px] w-full min-w-0 overflow-hidden sm:h-[260px]">
      {title ? <p className="mb-2 text-sm font-medium text-muted sm:mb-4">{title}</p> : null}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="outGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity={0.3} />
              <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="inGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INCOME_GREEN} stopOpacity={0.3} />
              <stop offset="100%" stopColor={INCOME_GREEN} stopOpacity={0.02} />
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
            width={40}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as {
                fullLabel: string;
                moneyOut: number;
                moneyIn: number;
              };
              return (
                <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
                  <p className="font-medium text-ink">{row.fullLabel}</p>
                  <p className="text-emerald-600">In: {formatCurrency(row.moneyIn)}</p>
                  <p className="text-brand">Out: {formatCurrency(row.moneyOut)}</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="moneyIn"
            stroke={INCOME_GREEN}
            strokeWidth={2}
            fill="url(#inGradient)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="moneyOut"
            stroke={BRAND}
            strokeWidth={2}
            fill="url(#outGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
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
    amount: periodAmount(item),
  }));

  if (data.every((d) => d.amount === 0)) {
    return <p className="py-16 text-center text-sm text-muted">No spending data for this period.</p>;
  }

  return (
    <div className="h-[240px] w-full min-w-0 overflow-hidden sm:h-[260px]">
      {title ? <p className="mb-2 text-sm font-medium text-muted sm:mb-4">{title}</p> : null}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
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
            width={40}
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
    <div className="h-[240px] w-full min-w-0 overflow-hidden sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={72}
            tick={{ fontSize: 11, fill: "var(--ink)" }}
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
  const moneyOut = report?.totalAmount ?? 0;
  const moneyIn = report?.totalInAmount ?? 0;
  const outCount = report?.outTransactionCount ?? 0;
  const inCount = report?.inTransactionCount ?? 0;
  const hourlyOut = report?.breakdown ?? [];
  const hourlyIn = report?.breakdownIn ?? [];
  const data = hourlyOut.map((slot, index) => ({
    label: slot.label,
    moneyOut: periodAmount(slot),
    moneyIn: periodAmount(hourlyIn[index] ?? { label: slot.label, totalAmount: 0, transactionCount: 0 }),
  }));
  const hasActivity = data.some((slot) => slot.moneyOut > 0 || slot.moneyIn > 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Money in today</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{formatCurrency(moneyIn)}</p>
          <p className="mt-1 text-sm text-muted">
            {inCount} income transaction{inCount === 1 ? "" : "s"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Money out today</p>
          <p className="mt-2 text-2xl font-bold text-brand">{formatCurrency(moneyOut)}</p>
          <p className="mt-1 text-sm text-muted">
            {outCount} expense transaction{outCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {hasActivity ? (
        <div className="h-[140px] w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "var(--muted)" }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as { label: string; moneyIn: number; moneyOut: number };
                  return (
                    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
                      <p className="font-medium text-ink">{row.label}</p>
                      <p className="text-emerald-600">In: {formatCurrency(row.moneyIn)}</p>
                      <p className="text-brand">Out: {formatCurrency(row.moneyOut)}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="moneyIn" fill={INCOME_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="moneyOut" fill={BRAND} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-paper px-4 py-6 text-center text-sm text-muted">
          No transactions recorded today yet.
        </p>
      )}
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
    <Card className="min-w-0 overflow-hidden">
      <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      <div className="mt-4 min-w-0 overflow-x-auto sm:mt-6">{children}</div>
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
  return `h-10 w-full rounded-xl px-2 text-xs font-semibold transition sm:w-auto sm:px-4 sm:text-sm ${
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
    <div className="flex w-full min-w-0 max-w-3xl flex-col gap-3 sm:items-end">
      <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-end">
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
        <label className="flex w-full items-center gap-2 text-sm text-muted sm:w-auto">
          <span className="shrink-0">Month</span>
          <input
            type="month"
            value={filter.monthInput}
            onChange={(e) => onChange({ ...filter, monthInput: e.target.value })}
            className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:flex-none"
          />
        </label>
      ) : null}

      {filter.period === "YEAR" ? (
        <label className="flex w-full items-center gap-2 text-sm text-muted sm:w-auto">
          <span className="shrink-0">Year</span>
          <input
            type="number"
            min={2000}
            max={2100}
            value={filter.yearInput}
            onChange={(e) => onChange({ ...filter, yearInput: Number(e.target.value) })}
            className="h-10 w-full max-w-[8rem] rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
      ) : null}

      {filter.period === "CUSTOM_RANGE" ? (
        <div className="grid w-full grid-cols-1 gap-2 text-sm text-muted sm:flex sm:flex-wrap sm:items-center sm:justify-end">
          <label className="flex items-center gap-2">
            <span className="w-10 shrink-0 sm:w-auto">From</span>
            <input
              type="date"
              value={filter.fromDate}
              onChange={(e) => onChange({ ...filter, fromDate: e.target.value })}
              className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-10 shrink-0 sm:w-auto">To</span>
            <input
              type="date"
              value={filter.toDate}
              min={filter.fromDate}
              onChange={(e) => onChange({ ...filter, toDate: e.target.value })}
              className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
