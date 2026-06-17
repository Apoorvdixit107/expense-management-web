import { MockAppShell, MockBtn, MockCard } from "../primitives";
import { brand } from "../tokens";

const expenses = [
  { category: "Food", amount: "₹450", date: "17 Jun 2026, 1:30 PM", note: "Team lunch" },
  { category: "Travel", amount: "₹1,200", date: "16 Jun 2026, 9:15 AM" },
];

export function ExpensesMockup() {
  return (
    <MockAppShell active="expenses">
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-bold" style={{ color: brand.ink }}>
            Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">Synced to your Pro account</p>
        </div>

        <MockCard>
          <h2 className="text-lg font-bold" style={{ color: brand.ink }}>
            Add expense
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Category", "Food"],
              ["Amount (INR)", "0.00"],
              ["Date & time", "17/06/2026, 14:30"],
              ["Description", "Optional note"],
            ].map(([label, value]) => (
              <label key={label} className="block space-y-1.5">
                <span className="text-sm font-medium" style={{ color: brand.ink }}>
                  {label}
                </span>
                <span
                  className={`flex h-11 items-center rounded-xl border px-3 text-sm ${value === "0.00" || value === "Optional note" ? "text-slate-400" : "text-slate-700"}`}
                  style={{ borderColor: brand.border }}
                >
                  {value}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-5">
            <MockBtn>Save expense</MockBtn>
          </div>
        </MockCard>

        <div className="space-y-3">
          {expenses.map((item) => (
            <MockCard key={item.date} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: brand.light, color: brand.hover }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xl font-bold" style={{ color: brand.ink }}>
                    {item.amount}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{item.date}</p>
                {item.note ? <p className="mt-1 text-sm text-slate-600">{item.note}</p> : null}
              </div>
              <MockBtn variant="danger">Delete</MockBtn>
            </MockCard>
          ))}
        </div>
      </div>
    </MockAppShell>
  );
}
