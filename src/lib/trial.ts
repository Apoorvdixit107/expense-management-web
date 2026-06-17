export const TRIAL_DAYS = 7;

const TRIAL_START_KEY = "ems_trial_start";

export function ensureTrialStarted(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(TRIAL_START_KEY)) {
    localStorage.setItem(TRIAL_START_KEY, new Date().toISOString());
  }
}

export function getTrialStart(): Date | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TRIAL_START_KEY);
  return raw ? new Date(raw) : null;
}

export function getDaysLeft(): number {
  if (typeof window === "undefined") return TRIAL_DAYS;
  ensureTrialStarted();
  const start = getTrialStart();
  if (!start) return TRIAL_DAYS;
  const elapsed = Date.now() - start.getTime();
  const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - daysElapsed);
}

export function isTrialActive(): boolean {
  return getDaysLeft() > 0;
}
