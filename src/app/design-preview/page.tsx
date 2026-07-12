import { MockupFrame } from "@/design-preview/primitives";
import { brand } from "@/design-preview/tokens";
import { LoginMockup, RegisterMockup } from "@/design-preview/screens/AuthMockups";
import {
  BlogEmptyMockup,
  BlogIndexMockup,
  BlogPostMockup,
} from "@/design-preview/screens/BlogMockups";
import { DashboardMockup } from "@/design-preview/screens/DashboardMockup";
import { ExpensesMockup } from "@/design-preview/screens/ExpensesMockup";
import { GuestExpensesMockup } from "@/design-preview/screens/GuestExpensesMockup";
import { GuestNotificationsActivityMockup } from "@/design-preview/screens/GuestNotificationsActivityMockup";
import { GuestNotificationsSetupMockup } from "@/design-preview/screens/GuestNotificationsSetupMockup";
import { NotificationsMockup } from "@/design-preview/screens/NotificationsMockup";
import { ReportsMockup } from "@/design-preview/screens/ReportsMockup";
import { UpgradeMockup } from "@/design-preview/screens/UpgradeMockup";
import type { ComponentType } from "react";

const screens: {
  id: string;
  label: string;
  title: string;
  note: string;
  group: "Guest (trial)" | "Auth" | "Subscribe" | "Subscriber" | "Marketing · Blog";
  Mock: ComponentType;
}[] = [
  {
    id: "blog-index",
    label: "B1. Blog index",
    title: "Blog — post list",
    note: "Public marketing. List layout (not cards). Nav includes Blog. Approve before live /blog. Spec: docs/BLOG-DESIGN-SPEC.md",
    group: "Marketing · Blog",
    Mock: BlogIndexMockup,
  },
  {
    id: "blog-post",
    label: "B2. Blog post",
    title: "Blog — article detail",
    note: "Long-form + author row + trial CTA. Max-width ~3xl for reading comfort.",
    group: "Marketing · Blog",
    Mock: BlogPostMockup,
  },
  {
    id: "blog-empty",
    label: "B3. Blog empty",
    title: "Blog — empty state",
    note: "If no published posts yet. Still offers trial CTA.",
    group: "Marketing · Blog",
    Mock: BlogEmptyMockup,
  },
  {
    id: "guest-expenses",
    label: "1. Expenses (home)",
    title: "Guest expenses — app entry point",
    note: "User lands here. No sign-up. 7-day trial starts immediately. Ref: Money Lover, Spendee instant tracking.",
    group: "Guest (trial)",
    Mock: GuestExpensesMockup,
  },
  {
    id: "guest-notif-setup",
    label: "2. Notifications setup",
    title: "Guest notifications — add contact",
    note: "Guest must add email + mobile before seeing activity alerts.",
    group: "Guest (trial)",
    Mock: GuestNotificationsSetupMockup,
  },
  {
    id: "guest-notif-activity",
    label: "3. Notifications activity",
    title: "Guest notifications — activity feed",
    note: "User activity: expenses added, trial reminders, weekly summaries.",
    group: "Guest (trial)",
    Mock: GuestNotificationsActivityMockup,
  },
  {
    id: "upgrade",
    label: "4. Subscribe",
    title: "Trial ended — subscribe",
    note: "After 7 days. Subscribe to keep data. Unsubscribed data deleted after 3 months from account creation.",
    group: "Subscribe",
    Mock: UpgradeMockup,
  },
  {
    id: "register",
    label: "5. Create account",
    title: "Register (optional during trial)",
    note: "User can create account anytime during trial to save progress.",
    group: "Auth",
    Mock: RegisterMockup,
  },
  {
    id: "login",
    label: "6. Sign in",
    title: "Login",
    note: "Returning users with an account.",
    group: "Auth",
    Mock: LoginMockup,
  },
  {
    id: "dashboard",
    label: "7. Dashboard",
    title: "Dashboard (subscriber)",
    note: "Full app after subscription. Stats + category breakdown.",
    group: "Subscriber",
    Mock: DashboardMockup,
  },
  {
    id: "expenses",
    label: "8. Expenses",
    title: "Expenses (subscriber)",
    note: "Cloud-synced expenses for paying users.",
    group: "Subscriber",
    Mock: ExpensesMockup,
  },
  {
    id: "reports",
    label: "9. Reports",
    title: "Reports (subscriber)",
    note: "Analytics — subscriber only.",
    group: "Subscriber",
    Mock: ReportsMockup,
  },
  {
    id: "notifications",
    label: "10. Notifications",
    title: "Notifications (subscriber)",
    note: "Email & SMS alerts for subscribed users.",
    group: "Subscriber",
    Mock: NotificationsMockup,
  },
];

const groups = ["Marketing · Blog", "Guest (trial)", "Auth", "Subscribe", "Subscriber"] as const;

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen" style={{ background: brand.soft }}>
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur" style={{ borderColor: brand.border }}>
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: brand.primary }}>
              Design review · Crimson orange & white
            </p>
            <h1 className="text-xl font-bold" style={{ color: brand.ink }}>
              ExpenseKit — Design review
            </h1>
            <p className="text-sm text-slate-500">Blog (marketing) + Guest-first UX (v3)</p>
          </div>
          <p className="max-w-xl text-right text-sm text-slate-500">
            Inspired by{" "}
            <a href="https://moneylover.me/" className="underline" target="_blank" rel="noreferrer">
              Money Lover
            </a>
            ,{" "}
            <a href="https://fastbudget.app/" className="underline" target="_blank" rel="noreferrer">
              Fast Budget
            </a>
            ,{" "}
            <a href="https://www.spendee.com/" className="underline" target="_blank" rel="noreferrer">
              Spendee
            </a>
            . Reply <span className="font-semibold text-slate-700">“Design approved — implement”</span> to ship.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <nav className="lg:sticky lg:top-28 lg:self-start">
          {groups.map((group) => (
            <div key={group} className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{group}</p>
              <ul className="space-y-1">
                {screens
                  .filter((s) => s.group === group)
                  .map((screen) => (
                    <li key={screen.id}>
                      <a
                        href={`#${screen.id}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
                      >
                        {screen.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div
            className="rounded-xl border p-4 text-sm"
            style={{ borderColor: brand.border, background: brand.light }}
          >
            <p className="font-semibold" style={{ color: brand.ink }}>
              UX flow
            </p>
            <p className="mt-2 text-slate-600">
              Land on <strong>Expenses</strong> → 7-day trial → optional account → subscribe → full app
            </p>
            <ul className="mt-3 space-y-1 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded" style={{ background: brand.primary }} /> #E85D04
              </li>
              <li>White cards on soft orange bg</li>
            </ul>
          </div>
        </nav>

        <div className="space-y-16 pb-20">
          {screens.map((screen) => (
            <MockupFrame key={screen.id} id={screen.id} title={screen.title} note={screen.note}>
              <screen.Mock />
            </MockupFrame>
          ))}
        </div>
      </div>
    </div>
  );
}
