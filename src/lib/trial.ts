export const TRIAL_DAYS = 14;

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
