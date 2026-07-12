"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { showApiError } from "@/lib/apiErrors";
import { isAuthenticated } from "@/lib/auth";
import { postAuthPath } from "@/lib/navigation";

const PENDING_INVITE_KEY = "ems_pending_team_invite";

function takePendingInviteToken(fromQuery: string | null): string | null {
  if (typeof window === "undefined") return fromQuery;
  if (fromQuery) {
    try {
      sessionStorage.setItem(PENDING_INVITE_KEY, fromQuery);
    } catch {
      // ignore quota / private mode
    }
    return fromQuery;
  }
  try {
    const stored = sessionStorage.getItem(PENDING_INVITE_KEY);
    return stored;
  } catch {
    return null;
  }
}

function clearPendingInviteToken() {
  try {
    sessionStorage.removeItem(PENDING_INVITE_KEY);
  } catch {
    // ignore
  }
}

function AcceptInviteContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    const token = takePendingInviteToken(params.get("token"));
    if (!token) {
      setStatus("error");
      return;
    }
    if (!isAuthenticated()) {
      // Do not put the raw invite token in the login URL (history / Referer leakage).
      router.replace("/login?next=/team/accept");
      return;
    }
    setStatus("loading");
    api
      .acceptTeamInvite(token)
      .then(() => {
        clearPendingInviteToken();
        setStatus("done");
      })
      .catch((err) => {
        showApiError(err, "Could not accept invite");
        setStatus("error");
      });
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <Card padding="lg" className="max-w-md w-full text-center">
        {status === "loading" || status === "idle" ? (
          <p className="text-muted">Joining workspace…</p>
        ) : status === "done" ? (
          <>
            <h1 className="text-xl font-bold text-ink">You&apos;re in!</h1>
            <p className="mt-2 text-sm text-muted">Your team invite was accepted.</p>
            <Button className="mt-6" variant="primary" onClick={() => router.push(postAuthPath())}>
              Go to app
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink">Invite unavailable</h1>
            <p className="mt-2 text-sm text-muted">This link may have expired or already been used.</p>
            <Link href="/login" className="mt-6 inline-block text-brand hover:underline">
              Sign in
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
