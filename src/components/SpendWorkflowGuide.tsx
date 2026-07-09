"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { SpendStatusFilter } from "@/lib/spend";

const STORAGE_KEY = "expensekit-spend-workflow-guide-v1";

const STATUS_ROWS = [
  {
    label: "Draft",
    color: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
    summary: "Saved, not finalized",
    detail: "You can edit freely. Nothing is added to reports or your balance until you submit.",
  },
  {
    label: "Pending",
    color: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
    summary: "Waiting for approval",
    detail: "Your team lead or finance needs to approve this before it counts. You cannot edit while pending.",
  },
  {
    label: "Posted",
    color: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
    summary: "Final — counts in reports",
    detail: "Locked to keep your books accurate. To fix a wrong category, use Change category (not Delete).",
  },
  {
    label: "Rejected",
    color: "bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-100",
    summary: "Not in reports",
    detail: "Removed from totals or sent back for fixes. Edit, then Submit to post again.",
  },
] as const;

const FIX_STEPS = [
  "Find the spend under Posted and click Change category.",
  "Update the category (or other details) and save.",
  "Click Submit — it goes back to Posted and updates your totals.",
] as const;

export const SPEND_STATUS_TAB_HINTS: Record<SpendStatusFilter, string | null> = {
  all: null,
  DRAFT: "Drafts are not in your balance yet. Edit anytime, then Submit when ready.",
  PENDING_APPROVAL: "Waiting for approval. You cannot edit until it is approved or rejected.",
  POSTED: "Posted spends are locked. Wrong category? Use Change category on the row — do not delete unless you want to remove it entirely.",
  REJECTED: "Not counted in reports. Edit the spend and Submit again to post it.",
};

type SpendWorkflowGuideProps = {
  open: boolean;
  onClose: () => void;
};

export function SpendWorkflowGuide({ open, onClose }: SpendWorkflowGuideProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How spend statuses work"
      subtitle="A quick guide so drafts, posted, and rejected never feel confusing."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {STATUS_ROWS.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-border bg-paper px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${row.color}`}>
                  {row.label}
                </span>
                <span className="text-sm font-semibold text-ink">{row.summary}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{row.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-4">
          <p className="text-sm font-bold text-ink">Need to fix a category on a Posted spend?</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {FIX_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl bg-paper px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-ink">Tip:</span> When recording new spend, turn on{" "}
          <span className="font-semibold text-ink">Save as draft</span> if you might need to edit
          before it is finalized.
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}

type SpendWorkflowHelpButtonProps = {
  onClick: () => void;
  className?: string;
  label?: string;
};

export function SpendWorkflowHelpButton({
  onClick,
  className = "",
  label = "How statuses work",
}: SpendWorkflowHelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-border bg-paper px-3 py-1.5 text-sm font-semibold text-muted transition hover:border-brand/40 hover:text-brand ${className}`}
      aria-label={label}
      title={label}
    >
      <span className="text-base leading-none" aria-hidden>
        💡
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/** Show the guide once per browser, then only when the user opens it. */
export function useSpendWorkflowFirstVisit() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      const timer = window.setTimeout(() => setOpen(true), 600);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, []);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  return { firstVisitOpen: open, closeFirstVisit: close };
}

export function SpendStatusTabHint({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-border bg-paper px-4 py-3 text-sm leading-relaxed text-muted">
      <span className="mt-0.5 shrink-0 text-base" aria-hidden>
        💡
      </span>
      <span>{message}</span>
    </p>
  );
}
