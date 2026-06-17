import { MockBtn, MockCard, MockLogo } from "../primitives";
import { brand } from "../tokens";

export function UpgradeMockup() {
  return (
    <div className="min-h-[720px]" style={{ background: brand.soft }}>
      <header className="border-b bg-white px-8 py-5" style={{ borderColor: brand.border }}>
        <MockLogo />
      </header>

      <div className="mx-auto max-w-[900px] px-8 py-16 text-center">
        <span
          className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
          style={{ background: brand.crimson }}
        >
          Trial ended
        </span>
        <h1 className="mt-6 text-4xl font-extrabold" style={{ color: brand.ink }}>
          Subscribe to keep your expenses
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-slate-600">
          Your 7-day trial is over. Subscribe to continue tracking and sync your data. Unsubscribed accounts are
          deleted after 3 months from account creation.
        </p>

        <div className="mt-12 grid gap-6 text-left lg:grid-cols-2">
          <MockCard className="p-8">
            <p className="font-semibold text-slate-500">Free trial</p>
            <p className="mt-2 text-3xl font-extrabold" style={{ color: brand.ink }}>
              Expired
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-500">
              <li>· Local data only</li>
              <li>· 7 days access</li>
              <li>· No cloud sync</li>
            </ul>
          </MockCard>

          <MockCard className="relative border-2 p-8" style={{ borderColor: brand.primary }}>
            <span
              className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: brand.primary }}
            >
              Recommended
            </span>
            <p className="font-semibold" style={{ color: brand.primary }}>
              Pro
            </p>
            <p className="mt-2 text-3xl font-extrabold" style={{ color: brand.ink }}>
              ₹149<span className="text-base font-medium text-slate-500">/month</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>✓ Unlimited expenses</li>
              <li>✓ Cloud sync & reports</li>
              <li>✓ Email & SMS notifications</li>
              <li>✓ Data kept while subscribed</li>
            </ul>
            <div className="mt-8">
              <MockBtn className="w-full">Subscribe now</MockBtn>
            </div>
          </MockCard>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Already have an account? <span className="font-semibold" style={{ color: brand.primary }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
