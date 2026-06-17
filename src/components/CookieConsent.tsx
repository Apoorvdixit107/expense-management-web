"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  acceptAllCookies,
  COOKIE_CATEGORIES,
  COOKIE_SETTINGS_EVENT,
  getCookieConsent,
  hasCookieConsent,
  saveCookieConsent,
  type CookieConsent,
} from "@/lib/cookies";

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10v6M12 7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CookieSettingsPanel({
  initial,
  onSave,
  onClose,
}: {
  initial: Pick<CookieConsent, "functional" | "analytics">;
  onSave: (prefs: Pick<CookieConsent, "functional" | "analytics">) => void;
  onClose: () => void;
}) {
  const [functional, setFunctional] = useState(initial.functional);
  const [analytics, setAnalytics] = useState(initial.analytics);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        role="dialog"
        aria-labelledby="cookie-settings-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-[var(--shadow-elevated)]"
      >
        <h2 id="cookie-settings-title" className="text-xl font-bold text-ink">
          Cookie settings
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choose which cookies you allow. Essential cookies are always active.
        </p>

        <div className="mt-6 space-y-4">
          {COOKIE_CATEGORIES.map((category) => {
            const checked =
              category.id === "essential"
                ? true
                : category.id === "functional"
                  ? functional
                  : analytics;
            const disabled = category.required;

            return (
              <div
                key={category.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-paper p-4"
              >
                <div>
                  <p className="font-semibold text-ink">{category.title}</p>
                  <p className="mt-1 text-sm text-muted">{category.description}</p>
                </div>
                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => {
                      if (category.id === "functional") setFunctional(e.target.checked);
                      if (category.id === "analytics") setAnalytics(e.target.checked);
                    }}
                  />
                  <span
                    className={`h-6 w-11 rounded-full transition ${
                      checked ? "bg-brand" : "bg-border"
                    } ${disabled ? "opacity-60" : ""} peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30`}
                  />
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      checked ? "translate-x-5" : ""
                    }`}
                  />
                </label>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => onSave({ functional: true, analytics: true })}
          >
            Accept all
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSave({ functional, analytics })}
          >
            Save preferences
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted">
          Read our{" "}
          <Link href="/cookies" className="font-semibold text-brand hover:text-brand-hover">
            cookie policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState({ functional: true, analytics: false });

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing) {
      setPrefs({ functional: existing.functional, analytics: existing.analytics });
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    function handleOpenSettings() {
      const existing = getCookieConsent();
      if (existing) {
        setPrefs({ functional: existing.functional, analytics: existing.analytics });
      }
      setSettingsOpen(true);
    }
    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  const handleSave = useCallback((next: Pick<CookieConsent, "functional" | "analytics">) => {
    saveCookieConsent(next);
    setPrefs(next);
    setSettingsOpen(false);
    setVisible(false);
  }, []);

  function handleGotIt() {
    acceptAllCookies();
    setPrefs({ functional: true, analytics: true });
    setVisible(false);
  }

  if (!visible && !settingsOpen) {
    return null;
  }

  return (
    <>
      {visible ? (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-xl bg-[#2d2d2d] px-4 py-4 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:px-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <InfoIcon />
              <p className="text-sm leading-relaxed text-white/90">
                This website uses cookies to ensure you get the best experience on our website.{" "}
                <Link href="/cookies" className="font-semibold text-white underline hover:text-brand">
                  Click here
                </Link>{" "}
                to find out more.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cookie settings
              </button>
              <button
                type="button"
                onClick={handleGotIt}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#212121] transition hover:bg-white/90"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <CookieSettingsPanel
          initial={prefs}
          onSave={handleSave}
          onClose={() => {
            setSettingsOpen(false);
            if (!hasCookieConsent()) setVisible(true);
          }}
        />
      ) : null}
    </>
  );
}
