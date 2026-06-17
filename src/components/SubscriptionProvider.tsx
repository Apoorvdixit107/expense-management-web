"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import {
  clearSubscriptionState,
  getSubscriptionSnapshot,
  setSubscriptionState,
} from "@/lib/subscription";
import type { Subscription } from "@/lib/types";

type SubscriptionContextValue = {
  subscription: Subscription;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: getSubscriptionSnapshot(),
  loading: true,
  refresh: async () => undefined,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [subscription, setSubscription] = useState<Subscription>(getSubscriptionSnapshot());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      clearSubscriptionState();
      setSubscription(getSubscriptionSnapshot());
      setLoading(false);
      return;
    }

    try {
      const response = await api.getSubscriptionStatus();
      setSubscriptionState(response.subscription);
      setSubscription(response.subscription);
    } catch {
      clearSubscriptionState();
      setSubscription(getSubscriptionSnapshot());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
