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

function AcceptInviteContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (!isAuthenticated()) {
      router.replace(`/login?next=${encodeURIComponent(`/team/accept?token=${token}`)}`);
      return;
    }
    setStatus("loading");
    api
      .acceptTeamInvite(token)
      .then(() => setStatus("done"))
      .catch((err) => {
        showApiError(err, "Could not accept invite");
        setStatus("error");
      });
  }, [token, router]);

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
