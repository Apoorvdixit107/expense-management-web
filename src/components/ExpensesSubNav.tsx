"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/expenses", label: "Spend list" },
  { href: "/expenses/upload", label: "Capture receipt", premium: true },
];

export function ExpensesSubNav() {
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

export function PremiumStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={`text-amber-500 ${className}`}
    >
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 17.8 5.7 21.2l1.7-7L2 9.5l7.1-.6L12 2z" />
    </svg>
  );
}
