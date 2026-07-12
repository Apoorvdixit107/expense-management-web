import { clearSession, getToken } from "./auth";
import { clearCurrentOrgId } from "./org";
import { clearSubscriptionState } from "./subscription";

/**
 * Full client logout: wipe session, org selection, and in-memory billing state.
 * Call from Sign out and from authenticated 401 handlers.
 */
export function logoutClient(): void {
  clearSession();
  clearCurrentOrgId();
  clearSubscriptionState();
}

/** True when a token exists (presence check only — API validates JWT). */
export function hasClientSession(): boolean {
  return Boolean(getToken());
}
