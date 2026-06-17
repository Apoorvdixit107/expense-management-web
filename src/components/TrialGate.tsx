"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSubscriber } from "@/lib/navigation";
import { isTrialActive } from "@/lib/trial";

export function TrialGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isSubscriber() || isTrialActive()) {
      setReady(true);
      return;
    }
    router.replace("/subscribe");
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  return children;
}
