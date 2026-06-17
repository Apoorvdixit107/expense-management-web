import { MockAppShell, MockBar, MockCard, MockStatCard } from "../primitives";
import { brand } from "../tokens";

export function ReportsMockup() {
  return (
    <MockAppShell active="reports">
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: brand.ink }}>
              Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">Subscriber-only · full analytics</p>
          </div>
          <div className="flex gap-2">
            <span
              className="inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold text-white"
              style={{ background: brand.primary }}
            >
              Last 7 days
            </span>
            <span
              className="inline-flex h-11 items-center rounded-xl border bg-white px-5 text-sm font-semibold text-slate-600"
              style={{ borderColor: brand.border }}
            >
              Last 30 days
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MockStatCard label="Last 7 days" value="₹8,420" highlight />
          <MockStatCard label="Transactions" value="12" />
        </div>

        <MockCard>
          <h2 className="text-lg font-bold" style={{ color: brand.ink }}>
            By category
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { name: "Food", pct: 38 },
              { name: "Travel", pct: 26 },
              { name: "Shopping", pct: 18 },
            ].map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.pct}%</span>
                </div>
                <MockBar pct={item.pct} />
              </div>
            ))}
          </div>
        </MockCard>
      </div>
    </MockAppShell>
  );
}
