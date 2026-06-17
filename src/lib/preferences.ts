export type AccountCurrency = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD" | "JPY" | "CAD" | "AUD";

export type AppLanguage = "EN_IN" | "EN_US" | "HI_IN" | "ES_ES" | "FR_FR" | "DE_DE" | "AR_AE";

const PREFS_KEY = "ems_user_preferences";

export type UserPreferences = {
  profileImageUrl: string | null;
  preferredCurrency: AccountCurrency;
  preferredLanguage: AppLanguage;
};

const DEFAULT_PREFERENCES: UserPreferences = {
  profileImageUrl: null,
  preferredCurrency: "INR",
  preferredLanguage: "EN_IN",
};

let memoryPrefs: UserPreferences = { ...DEFAULT_PREFERENCES };

export const CURRENCY_OPTIONS: { value: AccountCurrency; label: string; symbol: string }[] = [
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "AED", label: "UAE Dirham (د.إ)", symbol: "د.إ" },
  { value: "SGD", label: "Singapore Dollar (S$)", symbol: "S$" },
  { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
  { value: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
];

export const LANGUAGE_OPTIONS: { value: AppLanguage; label: string; locale: string }[] = [
  { value: "EN_IN", label: "English (India)", locale: "en-IN" },
  { value: "EN_US", label: "English (US)", locale: "en-US" },
  { value: "HI_IN", label: "हिन्दी (India)", locale: "hi-IN" },
  { value: "ES_ES", label: "Español", locale: "es-ES" },
  { value: "FR_FR", label: "Français", locale: "fr-FR" },
  { value: "DE_DE", label: "Deutsch", locale: "de-DE" },
  { value: "AR_AE", label: "العربية", locale: "ar-AE" },
];

export function languageToLocale(language: AppLanguage): string {
  return LANGUAGE_OPTIONS.find((o) => o.value === language)?.locale ?? "en-IN";
}

export function getCurrency(): AccountCurrency {
  return memoryPrefs.preferredCurrency;
}

export function getLocale(): string {
  return languageToLocale(memoryPrefs.preferredLanguage);
}

export function getProfileImageUrl(): string | null {
  return memoryPrefs.profileImageUrl;
}

export function getPreferences(): UserPreferences {
  return { ...memoryPrefs };
}

export function setPreferences(prefs: Partial<UserPreferences>) {
  memoryPrefs = { ...memoryPrefs, ...prefs };
  if (typeof window !== "undefined") {
    localStorage.setItem(PREFS_KEY, JSON.stringify(memoryPrefs));
  }
}

export function loadStoredPreferences(): UserPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_PREFERENCES };
  const raw = localStorage.getItem(PREFS_KEY);
  if (!raw) return { ...DEFAULT_PREFERENCES };
  try {
    const parsed = JSON.parse(raw) as UserPreferences;
    memoryPrefs = { ...DEFAULT_PREFERENCES, ...parsed };
    return { ...memoryPrefs };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function clearPreferences() {
  memoryPrefs = { ...DEFAULT_PREFERENCES };
  if (typeof window !== "undefined") {
    localStorage.removeItem(PREFS_KEY);
  }
}

export function applyProfilePreferences(profile: {
  profileImageUrl?: string | null;
  preferredCurrency: AccountCurrency;
  preferredLanguage: AppLanguage;
}) {
  setPreferences({
    profileImageUrl: profile.profileImageUrl ?? null,
    preferredCurrency: profile.preferredCurrency,
    preferredLanguage: profile.preferredLanguage,
  });
}
