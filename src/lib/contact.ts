export const WHATSAPP_NUMBER = "918882335129";
export const WHATSAPP_DISPLAY = "+91 8882335129";

/** Official address for outbound mail and user-facing contact. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@expenseit.co.in";

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

const DEFAULT_MESSAGE = "Hi, I need help with ExpenseKit.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
