"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getDaysLeft } from "@/lib/trial";

export function TrialBanner() {
  const daysLeft = getDaysLeft();

  return (
    <div className="border-b border-border bg-brand-light px-4 py-3 lg:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink">
          <span className="font-bold">{daysLeft} days left</span> in your free trial — track expenses with no account
          needed
        </p>
        <div className="flex gap-2">
          <Button href="/register" variant="outline" className="h-9 px-4 text-xs">
            Create account
          </Button>
        <Button href="/manage-plan" className="h-9 px-4 text-xs">
          Subscribe
        </Button>
        </div>
      </div>
    </div>
  );
}
