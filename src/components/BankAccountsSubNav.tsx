"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";

const tabs = [
  { href: "/bank-accounts", label: "Cash & Bank" },
  { href: "/bank-accounts/connect", label: "Connect bank account", premium: true },
];

export function BankAccountsSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-1.5 rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? "border-b-2 border-brand text-brand"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.premium ? <PremiumStarIcon /> : null}
          </Link>
        );
      })}
    </div>
  );
}
