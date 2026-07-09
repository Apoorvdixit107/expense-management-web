"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PremiumUpgradePrompt } from "@/components/PremiumUpgradePrompt";
import { useSubscription } from "@/components/SubscriptionProvider";
import { isAuthenticated } from "@/lib/auth";
import { hasPremiumAccess } from "@/lib/premium-access";
import { ensureTrialStarted } from "@/lib/trial";

type SubscriberGuardProps = {
  children: React.ReactNode;
  featureName?: string;
};

export function SubscriberGuard({ children, featureName }: SubscriberGuardProps) {
  const router = useRouter();
  const { loading, refresh } = useSubscription();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated()) {
      router.replace("/login?next=/dashboard");
      return;
    }

    ensureTrialStarted();

    if (hasPremiumAccess()) {
      setAllowed(true);
      setReady(true);
      return;
    }

    refresh().finally(() => {
      ensureTrialStarted();
      setAllowed(hasPremiumAccess());
      setReady(true);
    });
  }, [loading, router, refresh]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  if (!allowed) {
    return <PremiumUpgradePrompt featureName={featureName} />;
  }

  return children;
}
