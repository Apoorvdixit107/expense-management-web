import type { ReactNode } from "react";
import { brand } from "./tokens";

export function MockupFrame({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {note ? <p className="mt-0.5 text-sm text-slate-500">{note}</p> : null}
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: brand.light, color: brand.hover }}
        >
          Desktop · 1440px
        </span>
      </div>
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-[0_8px_40px_rgba(232,93,4,0.1)]"
        style={{ borderColor: brand.border }}
      >
        {children}
      </div>
    </section>
  );
}

export function MockLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ background: brand.primary }}
      >
        E
      </span>
      <span className="text-lg font-bold" style={{ color: brand.ink }}>
        ExpenseKit
      </span>
    </div>
  );
}

export function MockBtn({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  className?: string;
}) {
  const styles = {
    primary: "text-white",
    secondary: "border bg-white text-slate-900",
    ghost: "text-slate-500",
    danger: "text-white",
    outline: "border-2 bg-white",
  };
  const inline: React.CSSProperties =
    variant === "primary"
      ? { background: brand.primary }
      : variant === "danger"
        ? { background: brand.crimson }
        : variant === "secondary"
          ? { borderColor: brand.border }
          : variant === "outline"
            ? { borderColor: brand.primary, color: brand.primary }
            : {};

  return (
    <span
      className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold ${styles[variant]} ${className}`}
      style={inline}
    >
      {children}
    </span>
  );
}

export function MockInput({ label, placeholder, hint }: { label: string; placeholder?: string; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium" style={{ color: brand.ink }}>
        {label}
      </span>
      <span
        className="flex h-11 w-full items-center rounded-xl border bg-white px-3 text-sm text-slate-400"
        style={{ borderColor: brand.border }}
      >
        {placeholder}
      </span>
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function MockGoogleBtn({ label }: { label: string }) {
  return (
    <span
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border bg-white text-sm font-medium text-slate-700"
      style={{ borderColor: brand.border }}
    >
      <span className="text-base font-bold text-blue-600">G</span>
      {label}
    </span>
  );
}

export function MockDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" style={{ borderColor: brand.border }} />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-400">or</span>
      </div>
    </div>
  );
}

export function MockTrialBanner({ daysLeft = 5 }: { daysLeft?: number }) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 border-b px-8 py-3"
      style={{ borderColor: brand.border, background: brand.light }}
    >
      <p className="text-sm" style={{ color: brand.ink }}>
        <span className="font-bold">{daysLeft} days left</span> in your free trial — track expenses with no account
        needed
      </p>
      <div className="flex gap-2">
        <MockBtn variant="outline" className="h-9 px-4 text-xs">
          Create account
        </MockBtn>
        <MockBtn className="h-9 px-4 text-xs">Subscribe</MockBtn>
      </div>
    </div>
  );
}

export function MockGuestNav({ active }: { active: "expenses" | "notifications" }) {
  const links = [
    { key: "expenses", label: "Expenses" },
    { key: "notifications", label: "Notifications" },
  ] as const;

  return (
    <nav className="flex gap-2">
      {links.map((link) => {
        const isActive = link.key === active;
        return (
          <span
            key={link.key}
            className={`inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold ${
              isActive ? "text-white" : "text-slate-600"
            }`}
            style={isActive ? { background: brand.primary } : { background: "white", border: `1px solid ${brand.border}` }}
          >
            {link.label}
          </span>
        );
      })}
    </nav>
  );
}

export function MockGuestShell({
  active,
  daysLeft = 5,
  children,
}: {
  active: "expenses" | "notifications";
  daysLeft?: number;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[720px]" style={{ background: brand.soft }}>
      <header className="border-b bg-white" style={{ borderColor: brand.border }}>
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
          <MockLogo />
          <div className="flex items-center gap-4">
            <MockGuestNav active={active} />
            <span className="text-sm text-slate-400">|</span>
            <MockBtn variant="ghost" className="h-9 px-3 text-sm">
              Sign in
            </MockBtn>
          </div>
        </div>
      </header>
      <MockTrialBanner daysLeft={daysLeft} />
      <div className="mx-auto max-w-[1200px] px-8 py-8">{children}</div>
    </div>
  );
}

export function MockSidebar({
  active,
  unread = 2,
}: {
  active: "dashboard" | "expenses" | "reports" | "notifications";
  unread?: number;
}) {
  const links = [
    { key: "dashboard", label: "Dashboard" },
    { key: "expenses", label: "Expenses" },
    { key: "reports", label: "Reports" },
    { key: "notifications", label: "Notifications", badge: unread },
  ] as const;

  return (
    <nav className="w-[220px] shrink-0 space-y-1">
      {links.map((link) => {
        const isActive = link.key === active;
        return (
          <span
            key={link.key}
            className={`flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold ${
              isActive ? "text-white" : "text-slate-600"
            }`}
            style={isActive ? { background: brand.primary } : undefined}
          >
            {link.label}
            {"badge" in link && link.badge ? (
              <span className="ml-auto rounded-full bg-white/25 px-2 py-0.5 text-xs">{link.badge}</span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

export function MockAppShell({
  active,
  children,
  plan = "Pro",
}: {
  active: "dashboard" | "expenses" | "reports" | "notifications";
  children: ReactNode;
  plan?: string;
}) {
  return (
    <div className="min-h-[720px]" style={{ background: brand.soft }}>
      <header className="border-b bg-white" style={{ borderColor: brand.border }}>
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
          <MockLogo />
          <div className="flex items-center gap-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: brand.primary }}
            >
              {plan}
            </span>
            <span className="text-sm text-slate-500">Apoorv Dixit</span>
            <span className="text-sm font-medium text-slate-500">Sign out</span>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1200px] gap-8 px-8 py-8">
        <MockSidebar active={active} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function MockStatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(232,93,4,0.08)]"
      style={{ borderColor: brand.border }}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold" style={{ color: highlight ? brand.primary : brand.ink }}>
        {value}
      </p>
    </div>
  );
}

export function MockBar({ pct }: { pct: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full" style={{ background: brand.light }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: brand.primary }} />
    </div>
  );
}

export function MockCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-[0_1px_3px_rgba(232,93,4,0.08)] ${className}`}
      style={{ borderColor: brand.border, ...style }}
    >
      {children}
    </div>
  );
}
