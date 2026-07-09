"use client";

import {
  FeatureGuideModal,
  FeatureHelpButton,
  FeatureHint,
  useFeatureGuideFirstVisit,
} from "@/components/FeatureGuide";
import { getFeatureGuide } from "@/lib/feature-guides";
import type { SpendStatusFilter } from "@/lib/spend";

const SPEND_GUIDE = getFeatureGuide("spend-statuses");

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
  return <FeatureGuideModal guide={SPEND_GUIDE} open={open} onClose={onClose} />;
}

type SpendWorkflowHelpButtonProps = {
  onClick: () => void;
  className?: string;
  label?: string;
};

export function SpendWorkflowHelpButton({
  onClick,
  className = "",
  label = SPEND_GUIDE.buttonLabel,
}: SpendWorkflowHelpButtonProps) {
  return <FeatureHelpButton onClick={onClick} className={className} label={label} />;
}

/** Show the guide once per browser, then only when the user opens it. */
export function useSpendWorkflowFirstVisit() {
  return useFeatureGuideFirstVisit("spend-statuses", true);
}

export function SpendStatusTabHint({ message }: { message: string }) {
  return <FeatureHint message={message} />;
}
