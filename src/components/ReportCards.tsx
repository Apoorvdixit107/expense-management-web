import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdown, PeriodBreakdown } from "@/lib/types";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function CategoryBars({ items }: { items: CategoryBreakdown[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No category data for this period.</p>;
  }

  const max = Math.max(...items.map((item) => item.amount));

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.category}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-slate-700">{item.category}</span>
            <span className="text-slate-500">{formatCurrency(item.amount)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-teal-500"
              style={{ width: `${max ? (item.amount / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PeriodBars({ items }: { items: PeriodBreakdown[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No breakdown available.</p>;
  }

  const max = Math.max(...items.map((item) => item.amount));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(item.amount)}</p>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-teal-600"
              style={{ width: `${max ? (item.amount / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
