"use client";

import { useCallback, useState } from "react";
import { ConfirmDeleteDialog, SOFT_DELETE_MESSAGE } from "@/components/ui/ConfirmDeleteDialog";

type UseConfirmDeleteOptions<T> = {
  title: string;
  getItemName?: (item: T) => string | undefined;
  getMessage?: (item: T) => string;
  onConfirm: (item: T) => void | Promise<void>;
};

export function useConfirmDelete<T>({
  title,
  getItemName,
  getMessage,
  onConfirm,
}: UseConfirmDeleteOptions<T>) {
  const [target, setTarget] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const requestDelete = useCallback((item: T) => setTarget(item), []);

  const close = useCallback(() => {
    if (!loading) setTarget(null);
  }, [loading]);

  const confirm = useCallback(async () => {
    if (!target || loading) return;
    setLoading(true);
    try {
      await onConfirm(target);
      setTarget(null);
    } finally {
      setLoading(false);
    }
  }, [target, loading, onConfirm]);

  const dialog = (
    <ConfirmDeleteDialog
      open={target != null}
      onClose={close}
      onConfirm={confirm}
      title={title}
      itemName={target && getItemName ? getItemName(target) : undefined}
      message={
        target && getMessage
          ? getMessage(target)
          : target
            ? SOFT_DELETE_MESSAGE
            : undefined
      }
      loading={loading}
    />
  );

  return { requestDelete, dialog, deleting: loading };
}
