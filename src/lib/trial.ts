import { getUser } from "./auth";

export const TRIAL_DAYS = 14;

const TRIAL_START_KEY = "ems_trial_start";
const TRIAL_ENDED_KEY = "ems_trial_ended";

function trialStartKey(): string {
  const user = getUser();
  return user ? `${TRIAL_START_KEY}_u${user.userId}` : TRIAL_START_KEY;
}

function trialEndedKey(): string {
  const user = getUser();
  return user ? `${TRIAL_ENDED_KEY}_u${user.userId}` : TRIAL_ENDED_KEY;
}

function readEnded(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(trialEndedKey()) === "1";
}

function markEnded(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(trialEndedKey(), "1");
}

export function ensureTrialStarted(): void {
  if (typeof window === "undefined") return;
  // Do not restart a trial that already ended for this user/browser.
  if (readEnded()) return;
  const key = trialStartKey();
  if (!localStorage.getItem(key)) {
    // Migrate legacy unscoped key once for signed-in users.
    const legacy = localStorage.getItem(TRIAL_START_KEY);
    if (legacy && getUser()) {
      localStorage.setItem(key, legacy);
    } else {
      localStorage.setItem(key, new Date().toISOString());
    }
  }
}

export function getTrialStart(): Date | null {
  if (typeof window === "undefined") return null;
  ensureTrialStarted();
  const raw = localStorage.getItem(trialStartKey()) ?? localStorage.getItem(TRIAL_START_KEY);
  return raw ? new Date(raw) : null;
}

export function getDaysLeft(): number {
  if (typeof window === "undefined") return TRIAL_DAYS;
  if (readEnded()) return 0;
  ensureTrialStarted();
  const start = getTrialStart();
  if (!start) return TRIAL_DAYS;
  const elapsed = Date.now() - start.getTime();
  const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const left = Math.max(0, TRIAL_DAYS - daysElapsed);
  if (left === 0) markEnded();
  return left;
}

export function isTrialActive(): boolean {
  return getDaysLeft() > 0;
}

export function getTrialEndDate(): Date | null {
  const start = getTrialStart();
  if (!start) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + TRIAL_DAYS);
  return end;
}

export function getTrialProgressPercent(): number {
  const start = getTrialStart();
  if (!start) return 0;
  const elapsed = Date.now() - start.getTime();
  const total = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

/** Client UX only — premium APIs must still enforce entitlements server-side. */
export function isTrialClientUxOnly(): true {
  return true;
}
