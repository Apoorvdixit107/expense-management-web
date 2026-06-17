import { formatCurrency } from "@/lib/format";
import type { ExpenseType } from "@/lib/types";

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 19V5M12 5L6 11M12 5L18 11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5V19M12 19L6 13M12 19L18 13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type TransactionAmountProps = {
  type: ExpenseType;
  amount: number;
  size?: "md" | "lg";
};

export function TransactionAmount({ type, amount, size = "md" }: TransactionAmountProps) {
  const isIn = type === "IN";
  const textSize = size === "lg" ? "text-2xl" : "text-xl";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold ${textSize} ${
        isIn ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {isIn ? <ArrowUpIcon className={iconSize} /> : <ArrowDownIcon className={iconSize} />}
      <span>{isIn ? "+" : "−"}</span>
      <span>{formatCurrency(amount)}</span>
    </span>
  );
}

export function TransactionTypeBadge({ type }: { type: ExpenseType }) {
  const isIn = type === "IN";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isIn ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isIn ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
      {isIn ? "Money in" : "Money out"}
    </span>
  );
}

export function OrganizationBalance({
  balance,
  variant = "default",
  size = "md",
}: {
  balance: number;
  variant?: "default" | "sidebar";
  size?: "md" | "lg";
}) {
  const positive = balance >= 0;
  const color =
    variant === "sidebar"
      ? positive
        ? "text-emerald-400"
        : "text-red-400"
      : positive
        ? "text-emerald-600"
        : "text-red-600";
  const textSize = size === "lg" ? "text-3xl" : "text-sm";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${textSize} ${color}`}>
      {positive ? <ArrowUpIcon className={iconSize} /> : <ArrowDownIcon className={iconSize} />}
      {formatCurrency(Math.abs(balance))}
      {size === "md" ? (
        <span className="font-normal opacity-80">{positive ? "balance" : "deficit"}</span>
      ) : null}
    </span>
  );
}
