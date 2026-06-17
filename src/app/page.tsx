import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="text-xl font-bold">ExpenseKit</span>
        <div className="flex gap-3">
          <Button href="/login" variant="ghost" className="text-white hover:bg-white/10">
            Sign in
          </Button>
          <Button href="/register">Get started</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-16">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">Expense Management</p>
          <h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">
            Know where your money goes. Every day.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Track expenses, get smart alerts, and view beautiful reports — built for professionals who want
            clarity without complexity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register">Start free</Button>
            <Button href="/login" variant="secondary">
              Sign in
            </Button>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            ["Track", "Add expenses in seconds with categories and notes."],
            ["Analyze", "7-day, 30-day, monthly and yearly spending reports."],
            ["Alert", "Get notified on high spends and important activity."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-300">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-2xl border border-teal-400/30 bg-teal-950/40 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Simple pricing</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-6">
              <p className="font-semibold text-teal-300">Free</p>
              <p className="mt-2 text-3xl font-black">₹0</p>
              <p className="mt-4 text-sm text-slate-300">50 expenses/month, 7-day reports</p>
            </div>
            <div className="rounded-xl border border-teal-400/40 bg-teal-900/20 p-6">
              <p className="font-semibold text-teal-300">Pro</p>
              <p className="mt-2 text-3xl font-black">₹149/mo</p>
              <p className="mt-4 text-sm text-slate-300">Unlimited expenses, full reports, export</p>
            </div>
          </div>
          <Link href="/register" className="mt-8 inline-block text-sm font-semibold text-teal-300 hover:text-teal-200">
            Create your free account →
          </Link>
        </section>
      </main>
    </div>
  );
}
