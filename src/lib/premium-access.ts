import { isAuthenticated } from "./auth";
import { isSubscribed } from "./subscription";
import { ensureTrialStarted, getDaysLeft, isTrialActive } from "./trial";

/** Paid subscription (Pro / Beast). */
export function isPaidSubscriber(): boolean {
  return isAuthenticated() && isSubscribed();
}

/** Active free trial for guests or signed-in users who have not subscribed yet. */
export function isOnFreeTrial(): boolean {
  if (typeof window === "undefined") return false;
  if (isPaidSubscriber()) return false;
  ensureTrialStarted();
  return isTrialActive();
}

/** Can use premium features — paid plan or active trial. */
export function hasPremiumAccess(): boolean {
  if (typeof window === "undefined") return false;
  return isPaidSubscriber() || isOnFreeTrial();
}

/** Signed-in user whose trial ended and has no active plan. */
export function trialExpiredForUser(): boolean {
  return isAuthenticated() && !isPaidSubscriber() && !isTrialActive();
}

export function trialDaysLeft(): number {
  return getDaysLeft();
}

export { TRIAL_DAYS } from "./trial";