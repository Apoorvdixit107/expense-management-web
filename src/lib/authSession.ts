import { api } from "./api";
import { setSubscriptionState } from "./subscription";
import { postAuthPath } from "./navigation";
import { ensureTrialStarted } from "./trial";

/** Refresh subscription cache after login/register so redirects use the correct home route. */
export async function syncSubscriptionAfterAuth(): Promise<void> {
  ensureTrialStarted();
  try {
    const response = await api.getSubscriptionStatus();
    setSubscriptionState(response.subscription);
  } catch {
    // Billing may be unavailable locally; default stays unsubscribed until provider refreshes.
  }
}

export async function resolvePostAuthPath(): Promise<string> {
  await syncSubscriptionAfterAuth();
  return postAuthPath();
}
