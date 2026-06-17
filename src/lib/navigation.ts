import { isAuthenticated } from "./auth";
import { isSubscribed } from "./subscription";

export function isSubscriber(): boolean {
  return isAuthenticated() && isSubscribed();
}

export function postAuthPath(): string {
  return isSubscribed() ? "/dashboard" : "/expenses";
}
