"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrialBanner } from "@/components/TrialBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { api } from "@/lib/api";
import { clearSession, getUser } from "@/lib/auth";
import { isSubscriber } from "@/lib/navigation";

const guestLinks = [
  { href: "/expenses", label: "Expenses" },
  { href: "/notifications", label: "Notifications" },
];

const subscriberLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/reports", label: "Reports" },
  { href: "/notifications", label: "Notifications" },
];

function Logo() {
  return (
    <Link href="/expenses" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
        E
      </span>
      <span className="text-lg font-bold text-ink">ExpenseKit</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [subscriber, setSubscriber] = useState(false);
  const [unread, setUnread] = useState(0);
  const user = getUser();

  useEffect(() => {
    setSubscriber(isSubscriber());
  }, [pathname]);

  useEffect(() => {
    if (!subscriber) return;
    api
      .unreadCount()
      .then((res) => setUnread(res.count))
      .catch(() => setUnread(0));
  }, [pathname, subscriber]);

  if (pathname === "/subscribe") {
    return <>{children}</>;
  }

  const links = subscriber ? subscriberLinks : guestLinks;

  function logout() {
    clearSession();
    router.push("/expenses");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
          <Logo />

          <div className="flex items-center gap-3">
          {subscriber ? (
            <div className="hidden items-center gap-4 lg:flex">
              <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Pro</span>
              <span className="text-sm text-muted">{user?.fullName}</span>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-muted hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <nav className="flex gap-2">
                {guestLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold transition ${
                        active ? "bg-brand text-white" : "border border-border bg-surface text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <span className="hidden text-border sm:inline">|</span>
              <Link href="/login" className="text-sm font-medium text-muted hover:text-ink">
                Sign in
              </Link>
            </div>
          )}
          <ThemeToggle />
          </div>
        </div>
      </header>

      {!subscriber ? <TrialBanner /> : null}

      <div className="mx-auto flex max-w-[1200px] gap-8 px-6 py-8">
        {subscriber ? (
          <aside className="hidden w-[220px] shrink-0 lg:block">
            <nav className="sticky top-8 space-y-1">
              {links.map((link) => {
                const active = pathname === link.href;
                const showBadge = link.href === "/notifications" && unread > 0;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex h-11 items-center rounded-xl px-4 text-sm font-semibold transition ${
                      active ? "bg-brand text-white" : "text-ink hover:bg-surface"
                    }`}
                  >
                    {link.label}
                    {showBadge ? (
                      <span className="ml-auto rounded-full bg-white/25 px-2 py-0.5 text-xs">{unread}</span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          {subscriber ? (
            <nav className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                      active ? "bg-brand text-white" : "bg-surface text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
