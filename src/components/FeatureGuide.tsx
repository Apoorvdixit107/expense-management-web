"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  getFeatureGuide,
  type FeatureGuideContent,
  type FeatureGuideId,
} from "@/lib/feature-guides";

type FeatureHelpButtonProps = {
  onClick: () => void;
  className?: string;
  label: string;
};

export function FeatureHelpButton({
  onClick,
  className = "",
  label,
}: FeatureHelpButtonProps) {
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

export function FeatureHint({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-border bg-paper px-4 py-3 text-sm leading-relaxed text-muted">
      <span className="mt-0.5 shrink-0 text-base" aria-hidden>
        💡
      </span>
      <span>{message}</span>
    </p>
  );
}

type FeatureGuideModalProps = {
  guide: FeatureGuideContent;
  open: boolean;
  onClose: () => void;
};

export function FeatureGuideModal({ guide, open, onClose }: FeatureGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={guide.title} subtitle={guide.subtitle}>
      <div className="space-y-6">
        <div className="space-y-3">
          {guide.sections.map((section) => (
            <div
              key={section.label ?? section.detail.slice(0, 40)}
              className="rounded-xl border border-border bg-paper px-4 py-3"
            >
              {section.label ? (
                <div className="flex flex-wrap items-center gap-2">
                  {section.badgeClass ? (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${section.badgeClass}`}>
                      {section.label}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-ink">{section.label}</span>
                  )}
                  {section.summary ? (
                    <span className="text-sm font-semibold text-ink">{section.summary}</span>
                  ) : null}
                </div>
              ) : null}
              <p
                className={`text-sm leading-relaxed text-muted ${section.label && !section.badgeClass ? "mt-1" : section.label ? "mt-2" : ""}`}
              >
                {section.detail}
              </p>
            </div>
          ))}
        </div>

        {guide.steps && guide.steps.length > 0 ? (
          <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-4">
            {guide.stepsTitle ? (
              <p className="text-sm font-bold text-ink">{guide.stepsTitle}</p>
            ) : null}
            <ol
              className={`list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted ${guide.stepsTitle ? "mt-3" : ""}`}
            >
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {guide.tip ? (
          <div className="rounded-xl bg-paper px-4 py-3 text-sm text-muted">
            <span className="font-semibold text-ink">Tip:</span> {guide.tip}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function firstVisitStorageKey(id: FeatureGuideId) {
  return `expensekit-feature-guide-${id}-v1`;
}

/** Show the guide once per browser when enabled, then only when the user opens it. */
export function useFeatureGuideFirstVisit(id: FeatureGuideId, enabled = true) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      if (localStorage.getItem(firstVisitStorageKey(id)) === "1") return;
      const timer = window.setTimeout(() => setOpen(true), 600);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [id, enabled]);

  function close() {
    try {
      localStorage.setItem(firstVisitStorageKey(id), "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  return { firstVisitOpen: open, closeFirstVisit: close };
}

type FeatureGuideTriggerProps = {
  guideId: FeatureGuideId;
  className?: string;
  label?: string;
  showFirstVisit?: boolean;
};

export function FeatureGuideTrigger({
  guideId,
  className,
  label,
  showFirstVisit = false,
}: FeatureGuideTriggerProps) {
  const guide = getFeatureGuide(guideId);
  const [open, setOpen] = useState(false);
  const { firstVisitOpen, closeFirstVisit } = useFeatureGuideFirstVisit(guideId, showFirstVisit);

  function close() {
    closeFirstVisit();
    setOpen(false);
  }

  return (
    <>
      <FeatureHelpButton
        onClick={() => setOpen(true)}
        className={className}
        label={label ?? guide.buttonLabel}
      />
      <FeatureGuideModal guide={guide} open={open || firstVisitOpen} onClose={close} />
    </>
  );
}

/** Combine existing page actions with a feature guide button. */
export function withFeatureGuideAction(
  guideId: FeatureGuideId,
  action?: ReactNode,
  options?: { label?: string; showFirstVisit?: boolean }
) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      {action}
      <FeatureGuideTrigger
        guideId={guideId}
        label={options?.label}
        showFirstVisit={options?.showFirstVisit}
      />
    </div>
  );
}
