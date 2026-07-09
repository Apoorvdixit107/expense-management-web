import { Badge } from "@/components/ui/Badge";
import { spendStatusBadgeVariant, spendStatusLabel } from "@/lib/spend";
import type { SpendStatus } from "@/lib/types";

export function SpendStatusBadge({ status }: { status?: SpendStatus | null }) {
  return <Badge variant={spendStatusBadgeVariant(status)}>{spendStatusLabel(status)}</Badge>;
}

export function PolicyWarning({ message }: { message: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
      title={message}
    >
      <span aria-hidden>⚠</span> Policy
    </span>
  );
}
