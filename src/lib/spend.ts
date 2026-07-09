import type { Expense, OrgMemberRole, SpendStatus } from "./types";

export function canApproveRole(role?: OrgMemberRole | null): boolean {
  return role === "OWNER" || role === "FINANCE";
}

export function canEditExpense(expense: Expense): boolean {
  const status = expense.spendStatus ?? "POSTED";
  return status === "DRAFT" || status === "REJECTED";
}

export function canSubmitExpense(expense: Expense): boolean {
  const status = expense.spendStatus ?? "POSTED";
  return status === "DRAFT" || status === "REJECTED";
}

export function canVoidExpense(expense: Expense): boolean {
  const status = expense.spendStatus ?? "POSTED";
  return status === "PENDING_APPROVAL" || status === "POSTED";
}

/** Posted spends must be unlocked (voided → rejected) before editing. */
export function canCorrectExpense(expense: Expense): boolean {
  return (expense.spendStatus ?? "POSTED") === "POSTED";
}

export function canApproveExpense(expense: Expense, role?: OrgMemberRole | null): boolean {
  return canApproveRole(role) && (expense.spendStatus ?? "POSTED") === "PENDING_APPROVAL";
}

export function spendStatusLabel(status?: SpendStatus | null): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PENDING_APPROVAL":
      return "Pending approval";
    case "POSTED":
      return "Posted";
    case "REJECTED":
      return "Rejected";
    case "APPROVED":
      return "Posted";
    default:
      return "Posted";
  }
}

export type SpendStatusBadgeVariant = "draft" | "pending" | "posted" | "rejected" | "neutral";

export function spendStatusBadgeVariant(status?: SpendStatus | null): SpendStatusBadgeVariant {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "PENDING_APPROVAL":
      return "pending";
    case "REJECTED":
      return "rejected";
    case "POSTED":
    case "APPROVED":
      return "posted";
    default:
      return "posted";
  }
}

export const SPEND_STATUS_FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "DRAFT" as const, label: "Drafts" },
  { id: "PENDING_APPROVAL" as const, label: "Pending" },
  { id: "POSTED" as const, label: "Posted" },
  { id: "REJECTED" as const, label: "Rejected" },
] as const;

export type SpendStatusFilter = (typeof SPEND_STATUS_FILTERS)[number]["id"];

export const EDIT_BLOCKED_MESSAGE =
  "Posted spends are locked in reports and cannot be edited directly. Use Correct details to change the category, or delete and create a new entry.";

export const CORRECT_SPEND_CONFIRM =
  "Posted spends are locked in your ledger. To change the category or other details, we'll unlock this entry for editing (it will leave Posted totals until you save again). Continue?";

export const VOID_SPEND_CONFIRM =
  "Void this spend? It will be removed from reports and appear under Rejected, where you can edit and resubmit.";
