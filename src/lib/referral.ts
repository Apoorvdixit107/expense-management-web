const REFERRAL_STORAGE_KEY = "expensekit_referral_code";

export function saveReferralCode(code: string) {
  if (typeof window === "undefined") return;
  const normalized = code.trim().toUpperCase();
  if (normalized) {
    localStorage.setItem(REFERRAL_STORAGE_KEY, normalized);
  }
}

export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function clearReferralCode() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

export function captureReferralFromSearchParams(searchParams: URLSearchParams) {
  const ref = searchParams.get("ref");
  if (ref) saveReferralCode(ref);
}

export function formatPaise(paise: number) {
  return paise / 100;
}
