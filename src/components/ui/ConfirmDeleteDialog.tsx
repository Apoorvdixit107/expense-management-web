"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
  const body =
    message ??
    (itemName
      ? `You will lose all the data of "${itemName}" and will not be able to retrieve it. Do you still want to delete?`
      : DEFAULT_DELETE_MESSAGE);

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={body}
      confirmLabel={confirmLabel}
      confirmVariant="danger"
      loading={loading}
      loadingLabel="Deleting..."
    />
  );
}
