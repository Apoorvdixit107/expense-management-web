"use client";

import { useCallback, useRef, useState } from "react";
import {
  ConfirmDialog,
  type ConfirmDialogVariant,
} from "@/components/ui/ConfirmDialog";

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmDialogVariant;
};

type PendingConfirm = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

/**
 * Promise-based confirm that renders the styled ConfirmDialog
 * (same look as Delete transaction) instead of window.confirm.
 */
export function useConfirmDialog() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const pendingRef = useRef<PendingConfirm | null>(null);

  const settle = useCallback((confirmed: boolean) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    current?.resolve(confirmed);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      const next: PendingConfirm = { ...options, resolve };
      pendingRef.current = next;
      setPending(next);
    });
  }, []);

  const dialog = (
    <ConfirmDialog
      open={pending != null}
      onClose={() => settle(false)}
      onConfirm={() => settle(true)}
      title={pending?.title ?? ""}
      message={pending?.message ?? ""}
      confirmLabel={pending?.confirmLabel}
      cancelLabel={pending?.cancelLabel}
      confirmVariant={pending?.confirmVariant ?? "primary"}
    />
  );

  return { confirm, dialog };
}
