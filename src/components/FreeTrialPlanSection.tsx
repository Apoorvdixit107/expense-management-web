"use client";

import { useEffect, useState } from "react";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isOnFreeTrial, trialDaysLeft, trialExpiredForUser } from "@/lib/premium-access";
import {
  TRIAL_DAYS,
  ensureTrialStarted,
  getTrialEndDate,
  getTrialProgressPercent,
  getTrialStart,
} from "@/lib/trial";

const TRIAL_FEATURES = [
  "AI receipt capture & smart scan",
  "Approvals, policies & team management",
  "Reports, insights & export",
  "Ask finance AI & bank connection",
] as const;

function formatTrialDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DaysCounter({
  daysLeft,
  variant = "active",
}: {
  daysLeft: number;
  variant?: "active" | "expired";
}) {
  const active = variant === "active";

  return (
    <div
      className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border-2 bg-surface shadow-sm ${
        active ? "border-brand/40" : "border-error/30"
      }`}
      aria-live="polite"
      aria-label={`${daysLeft} days remaining in free trial`}
    >
      <span
        className={`text-4xl font-extrabold tabular-nums ${active ? "text-brand" : "text-error"}`}
      >
        {daysLeft}
      </span>
      <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
        day{daysLeft === 1 ? "" : "s"} left
      </span>
    </div>
  );
}

export function FreeTrialPlanSection() {
  const [mounted, setMounted] = useState(false);
  const [daysLeft, setDaysLeft] = useState(TRIAL_DAYS);

  useEffect(() => {
    ensureTrialStarted();
    setMounted(true);
    setDaysLeft(trialDaysLeft());

    const interval = window.setInterval(() => {
      setDaysLeft(trialDaysLeft());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-brand/30 bg-brand-light/20">
        <p className="text-sm text-muted">Loading free trial status...</p>
      </Card>
    );
  }

  const expired = trialExpiredForUser();
  const onTrial = isOnFreeTrial();
  const trialStart = getTrialStart();
  const trialEnd = getTrialEndDate();
  const progress = getTrialProgressPercent();
  const dayNumber = TRIAL_DAYS - daysLeft;

  if (expired) {
    return (
      <Card className="overflow-hidden border-error/30 p-0">
        <div className="bg-error/5 px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-error">Free trial ended</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Subscribe to keep premium access</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                Your {TRIAL_DAYS}-day trial has ended. Premium features like AI receipt scan, approvals,
                reports, and Ask finance are locked until you choose Pro or Beast below.
              </p>
            </div>
            <DaysCounter daysLeft={0} variant="expired" />
          </div>
        </div>
        <div className="space-y-4 px-6 py-5">
          <ul className="grid gap-2 sm:grid-cols-2">
            {TRIAL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-0.5 text-muted" aria-hidden>
                  —
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <Button href="#plans" variant="primary" className="h-10">
            View plans &amp; subscribe
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-brand/30 p-0">
      <div className="bg-gradient-to-br from-brand-light/80 to-surface px-6 py-6 dark:from-brand/10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <PremiumStarIcon className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">Your free trial</p>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-ink">
              {onTrial ? "All premium features are unlocked" : `Start your ${TRIAL_DAYS}-day free trial`}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Every account gets a {TRIAL_DAYS}-day free trial on Pro and Beast — no card required. Use
              everything now: capture receipts, run approvals, export reports, and more. Subscribe before
              the counter hits zero to keep access without interruption.
            </p>
          </div>
          <DaysCounter daysLeft={daysLeft} />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>
              Day {Math.max(1, dayNumber)} of {TRIAL_DAYS}
            </span>
            {trialEnd ? <span>Trial ends {formatTrialDate(trialEnd)}</span> : null}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {trialStart ? (
            <p className="mt-2 text-xs text-muted">Started {formatTrialDate(trialStart)}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-ink">Unlocked during your trial</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {TRIAL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-0.5 text-brand" aria-hidden>
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-paper px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-ink">After the trial:</span> premium pages ask you to
          subscribe. Basic spend tracking stays free. Pro and Beast both include the same{" "}
          {TRIAL_DAYS}-day trial for new accounts.
        </div>

        <div className="flex flex-wrap gap-3">
          <Button href="#plans" variant="primary" className="h-10">
            Choose a plan
          </Button>
          <Button href="/expenses" variant="secondary" className="h-10">
            Continue exploring
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PlanTrialBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
      <PremiumStarIcon className="h-3 w-3" />
      {TRIAL_DAYS}-day free trial included
    </span>
  );
}
