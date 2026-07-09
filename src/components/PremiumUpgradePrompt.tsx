"use client";

import Link from "next/link";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TRIAL_DAYS } from "@/lib/trial";

type PremiumUpgradePromptProps = {
  featureName?: string;
};

export function PremiumUpgradePrompt({ featureName }: PremiumUpgradePromptProps) {
  const label = featureName ?? "This feature";

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20">
        <PremiumStarIcon className="h-7 w-7" />
      </div>
      <span className="inline-block rounded-full bg-error/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-error">
        Premium feature
      </span>
      <h1 className="mt-4 text-2xl font-bold text-ink">Subscribe to unlock {label.toLowerCase()}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Your {TRIAL_DAYS}-day free trial has ended. To keep using premium tools — AI receipt scan,
        approvals, reports, Ask finance, bank connection, and more — choose a Pro or Beast plan.
      </p>

      <Card className="mt-8 w-full p-6 text-left">
        <p className="font-semibold text-ink">Included with every paid plan</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>✓ AI receipt capture &amp; smart scan</li>
          <li>✓ Approvals, policies &amp; team management</li>
          <li>✓ Full reports, insights &amp; export</li>
          <li>✓ Ask finance AI assistant &amp; bank connect</li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/manage-plan" className="flex-1">
            View plans &amp; subscribe
          </Button>
          <Button href="/expenses" variant="secondary" className="flex-1">
            Back to Spend
          </Button>
        </div>
      </Card>

      <p className="mt-6 text-xs text-muted">
        Questions?{" "}
        <Link href="/manage-plan" className="font-semibold text-brand hover:text-brand-hover">
          Compare Pro and Beast
        </Link>
      </p>
    </div>
  );
}
