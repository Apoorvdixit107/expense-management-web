import { MockBtn, MockCard, MockDivider, MockGoogleBtn, MockInput, MockLogo } from "../primitives";
import { brand } from "../tokens";

function AuthShell({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="flex min-h-[640px] flex-col items-center justify-center px-6 py-12" style={{ background: brand.soft }}>
      <MockLogo />
      {subtitle ? (
        <p className="mt-3 text-center text-sm text-slate-500">{subtitle}</p>
      ) : null}
      <MockCard className="mt-8 w-full max-w-[400px] p-8">{children}</MockCard>
    </div>
  );
}

export function RegisterMockup() {
  return (
    <AuthShell subtitle="Optional during trial — save your progress across devices">
      <h1 className="text-2xl font-bold" style={{ color: brand.ink }}>
        Create account
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">Free to create. Subscribe when you&apos;re ready.</p>
      <div className="mt-6 space-y-4">
        <MockGoogleBtn label="Sign up with Google" />
        <MockDivider />
        <MockInput label="Full name" placeholder="Apoorv Dixit" />
        <MockInput label="Email" placeholder="you@example.com" />
        <MockInput label="Password" placeholder="At least 8 characters" />
        <MockBtn className="w-full">Create account</MockBtn>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <span className="font-semibold" style={{ color: brand.primary }}>Sign in</span>
      </p>
    </AuthShell>
  );
}

export function LoginMockup() {
  return (
    <AuthShell subtitle="For returning subscribers and trial users with an account">
      <h1 className="text-2xl font-bold" style={{ color: brand.ink }}>
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">Sign in to continue to ExpenseKit</p>
      <div className="mt-6 space-y-4">
        <MockGoogleBtn label="Sign in with Google" />
        <MockDivider />
        <MockInput label="Email" placeholder="you@example.com" />
        <MockInput label="Password" placeholder="••••••••" />
        <MockBtn className="w-full">Sign in</MockBtn>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here? <span className="font-semibold" style={{ color: brand.primary }}>Start free trial</span>
      </p>
    </AuthShell>
  );
}
