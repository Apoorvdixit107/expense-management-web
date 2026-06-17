export type CookieCategory = "essential" | "functional" | "analytics";

export type CookieConsent = {
  version: number;
  decidedAt: string;
  essential: true;
  functional: boolean;
  analytics: boolean;
};

const CONSENT_KEY = "ems_cookie_consent";
const CONSENT_VERSION = 1;

const DEFAULT_CONSENT: CookieConsent = {
  version: CONSENT_VERSION,
  decidedAt: "",
  essential: true,
  functional: true,
  analytics: false,
};

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null;
}

export function saveCookieConsent(partial: Pick<CookieConsent, "functional" | "analytics">) {
  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    essential: true,
    functional: partial.functional,
    analytics: partial.analytics,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  return consent;
}

export function acceptAllCookies() {
  return saveCookieConsent({ functional: true, analytics: true });
}

export function acceptEssentialOnly() {
  return saveCookieConsent({ functional: false, analytics: false });
}

export function hasFunctionalConsent(): boolean {
  const consent = getCookieConsent();
  return consent?.functional ?? false;
}

export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent();
  return consent?.analytics ?? false;
}

export const COOKIE_SETTINGS_EVENT = "expensekit:open-cookie-settings";

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}

export const COOKIE_CATEGORIES: {
  id: CookieCategory;
  title: string;
  description: string;
  required?: boolean;
}[] = [
  {
    id: "essential",
    title: "Essential",
    description: "Required for sign-in, security, and core app features. Cannot be disabled.",
    required: true,
  },
  {
    id: "functional",
    title: "Functional",
    description: "Remember your theme, organization choice, language, currency, and referral preferences.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Help us understand how the app is used so we can improve features and performance.",
  },
];
