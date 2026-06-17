const SUBSCRIBED_KEY = "ems_subscribed";

export function isSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SUBSCRIBED_KEY) === "true";
}

export function activateSubscription(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBSCRIBED_KEY, "true");
}

export function clearSubscription(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SUBSCRIBED_KEY);
}
