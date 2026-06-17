"use client";

import { dismissToast } from "./store";
import type { Toast, ToastType } from "./types";

const toastStyles: Record<ToastType, string> = {
  success:
    "border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--surface-card))] text-ink",
  error:
    "border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_10%,var(--surface-card))] text-ink",
  warning:
    "border-[color-mix(in_srgb,#d97706_35%,transparent)] bg-[color-mix(in_srgb,#d97706_12%,var(--surface-card))] text-ink",
  info:
    "border-[color-mix(in_srgb,var(--brand-primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand-primary)_10%,var(--surface-card))] text-ink"
};

const iconStyles: Record<ToastType, string> = {
  success: "bg-[var(--semantic-success)] text-white",
  error: "bg-[var(--semantic-error)] text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-brand text-white"
};

const labels: Record<ToastType, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info"
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.25 7.25a1 1 0 0 1-1.4 0l-3.25-3.25a1 1 0 1 1 1.4-1.4l2.55 2.55 6.55-6.55a1 1 0 0 1 1.4 0Z" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.53 10.53a.75.75 0 1 1-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 1 1-1.06-1.06L8.94 10 6.47 7.53a.75.75 0 1 1 1.06-1.06L10 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L11.06 10l2.47 2.53Z" />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M10 2.25 2.75 16.5h14.5L10 2.25Zm0 4.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V7.5A.75.75 0 0 1 10 6.75Zm0 8.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4.25a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0v-5ZM10 14.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    </svg>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-[var(--shadow-elevated)] backdrop-blur ${toastStyles[toast.type]}`}
    >
      <span
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${iconStyles[toast.type]}`}
        aria-hidden="true"
      >
        <ToastIcon type={toast.type} />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-muted">{labels[toast.type]}</p>
        <p className="mt-1 text-sm font-semibold leading-snug">{toast.message}</p>
      </div>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismissToast(toast.id)}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted transition hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M5.53 5.53a.75.75 0 0 1 1.06 0L10 8.94l3.41-3.41a.75.75 0 1 1 1.06 1.06L11.06 10l3.41 3.41a.75.75 0 1 1-1.06 1.06L10 11.06l-3.41 3.41a.75.75 0 0 1-1.06-1.06L8.94 10 5.53 6.59a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
