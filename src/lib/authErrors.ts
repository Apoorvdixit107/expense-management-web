import { ApiError } from "./api";

export type AuthAction = "login" | "register" | "google";

const FALLBACK: Record<AuthAction, string> = {
  login: "Could not sign in. Check your email and password, then try again.",
  register: "Could not create your account. Try again or sign in if you already have one.",
  google: "Google sign-in failed. Try again or use email instead.",
};

const KNOWN_MESSAGES: Array<{ match: string | RegExp; message: string }> = [
  { match: "Email already registered", message: "This email is already registered. Sign in instead." },
  { match: "Invalid credentials", message: "Incorrect email or password." },
  {
    match: "Use Google sign in for this account",
    message: "This account uses Google sign-in. Use the Google button above.",
  },
  { match: "Invalid Google token", message: "Google sign-in could not be verified. Please try again." },
  {
    match: "Google sign-in is not configured",
    message: "Google sign-in is not available right now. Use email and password instead.",
  },
  { match: /password.*6/i, message: "Password must be at least 6 characters." },
  { match: /email.*valid/i, message: "Enter a valid email address." },
];

function looksTechnical(message: string): boolean {
  const text = message.trim();
  if (!text) return true;
  if (text.startsWith("{") && text.includes("status")) return true;
  if (text.startsWith("[") && text.includes("error")) return true;
  if (/internal server error/i.test(text)) return true;
  if (/sql|exception|stack|constraint|null pointer/i.test(text)) return true;
  if (/^Request failed \(\d+\)$/i.test(text)) return true;
  if (text.length > 140) return true;
  return false;
}

function matchKnownMessage(message: string): string | null {
  for (const entry of KNOWN_MESSAGES) {
    if (typeof entry.match === "string") {
      if (message.includes(entry.match)) return entry.message;
    } else if (entry.match.test(message)) {
      return entry.message;
    }
  }
  return null;
}

/** User-friendly message for sign-in / sign-up failures (never raw API JSON). */
export function getAuthErrorMessage(err: unknown, action: AuthAction): string {
  if (!(err instanceof ApiError)) {
    return FALLBACK[action];
  }

  if (err.status === 0) {
    return "Cannot reach the server. Check your internet connection and try again.";
  }

  const known = matchKnownMessage(err.message);
  if (known) return known;

  if (err.status === 401) {
    return action === "google"
      ? "Google sign-in failed. Try again."
      : "Incorrect email or password.";
  }

  if (err.status === 409) {
    return "This email is already registered. Sign in instead.";
  }

  if (err.status === 503) {
    return "Google sign-in is not available right now. Use email and password instead.";
  }

  if (err.status >= 500) {
    return FALLBACK[action];
  }

  const message = err.message.trim();
  if (looksTechnical(message)) {
    return FALLBACK[action];
  }

  return message;
}
