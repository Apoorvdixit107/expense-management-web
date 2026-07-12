import type { ReactNode } from "react";
import type { ProductIconId } from "@/lib/product-nav";

const paths: Record<ProductIconId, ReactNode> = {
  expense: (
    <path
      d="M4 7h12M4 11h8M6 3v2m8-2v2M5 5h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  policies: (
    <path
      d="M10 3 4.5 5.5v4.2c0 3.3 2.3 5.4 5.5 6.3 3.2-.9 5.5-3 5.5-6.3V5.5L10 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  approvals: (
    <>
      <path
        d="M6 10.5 8.5 13l5.5-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  gst: (
    <path
      d="M4 15V5h8l4 4v6H4Zm8 0V9h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  reports: (
    <path
      d="M5 15V9m5 6V5m5 10v-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  ledger: (
    <path
      d="M3.5 8.5h13M6 5.5h8a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 14 14.5H6A1.5 1.5 0 0 1 4.5 13v-6A1.5 1.5 0 0 1 6 5.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  budgets: (
    <path
      d="M4 15h12M5.5 15V8.5L10 5l4.5 3.5V15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  entities: (
    <path
      d="M3.5 15.5h13M5 15.5V6.5l5-3 5 3v9M8 15.5V11h4v4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  team: (
    <path
      d="M7 14v-1a3 3 0 0 1 6 0v1M10 8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.5 5.5v-.8a2.2 2.2 0 0 0-1.6-2.1M13.8 5.6a2 2 0 0 1 0 3.4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  ai: (
    <path
      d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M5.4 14.6l1.4-1.4M13.2 6.8l1.4-1.4M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  alerts: (
    <path
      d="M10 15.5a1.5 1.5 0 0 0 1.5-1.5h-3A1.5 1.5 0 0 0 10 15.5ZM5.5 13h9l-1.2-1.2V9a3.3 3.3 0 0 0-6.6 0v2.8L5.5 13Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  assistant: (
    <path
      d="M5 13.5 3.5 16V6.5A1.5 1.5 0 0 1 5 5h10a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 15 15H5Zm3-5h4M8 10.5h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export function ProductIcon({
  id,
  className = "h-5 w-5",
}: {
  id: ProductIconId;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      {paths[id]}
    </svg>
  );
}
