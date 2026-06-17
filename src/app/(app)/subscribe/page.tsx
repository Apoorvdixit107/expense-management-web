"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { activateSubscription } from "@/lib/subscription";
import { isAuthenticated } from "@/lib/auth";
import { isSubscriber } from "@/lib/navigation";
import { useEffect } from "react";

export default function SubscribePage() {
  const router = useRouter();

  useEffect(() => {
    if (isSubscriber()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSubscribe() {
    activateSubscription();
    if (isAuthenticated()) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-5">
        <Link href="/expenses" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
            E
          </span>
          <span className="text-lg font-bold text-ink">ExpenseKit</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-[900px] px-6 py-16 text-center">
        <span className="inline-block rounded-full bg-error px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
          Trial ended
        </span>
        <h1 className="mt-6 text-4xl font-extrabold text-ink">Subscribe to keep your expenses</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Your 7-day trial is over. Subscribe to continue tracking and sync your data. Unsubscribed account data is
          deleted after 3 months from account creation.
        </p>

        <div className="mt-12 grid gap-6 text-left lg:grid-cols-2">
          <Card className="p-8">
            <p className="font-semibold text-muted">Free trial</p>
            <p className="mt-2 text-3xl font-extrabold text-ink">Expired</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>· Local data only</li>
              <li>· 7 days access</li>
              <li>· No cloud sync</li>
            </ul>
          </Card>

          <Card className="relative border-2 border-brand p-8">
            <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              Recommended
            </span>
            <p className="font-semibold text-brand">Pro</p>
            <p className="mt-2 text-3xl font-extrabold text-ink">
              ₹149<span className="text-base font-medium text-muted">/month</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>✓ Unlimited expenses</li>
              <li>✓ Cloud sync & reports</li>
              <li>✓ Email & SMS notifications</li>
              <li>✓ Data kept while subscribed</li>
            </ul>
            <div className="mt-8">
              <Button className="w-full" onClick={handleSubscribe}>
                Subscribe now
              </Button>
            </div>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:text-brand-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
