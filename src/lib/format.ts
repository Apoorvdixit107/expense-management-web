import { getCurrency, getLocale, languageToLocale } from "./preferences";
import type { AppLanguage } from "./preferences";

export function formatCurrency(amount: number, currency?: string) {
  const code = currency ?? getCurrency();
  const locale = getLocale();
  const fractionDigits = code === "JPY" ? 0 : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatDate(value: string, language?: AppLanguage) {
  const locale = language ? languageToLocale(language) : getLocale();
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string, language?: AppLanguage) {
  const locale = language ? languageToLocale(language) : getLocale();
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Value for HTML datetime-local inputs — must use local time, not UTC from toISOString(). */
export function localDatetimeInputValue(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

/** Parse datetime-local string (local time) to ISO for the API. */
export function localDatetimeToISO(value: string): string {
  return new Date(value).toISOString();
}
