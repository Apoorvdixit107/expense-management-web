/**
 * Turn backend policy violation strings into short, user-friendly copy.
 * Backend examples:
 *   "Amount exceeds limit of ₹1000.00 (Amount of Spend); Receipt required above ₹1.00 (Amount of Spend)"
 */

export function isPolicyViolationMessage(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return (
    /exceeds?\s+limit/i.test(text) ||
    /receipt\s+required/i.test(text) ||
    /policy\s+(violation|blocked|failed)/i.test(text) ||
    /\([^)]*spend[^)]*\)/i.test(text)
  );
}

function formatCurrencySnippet(raw: string): string {
  const match = raw.match(/₹\s*([\d,]+(?:\.\d+)?)/);
  if (!match) return "";
  const amount = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount)) return match[0].replace(/\s+/g, "");
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** Friendly one-liner for toasts when submit/save is blocked by policy. */
export function getFriendlyPolicyToastMessage(raw: string): string {
  const parts = raw
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  const tips: string[] = [];

  for (const part of parts) {
    if (/exceeds?\s+limit/i.test(part)) {
      const limit = formatCurrencySnippet(part);
      tips.push(limit ? `keep the amount at or below ${limit}` : "lower the amount");
    } else if (/receipt\s+required/i.test(part)) {
      tips.push("attach a receipt");
    }
  }

  if (tips.length === 0) {
    return "This spend breaks a policy rule. Fix the details and try again.";
  }

  if (tips.length === 1) {
    return `This spend breaks a policy rule — ${tips[0]}, then try again.`;
  }

  return `This spend breaks policy rules — ${tips.join(" and ")}, then try again.`;
}

/** Short lines for inline UI (cards / badges), never raw backend dumps. */
export function formatPolicyMessageLines(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return ["This spend may break a policy rule."];

  const parts = raw
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  const lines: string[] = [];

  for (const part of parts) {
    if (/exceeds?\s+limit/i.test(part)) {
      const limit = formatCurrencySnippet(part);
      lines.push(limit ? `Amount is over the policy limit of ${limit}.` : "Amount is over the policy limit.");
    } else if (/receipt\s+required/i.test(part)) {
      const above = formatCurrencySnippet(part);
      lines.push(
        above ? `Receipt required for amounts above ${above}.` : "A receipt is required for this spend."
      );
    } else if (part.length <= 80 && !/\([^)]*\)/.test(part)) {
      lines.push(part);
    }
  }

  return lines.length > 0 ? lines : ["This spend may break a policy rule."];
}

export function formatPolicyMessageSummary(raw: string | null | undefined): string {
  return formatPolicyMessageLines(raw).join(" ");
}
