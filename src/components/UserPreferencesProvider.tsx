"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import {
  applyProfilePreferences,
  clearPreferences,
  getPreferences,
  loadStoredPreferences,
  type AccountCurrency,
  type AppLanguage,
  type UserPreferences,
} from "@/lib/preferences";

type UserPreferencesContextValue = UserPreferences & {
  loading: boolean;
  refreshPreferences: () => Promise<void>;
  updateLocalPreferences: (patch: Partial<UserPreferences>) => void;
};

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UserPreferences>(() => loadStoredPreferences());
  const [loading, setLoading] = useState(true);

  const refreshPreferences = useCallback(async () => {
    if (!isAuthenticated()) {
      clearPreferences();
      setPrefs(loadStoredPreferences());
      return;
    }
    const profile = await api.getProfile();
    applyProfilePreferences(profile);
    setPrefs(getPreferences());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (isAuthenticated()) {
          await refreshPreferences();
        } else {
          loadStoredPreferences();
          setPrefs(getPreferences());
        }
      } catch {
        if (!cancelled) setPrefs(loadStoredPreferences());
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [refreshPreferences]);

  const updateLocalPreferences = useCallback((patch: Partial<UserPreferences>) => {
    applyProfilePreferences({
      profileImageUrl: patch.profileImageUrl ?? prefs.profileImageUrl,
      preferredCurrency: patch.preferredCurrency ?? prefs.preferredCurrency,
      preferredLanguage: patch.preferredLanguage ?? prefs.preferredLanguage,
    });
    setPrefs(getPreferences());
  }, [prefs]);

  const value = useMemo(
    () => ({
      ...prefs,
      loading,
      refreshPreferences,
      updateLocalPreferences,
    }),
    [prefs, loading, refreshPreferences, updateLocalPreferences]
  );

  return (
    <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) {
    throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  }
  return ctx;
}

export type { AccountCurrency, AppLanguage };
