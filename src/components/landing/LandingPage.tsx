"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductIcon } from "@/components/marketing/ProductIcon";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { isAuthenticated } from "@/lib/auth";
import { postAuthPath } from "@/lib/navigation";
import { LANDING_FEATURE_GROUPS } from "@/lib/product-nav";

export function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(postAuthPath());
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <MarketingHeader />

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand sm:text-sm sm:tracking-widest">
              Built for Indian SMBs · GST-native · Close books with confidence
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-[#212121] sm:text-5xl lg:text-[3.25rem]">
              Control company spend before it hits your books.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#6b6b6b] sm:mt-6 sm:text-lg">
              India&apos;s spend management platform — policies, approvals, and GST-ready reports for
              growing businesses. Replace receipt chaos with one system your accountant will actually use.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-hover sm:w-auto"
              >
                Get started — 14 days free
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#d1d1d1] bg-white px-7 py-3.5 text-base font-semibold text-[#212121] transition hover:bg-[#fafafa] sm:w-auto"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#9b9b9b]">Start your company workspace — no card required.</p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <HeroIllustration />
          </div>
        </section>

        <section id="features" className="border-t border-[#ebebeb] bg-[#fafafa] py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-[#212121] sm:text-3xl">
              Spend control built for finance teams
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#6b6b6b]">
              ExpenseKit brings policies, approvals, GST, budgets, and AI capture into one calm
              workspace — explore every capability below.
            </p>

            <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
              {LANDING_FEATURE_GROUPS.map((group) => (
                <div key={group.id} id={group.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b9b9b]">
                    {group.label}
                  </p>
                  <div className="mt-5 grid gap-4 sm:gap-6 md:grid-cols-3">
                    {group.items.map((feature) => (
                      <article
                        key={feature.id}
                        id={feature.id}
                        className="scroll-mt-24 rounded-2xl border border-[#ebebeb] bg-white p-5 shadow-sm sm:scroll-mt-28 sm:p-7"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3ee] text-brand">
                          <ProductIcon id={feature.icon} />
                        </div>
                        <h3 className="text-lg font-bold text-[#212121]">{feature.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">{feature.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#212121] sm:text-3xl">
              Plans for shops, teams, and industry
            </h2>
            <p className="mt-4 text-[#6b6b6b]">
              Free for home &amp; shop. Starter from ₹999/mo. Growth for multi-entity teams. Custom for
              industrialists.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-hover sm:w-auto"
              >
                View pricing
              </Link>
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#d1d1d1] bg-white px-8 py-3.5 text-base font-semibold text-[#212121] transition hover:bg-[#fafafa] sm:w-auto"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="rounded-2xl border border-[#e0e0e0] bg-white p-4 shadow-sm sm:p-6">
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
      <div className="mt-4 rounded-2xl border border-[#e0e0e0] bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
        <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
          <rect x="30" y="30" width="140" height="90" rx="8" fill="#fafafa" stroke="#212121" strokeWidth="2" />
          <circle cx="55" cy="55" r="10" fill="#FF6C37" stroke="#212121" strokeWidth="2" />
          <line x1="75" y1="50" x2="150" y2="50" stroke="#d1d1d1" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="65" x2="130" y2="65" stroke="#d1d1d1" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="80" x2="140" y2="80" stroke="#d1d1d1" strokeWidth="3" strokeLinecap="round" />
          <rect x="50" y="100" width="100" height="28" rx="6" fill="#FF6C37" stroke="#212121" strokeWidth="2" />
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fontSize="10"
            fill="white"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            Add expense
          </text>
        </svg>
      </div>
    </div>
  );
}
