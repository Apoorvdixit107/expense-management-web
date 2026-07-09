"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type PromptDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void | Promise<void>;
  title: string;
  message?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  optional?: boolean;
  maxLength?: number;
  loading?: boolean;
};

export function PromptDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "Add a note…",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  optional = true,
  maxLength = 500,
  loading = false,
}: PromptDialogProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  async function handleConfirm() {
    const trimmed = value.trim();
    if (!optional && !trimmed) return;
    await onConfirm(trimmed);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-elevated)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="prompt-dialog-title" className="text-lg font-bold text-ink">
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

        {message ? <p className="mt-4 text-sm leading-relaxed text-muted">{message}</p> : null}

        <div className={message ? "mt-4" : "mt-5"}>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
            placeholder={placeholder}
            rows={3}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-border bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
          />
          <p className="mt-1 text-right text-xs text-muted">
            {value.length}/{maxLength}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" disabled={loading} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={loading || (!optional && !value.trim())}
            onClick={() => void handleConfirm()}
          >
            {loading ? `${confirmLabel}…` : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
