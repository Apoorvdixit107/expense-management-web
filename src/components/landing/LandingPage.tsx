"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { isAuthenticated } from "@/lib/auth";
import { postAuthPath } from "@/lib/navigation";

const features = [
  {
    title: "Policy at the point of spend",
    description: "Set limits and receipt rules once — every submission is checked before it hits your books.",
  },
  {
    title: "Approvals finance trusts",
    description: "Single-level approval queue with audit trail. Nothing posts until finance says yes.",
  },
  {
    title: "GST-ready from day one",
    description: "GST splits, summaries, and exports built for Indian SMBs and your CA.",
  },
];

export function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(postAuthPath());
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <header className="sticky top-0 z-50 border-b border-[#ebebeb] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo href="/" height={40} />

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b6b6b] md:flex">
            <a href="#features" className="transition hover:text-[#212121]">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-[#212121]">
              Pricing
            </a>
            <Link href="/login" className="transition hover:text-[#212121]">
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg border border-[#d1d1d1] px-4 py-2 text-sm font-medium text-[#212121] transition hover:bg-[#fafafa] sm:inline-flex"
            >
              Contact sales
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Built for Indian SMBs · GST-native · Close books with confidence
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#212121] sm:text-5xl lg:text-[3.25rem]">
              Control company spend before it hits your books.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#6b6b6b]">
              India&apos;s spend management platform — policies, approvals, and GST-ready reports for
              growing businesses. Replace receipt chaos with one system your accountant will actually use.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex rounded-lg bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-hover"
              >
                Get started — 14 days free
              </Link>
              <Link
                href="/login"
                className="inline-flex rounded-lg border border-[#d1d1d1] bg-white px-7 py-3.5 text-base font-semibold text-[#212121] transition hover:bg-[#fafafa]"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#9b9b9b]">Start your company workspace — no card required.</p>
          </div>

          <div className="relative hidden lg:block">
            <HeroIllustration />
          </div>
        </section>

        <section id="features" className="border-t border-[#ebebeb] bg-[#fafafa] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#212121]">
              Spend control built for finance teams
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#6b6b6b]">
              ExpenseKit brings policies, approvals, and GST compliance into one calm workspace.
            </p>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#ebebeb] bg-white p-8 shadow-sm"
                >
                  <div className="mb-4 h-1 w-10 rounded-full bg-brand" />
                  <h3 className="text-lg font-bold text-[#212121]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#212121]">Simple plans for growing teams</h2>
            <p className="mt-4 text-[#6b6b6b]">
              14-day company trial. Upgrade when you need full spend control, policies, and team seats.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex rounded-lg bg-brand px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-hover"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ebebeb] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-[#9b9b9b] sm:flex-row">
          <p>© {new Date().getFullYear()} ExpenseKit</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-[#212121]">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-[#212121]">
              Register
            </Link>
            <Link href="/cookies" className="hover:text-[#212121]">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
        <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
          <rect x="20" y="100" width="24" height="40" fill="#FFE8D9" stroke="#212121" strokeWidth="2" />
          <rect x="56" y="70" width="24" height="70" fill="#FF6C37" stroke="#212121" strokeWidth="2" />
          <rect x="92" y="50" width="24" height="90" fill="#FFF3CD" stroke="#212121" strokeWidth="2" />
          <rect x="128" y="80" width="24" height="60" fill="#FFE8D9" stroke="#212121" strokeWidth="2" />
          <line x1="16" y1="140" x2="184" y2="140" stroke="#212121" strokeWidth="2" />
          <circle cx="160" cy="36" r="14" fill="#FF6C37" stroke="#212121" strokeWidth="2" />
          <text x="100" y="28" textAnchor="middle" fontSize="11" fill="#6b6b6b" fontFamily="sans-serif">
            Monthly spend
          </text>
        </svg>
      </div>
      <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
        <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
          <rect x="30" y="30" width="140" height="90" rx="8" fill="#fafafa" stroke="#212121" strokeWidth="2" />
          <circle cx="55" cy="55" r="10" fill="#FF6C37" stroke="#212121" strokeWidth="2" />
          <line x1="75" y1="50" x2="150" y2="50" stroke="#d1d1d1" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="65" x2="130" y2="65" stroke="#d1d1d1" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="80" x2="140" y2="80" stroke="#d1d1d1" strokeWidth="3" strokeLinecap="round" />
          <rect x="50" y="100" width="100" height="28" rx="6" fill="#FF6C37" stroke="#212121" strokeWidth="2" />
          <text x="100" y="118" textAnchor="middle" fontSize="10" fill="white" fontFamily="sans-serif" fontWeight="bold">
            Add expense
          </text>
        </svg>
      </div>
    </div>
  );
}
