"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isAuthenticated } from "@/lib/auth";
import { hasPremiumAccess } from "@/lib/premium-access";
import { TRIAL_DAYS } from "@/lib/trial";

export default function SubscribePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated() && hasPremiumAccess()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-5">
        <Logo href="/expenses" height={40} />
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <span className="inline-block rounded-full bg-error px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
          Trial ended
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-ink">Continue with a paid plan</h1>
        <p className="mx-auto mt-4 text-muted">
          Your {TRIAL_DAYS}-day free trial has ended. Sign in and choose Pro or Beast to keep tracking expenses with cloud
          sync and reports.
        </p>

        <Card className="mt-10 p-8 text-left">
          <p className="font-semibold text-ink">Pro & Beast — monthly plans</p>
          <p className="mt-2 text-sm text-muted">Same features today. Feature differences coming soon.</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>✓ Unlimited expenses</li>
            <li>✓ Dashboard & reports</li>
            <li>✓ Secure Razorpay checkout</li>
          </ul>
          <div className="mt-8 space-y-3">
            <Button href={isAuthenticated() ? "/manage-plan" : "/login?next=/manage-plan"} className="w-full">
              {isAuthenticated() ? "Manage plan" : "Sign in to buy a plan"}
            </Button>
            {!isAuthenticated() ? (
              <Button href="/register?next=/manage-plan" variant="secondary" className="w-full">
                Create account
              </Button>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
