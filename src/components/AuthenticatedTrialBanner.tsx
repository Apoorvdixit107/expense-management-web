"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { isOnFreeTrial, trialDaysLeft } from "@/lib/premium-access";

export function AuthenticatedTrialBanner() {
  if (!isOnFreeTrial()) return null;

  const daysLeft = trialDaysLeft();

  return (
    <div className="mb-6 rounded-2xl border border-brand/30 bg-brand-light/40 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink">
          <span className="font-bold">{daysLeft} day{daysLeft === 1 ? "" : "s"} left</span> in your
          free trial — all premium features are unlocked.
        </p>
        <Button href="/manage-plan" className="h-9 px-4 text-xs">
          View plans
        </Button>
      </div>
    </div>
  );
}

export function TrialExpiredBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-dashed border-border bg-surface px-4 py-4 text-center text-sm text-muted">
      Your free trial has ended.{" "}
      <Link href="/manage-plan" className="font-semibold text-brand hover:text-brand-hover">
        Subscribe to Pro or Beast
      </Link>{" "}
      to keep premium features like AI receipt scan, reports, and approvals.
    </div>
  );
}
