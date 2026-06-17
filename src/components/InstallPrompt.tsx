"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  dismissInstallPrompt,
  isInstallDismissed,
  isIosDevice,
  isStandaloneApp,
} from "@/lib/pwa";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneApp() || isInstallDismissed()) return;

    if (isIosDevice()) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function close() {
    dismissInstallPrompt();
    setVisible(false);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setInstallEvent(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[55] mx-auto max-w-md sm:bottom-6 sm:left-auto sm:right-6">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-elevated)]">
        <div className="flex items-start gap-3">
          <img src="/favicon.png" alt="" width={44} height={44} className="shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">Install ExpenseKit</p>
            {iosHint ? (
              <p className="mt-1 text-sm text-muted">
                Tap <strong className="text-ink">Share</strong>, then{" "}
                <strong className="text-ink">Add to Home Screen</strong> to install the app on your phone.
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">
                Add ExpenseKit to your home screen for quick access, just like a native app.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-lg p-1 text-muted transition hover:bg-paper hover:text-ink"
            aria-label="Dismiss install prompt"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {!iosHint ? (
          <div className="mt-4 flex gap-2">
            <Button type="button" className="flex-1" onClick={() => void install()}>
              Install app
            </Button>
            <Button type="button" variant="outline" onClick={close}>
              Not now
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Button type="button" variant="outline" className="w-full" onClick={close}>
              Got it
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
