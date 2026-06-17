"use client";

import { Button } from "@/components/ui/Button";

export const SOFT_DELETE_MESSAGE =
  "This will be moved to Deleted. You can recover it anytime from the Deleted tab. Do you still want to delete?";

const DEFAULT_DELETE_MESSAGE =
  "You will lose this data and will not be able to retrieve it. Do you still want to delete?";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete",
  itemName,
  message,
  confirmLabel = "Delete",
  loading = false,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  const body =
    message ??
    (itemName
      ? `You will lose all the data of "${itemName}" and will not be able to retrieve it. Do you still want to delete?`
      : DEFAULT_DELETE_MESSAGE);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-message"
        className="relative z-10 w-full max-w-md rounded-2xl bg-surface p-6 shadow-[var(--shadow-elevated)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="confirm-delete-title" className="text-lg font-bold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-paper hover:text-ink disabled:opacity-50"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p id="confirm-delete-message" className="mt-4 text-sm leading-relaxed text-muted">
          {body}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
