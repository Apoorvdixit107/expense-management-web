import { MockAppShell, MockBar, MockCard, MockStatCard } from "../primitives";
import { brand } from "../tokens";

const categories = [
  { name: "Food", amount: "₹3,240", pct: 72 },
  { name: "Travel", amount: "₹2,180", pct: 48 },
  { name: "Shopping", amount: "₹1,560", pct: 35 },
];

export function DashboardMockup() {
  return (
    <MockAppShell active="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-bold" style={{ color: brand.ink }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">Your spending overview — subscriber view</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MockStatCard label="Total spent (7d)" value="₹8,420" highlight />
          <MockStatCard label="Transactions" value="12" />
          <MockStatCard label="Top category" value="Food" />
        </div>

        <MockCard>
          <h2 className="text-lg font-bold" style={{ color: brand.ink }}>
            Category breakdown
          </h2>
          <div className="mt-6 space-y-4">
            {categories.map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.amount}</span>
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
