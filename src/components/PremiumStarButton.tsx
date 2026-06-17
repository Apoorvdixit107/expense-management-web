"use client";

import Link from "next/link";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { isSubscriber } from "@/lib/navigation";

export function PremiumStarButton() {
  const subscriber = isSubscriber();
  const href = subscriber ? "/expenses/upload" : "/manage-plan";
  const title = subscriber ? "Premium — Upload bill with AI" : "Premium features — upgrade to unlock";

  return (
    <Link
      href={href}
      title={title}
      aria-label={title}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/60 bg-gradient-to-br from-amber-100 to-amber-50 shadow-sm transition hover:border-amber-400 hover:from-amber-200 hover:to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 dark:hover:from-amber-900/50"
    >
      <PremiumStarIcon className="h-[18px] w-[18px] drop-shadow-sm transition group-hover:scale-110" />
    </Link>
  );
}
