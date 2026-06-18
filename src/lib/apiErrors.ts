import { toast } from "@/components/toast";
import { ApiError } from "./api";

export type ApiErrorVariant = "error" | "warning" | "info";

const GENERIC_HTTP = new Set([
  "Bad Request",
  "Unauthorized",
  "Forbidden",
  "Not Found",
  "Internal Server Error",
  "Conflict",
  "Service Unavailable",
  "Gateway Timeout",
  "Invalid request",
  "Server error",
]);

const KNOWN_MESSAGES: Array<{ match: string | RegExp; message: string }> = [
  {
    match: "You must keep at least one organization",
    message: "You need at least one organization. Create another before deleting this one.",
  },
  { match: "Organization not found", message: "Organization not found." },
  { match: "Category already exists", message: "A category with this name already exists." },
  { match: "Email already registered", message: "This email is already registered." },
  { match: "Invalid credentials", message: "Incorrect email or password." },
  { match: "Session expired", message: "Session expired. Please sign in again." },
  {
    match: /input fields not set properly/i,
    message: "Payment details were incomplete. Check your name and phone, then try again.",
  },
  {
    match: "Billing API is unavailable",
    message: "Billing is temporarily unavailable. Please try again in a moment.",
  },
];

function looksTechnical(message: string): boolean {
  const text = message.trim();
  if (!text) return true;
  if (text.startsWith("{") && text.includes("status")) return true;
  if (GENERIC_HTTP.has(text)) return true;
  if (/sql|exception|stack trace|constraint violation|null pointer/i.test(text)) return true;
  if (/^Request failed \(\d+\)$/i.test(text)) return true;
  if (text.length > 160) return true;
  return false;
}

function matchKnown(message: string): string | null {
  for (const entry of KNOWN_MESSAGES) {
    if (typeof entry.match === "string") {
      if (message.includes(entry.match)) return entry.message;
    } else if (entry.match.test(message)) {
      return entry.message;
    }
  }
  return null;
}

function statusFallback(status: number, fallback: string): string {
  switch (status) {
    case 0:
      return "Cannot reach the server. Check your connection and try again.";
    case 400:
      return fallback || "Invalid request. Please check your input and try again.";
    case 401:
      return "Session expired. Please sign in again.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "The requested item was not found.";
    case 409:
      return "This conflicts with existing data. Refresh the page and try again.";
    case 413:
      return "The file is too large. Try a smaller upload.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 502:
    case 503:
    case 504:
      return "Service is temporarily unavailable. Please try again shortly.";
    default:
      if (status >= 500) {
        return "Something went wrong on our side. Please try again in a moment.";
      }
      return fallback;
  }
}

export function getErrorVariant(status: number): ApiErrorVariant {
  if (status === 404 || status === 409 || status === 429) return "warning";
  return "error";
}

export type ResolvedApiError = {
  message: string;
  variant: ApiErrorVariant;
  status: number;
};

/** Resolve API errors into user-friendly text and toast variant by HTTP status. */
export function resolveApiError(err: unknown, fallback: string): ResolvedApiError {
  if (err instanceof ApiError && err.message === "Payment cancelled") {
    return { message: "Payment cancelled.", variant: "info", status: err.status };
  }

  if (!(err instanceof ApiError)) {
    return { message: fallback, variant: "error", status: -1 };
  }

  const known = matchKnown(err.message);
  if (known) {
    return { message: known, variant: getErrorVariant(err.status), status: err.status };
  }

  const trimmed = err.message.trim();
  const message = looksTechnical(trimmed)
    ? statusFallback(err.status, fallback)
    : trimmed || statusFallback(err.status, fallback);

  return { message, variant: getErrorVariant(err.status), status: err.status };
}

/** Map API errors to short, user-friendly toast text (never raw JSON or HTTP titles). */
export function getFriendlyApiError(err: unknown, fallback: string): string {
  return resolveApiError(err, fallback).message;
}

/** Show a status-aware error toast (400/404/503/500, etc.). */
export function showApiError(err: unknown, fallback: string): void {
  const { message, variant } = resolveApiError(err, fallback);
  toast[variant](message);
}

/** Show a success toast for completed actions (HTTP 200 flows). */
export function showApiSuccess(message: string, duration?: number): void {
  toast.success(message, duration !== undefined ? { duration } : undefined);
}

export function isGenericHttpMessage(message: string): boolean {
  return GENERIC_HTTP.has(message.trim());
}
