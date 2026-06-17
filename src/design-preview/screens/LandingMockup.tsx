import { MockBtn, MockLogo } from "../primitives";
import { brand } from "../tokens";

function HeroPreview() {
  const slices = [
    { label: "Food", pct: 32, color: "#7C3AED" },
    { label: "Travel", pct: 24, color: "#A78BFA" },
    { label: "Bills", pct: 18, color: "#C4B5FD" },
    { label: "Other", pct: 26, color: "#DDD6FE" },
  ];

  return (
    <div
      className="relative rounded-3xl border bg-white p-6 shadow-[0_20px_60px_rgba(124,58,237,0.12)]"
      style={{ borderColor: brand.border }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">This month</p>
          <p className="mt-1 text-3xl font-extrabold" style={{ color: brand.ink }}>
            ₹24,580
          </p>
          <p className="mt-1 text-sm text-slate-500">Total expenses</p>
        </div>
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-violet-100">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: brand.primary }}>
              12
            </p>
            <p className="text-[10px] text-slate-400">txns</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {slices.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-slate-600">{item.label}</span>
              <span className="text-slate-400">{item.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-violet-50">
              <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Income", "₹42k"],
          ["Saved", "₹8.2k"],
          ["Budget", "78%"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-violet-50 px-3 py-2.5 text-center">
            <p className="text-[10px] text-slate-400">{k}</p>
            <p className="text-sm font-bold" style={{ color: brand.ink }}>
              {v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingMockup() {
  return (
    <div className="bg-white">
      {/* Header — clean like Fast Budget / Spendee */}
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-5">
        <MockLogo />
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <span>Features</span>
          <span>Pricing</span>
          <span>Support</span>
        </div>
        <div className="flex gap-3">
          <MockBtn variant="ghost">Log in</MockBtn>
          <MockBtn>Get started free</MockBtn>
        </div>
      </header>

      {/* Hero — split layout like Spendee */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-8 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: brand.primary }}>
            Personal finance manager
          </p>
          <h1
            className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight lg:text-[52px]"
            style={{ color: brand.ink }}
          >
            The simple way to manage your money
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Track expenses, set budgets, and see where every rupee goes — all in one clean dashboard. Like{" "}
            <span className="font-medium text-slate-700">Spendee</span> and{" "}
            <span className="font-medium text-slate-700">Money Lover</span>, but built for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <MockBtn className="min-w-[160px]">Start free</MockBtn>
            <MockBtn variant="outline" className="min-w-[160px]">
              Try web app
            </MockBtn>
          </div>

          {/* Trust row — Money Lover style */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
            {["100% secure data", "Free to start", "Works on web"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ background: brand.primary }}>
                  ✓
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <HeroPreview />
      </section>

      {/* Features — 3 columns like Fast Budget */}
      <section className="border-t py-20" style={{ borderColor: brand.border, background: brand.soft }}>
        <div className="mx-auto max-w-[1200px] px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold" style={{ color: brand.ink }}>
              Your finances at a glance
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Stop wondering where your money goes. Intuitive reports and charts make spending easy to understand.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              ["Track expenses", "Add transactions in seconds with categories and notes. Manual entry, full control."],
              ["Analyze spending", "7-day, 30-day, and monthly reports with clear category breakdowns."],
              ["Stay on budget", "Get alerts on high spends and weekly summaries before you overspend."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border bg-white p-8"
                style={{ borderColor: brand.border }}
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white"
                  style={{ background: brand.primary }}
                >
                  ◆
                </span>
                <h3 className="mt-5 text-xl font-bold" style={{ color: brand.ink }}>
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Fast Budget style table */}
      <section className="mx-auto max-w-[1200px] px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ color: brand.ink }}>
            Choose the plan that&apos;s right for you
          </h2>
          <p className="mt-3 text-slate-600">Start free. Upgrade when you need more.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-8" style={{ borderColor: brand.border }}>
            <p className="font-semibold text-slate-500">Free</p>
            <p className="mt-3 text-4xl font-extrabold" style={{ color: brand.ink }}>
              ₹0
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✓ 50 expenses per month</li>
              <li>✓ 7-day reports</li>
              <li>✓ Web app access</li>
            </ul>
            <div className="mt-8">
              <MockBtn variant="outline" className="w-full">
                Get started
              </MockBtn>
            </div>
          </div>
          <div
            className="relative rounded-2xl border-2 bg-white p-8"
            style={{ borderColor: brand.primary }}
          >
            <span
              className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: brand.primary }}
            >
              Popular
            </span>
            <p className="font-semibold" style={{ color: brand.primary }}>
              Pro
            </p>
            <p className="mt-3 text-4xl font-extrabold" style={{ color: brand.ink }}>
              ₹149<span className="text-lg font-medium text-slate-500">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✓ Unlimited expenses</li>
              <li>✓ Full reports & export</li>
              <li>✓ Priority support</li>
            </ul>
            <div className="mt-8">
              <MockBtn className="w-full">Upgrade to Pro</MockBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t py-8 text-center text-sm text-slate-400" style={{ borderColor: brand.border }}>
        ExpenseKit · Personal expense management
      </footer>
    </div>
  );
}
