import { ApiError } from "./api";
import { toast } from "@/components/toast";
import { CONTACT_EMAIL } from "./contact";

const FALLBACK =
  "Payment could not be started. Check your details and try again, or use a different payment method.";

const KNOWN: Array<{ match: string | RegExp; message: string }> = [
  { match: "Payment cancelled", message: "Payment cancelled." },
  {
    match: "Payment verification failed",
    message: `Payment could not be verified. Contact ${CONTACT_EMAIL} if money was deducted.`,
  },
  { match: /input fields not set properly/i, message: "Payment details were incomplete. Enter your name and a valid 10-digit phone number, then try again." },
  { match: /input_validation_failed/i, message: FALLBACK },
  { match: "Razorpay checkout is unavailable", message: "Payment service failed to load. Refresh the page and try again." },
  { match: "Failed to load Razorpay checkout", message: "Payment service failed to load. Check your connection and try again." },
  { match: /taking too long/i, message: "Payment is taking too long to start. Check your connection and try again." },
  { match: /verification timed out/i, message: `Payment verification timed out. If money was deducted, contact ${CONTACT_EMAIL}.` },
  { match: /Live Razorpay keys/i, message: `Live Razorpay keys are not configured on the server. Contact ${CONTACT_EMAIL}.` },
];

export function getBillingErrorMessage(err: unknown): string {
  const rawMessage =
    err instanceof ApiError || err instanceof Error ? err.message : "";

  if (rawMessage === "Payment cancelled") return "Payment cancelled.";

  for (const entry of KNOWN) {
    if (typeof entry.match === "string") {
      if (rawMessage.includes(entry.match)) return entry.message;
    } else if (entry.match.test(rawMessage)) {
      return entry.message;
    }
  }

  if (!(err instanceof ApiError)) {
    return FALLBACK;
  }

  if (err.status === 0) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  if (err.status >= 500) return FALLBACK;

  // Never surface unknown payment-provider / backend text
  return FALLBACK;
}

/** Status-aware toast for billing / Razorpay errors. */
export function showBillingError(err: unknown): void {
  const message = getBillingErrorMessage(err);
  if (message === "Payment cancelled.") {
    toast.info(message);
    return;
  }
  const status = err instanceof ApiError ? err.status : -1;
  const variant = status === 404 || status === 429 ? "warning" : "error";
  toast[variant](message);
}

function normalizeIndianPhone(phone?: string): string | undefined {
  if (!phone?.trim()) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 10) return digits;
  return undefined;
}

/** Razorpay rejects empty strings in prefill on mobile — omit unset fields. */
export function buildRazorpayPrefill(shipping: {
  email: string;
  name?: string;
  phone?: string;
}): { name: string; email: string; contact?: string } {
  const email = shipping.email.trim();
  const name = shipping.name?.trim() || email.split("@")[0] || "Customer";
  const contact = normalizeIndianPhone(shipping.phone);
  return contact ? { name, email, contact } : { name, email };
}
