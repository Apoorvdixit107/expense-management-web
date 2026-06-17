import type { AuthResponse } from "./types";

const TOKEN_KEY = "ems_token";
const USER_KEY = "ems_user";
const ACCOUNT_CREATED_KEY = "ems_account_created";

export type StoredUser = {
  userId: number;
  email: string;
  fullName: string;
};

export function saveSession(auth: AuthResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ userId: auth.userId, email: auth.email, fullName: auth.fullName })
  );
  if (!localStorage.getItem(ACCOUNT_CREATED_KEY)) {
    localStorage.setItem(ACCOUNT_CREATED_KEY, new Date().toISOString());
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
