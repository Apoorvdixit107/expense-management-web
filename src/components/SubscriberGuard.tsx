"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/components/SubscriptionProvider";
import { isAuthenticated } from "@/lib/auth";
import { isSubscribed } from "@/lib/subscription";

export function SubscriberGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, refresh } = useSubscription();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated()) {
      router.replace("/login?next=/dashboard");
      return;
    }

    if (!isSubscribed()) {
      refresh().finally(() => {
        if (!isSubscribed()) {
          router.replace("/manage-plan");
        } else {
          setReady(true);
        }
      });
      return;
    }

    setReady(true);
  }, [loading, router, refresh]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  return children;
}
