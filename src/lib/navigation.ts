import { isAuthenticated } from "./auth";
import { isSubscribed } from "./subscription";
import type { OrgMemberRole } from "./types";

export function isSubscriber(): boolean {
  return isAuthenticated() && isSubscribed();
}

export { isAuthenticated };

export function postAuthPath(): string {
  return "/dashboard";
}

export type AppNavLink = {
  href: string;
  label: string;
  icon: string;
  premium?: boolean;
};

/** Spend-management navigation (Phase 1 pivot). */
export const subscriberNavLinks: AppNavLink[] = [
  { href: "/dashboard", label: "Overview", icon: "◉" },
  { href: "/expenses", label: "Spend", icon: "₹" },
  { href: "/approvals", label: "Approvals", icon: "✓" },
  { href: "/policies", label: "Policies", icon: "⚑" },
  { href: "/budgets", label: "Budgets & limits", icon: "⊞" },
  { href: "/profit", label: "Insights", icon: "◈" },
  { href: "/tax", label: "Tax & compliance", icon: "₪" },
  { href: "/reports", label: "Reports & export", icon: "▤" },
  { href: "/bank-accounts", label: "Ledger", icon: "◇" },
  { href: "/expenses/upload", label: "Capture receipt", icon: "↑", premium: true },
  { href: "/team", label: "Team", icon: "👥" },
  { href: "/organizations", label: "Entities", icon: "▣" },
  { href: "/notifications", label: "Alerts", icon: "◔" },
  { href: "/assistant", label: "Ask finance", icon: "✦", premium: true },
  { href: "/bank-accounts/connect", label: "Connect Bank", icon: "⧉", premium: true },
  { href: "/refer-and-earn", label: "Refer & earn", icon: "↗" },
  { href: "/manage-plan", label: "Plan & billing", icon: "◆" },
  { href: "/profile", label: "Account", icon: "◎" },
];

export const memberNavLinks: AppNavLink[] = [
  { href: "/dashboard", label: "Overview", icon: "◉" },
  { href: "/expenses", label: "Spend", icon: "₹" },
  { href: "/expenses/upload", label: "Capture receipt", icon: "↑", premium: true },
  { href: "/budgets", label: "Budgets & limits", icon: "⊞" },
  { href: "/tax", label: "Tax & compliance", icon: "₪" },
  { href: "/bank-accounts", label: "Ledger", icon: "◇" },
  { href: "/organizations", label: "Entities", icon: "▣" },
  { href: "/notifications", label: "Alerts", icon: "◔" },
  { href: "/profile", label: "Account", icon: "◎" },
];

export function isFinanceRole(role?: OrgMemberRole | null): boolean {
  return role === "OWNER" || role === "FINANCE";
}

export function navLinksForSubscriber(role?: OrgMemberRole | null): AppNavLink[] {
  if (!isFinanceRole(role)) {
    return subscriberNavLinks.filter(
      (link) => !["/approvals", "/policies", "/team"].includes(link.href)
    );
  }
  return subscriberNavLinks;
}
