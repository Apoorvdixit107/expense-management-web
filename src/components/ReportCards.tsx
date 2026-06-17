import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdown, PeriodBreakdown } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Card padding="md">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-3 text-[28px] font-bold leading-none ${highlight ? "text-brand" : "text-ink"}`}>
        {value}
      </p>
    </Card>
  );
}

export function CategoryBars({ items }: { items: CategoryBreakdown[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">No category data for this period.</p>;
  }

  const max = Math.max(...items.map((item) => item.amount));

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.category}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-ink">{item.category}</span>
            <span className="font-semibold text-muted">{formatCurrency(item.amount)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-paper">
            <div
              className="h-full rounded-full bg-brand transition-all"
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
    return <p className="text-sm text-muted">No breakdown available.</p>;
  }

  const max = Math.max(...items.map((item) => item.amount));

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-paper p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-2 text-xl font-bold text-ink">{formatCurrency(item.amount)}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-brand-hover"
              style={{ width: `${max ? (item.amount / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
