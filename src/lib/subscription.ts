import { isAuthenticated } from "./auth";
import type { Subscription } from "./types";

let subscribed = false;
let subscription: Subscription | null = null;

const emptySubscription = (): Subscription => ({
  subscribed: false,
  planCode: null,
  planName: null,
  status: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  canRenew: true,
});

export function isSubscribed(): boolean {
  if (typeof window === "undefined" || !isAuthenticated()) return false;
  return subscribed;
}

export function getSubscription(): Subscription | null {
  return subscription;
}

export function setSubscriptionState(next: Subscription): void {
  subscription = next;
  subscribed = next.subscribed;
}

export function clearSubscriptionState(): void {
  subscribed = false;
  subscription = null;
}

export function getSubscriptionSnapshot(): Subscription {
  return subscription ?? emptySubscription();
}
