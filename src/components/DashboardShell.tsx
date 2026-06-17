"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { clearSession, getUser } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/reports", label: "Reports" },
  { href: "/notifications", label: "Notifications" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.unreadCount()
      .then((res) => setUnread(res.count))
      .catch(() => setUnread(0));
  }, [pathname]);

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <Link href="/dashboard" className="text-lg font-bold text-slate-900">
              ExpenseKit
            </Link>
            <p className="text-sm text-slate-500">{user?.fullName ?? "User"}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {links.map((link) => {
            const active = pathname === link.href;
            const showBadge = link.href === "/notifications" && unread > 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-teal-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
                {showBadge ? ` (${unread})` : ""}
              </Link>
            );
          })}
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
}
