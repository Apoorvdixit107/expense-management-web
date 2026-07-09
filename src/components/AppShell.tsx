"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { PremiumStarButton } from "@/components/PremiumStarButton";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useOrganization } from "@/components/OrganizationProvider";
import { useSubscription } from "@/components/SubscriptionProvider";
import { useUserPreferences } from "@/components/UserPreferencesProvider";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { api } from "@/lib/api";
import { clearSession, getUser } from "@/lib/auth";
import { clearSubscriptionState, getSubscriptionSnapshot } from "@/lib/subscription";
import { isNavLinkActive } from "@/lib/navActive";
import {
  accountNavLinks,
  isAuthenticated,
  memberNavLinks,
  navLinksForSubscriber,
  postAuthPath,
} from "@/lib/navigation";

function planBadgeLabel(subscription: ReturnType<typeof getSubscriptionSnapshot>): string {
  if (subscription.subscribed && subscription.planName) {
    return subscription.planName;
  }
  return "Free";
}

type NavLink = {
  href: string;
  label: string;
  icon: string;
  premium?: boolean;
};

function SidebarNav({
  links,
  pathname,
  unread,
  onNavigate,
}: {
  links: NavLink[];
  pathname: string;
  unread: number;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
      {links.map((link) => {
        const active = isNavLinkActive(pathname, link.href);
        const showBadge = link.href === "/notifications" && unread > 0;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
              active
                ? "text-[var(--sidebar-text-active)]"
                : "text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)]"
            }`}
            style={active ? { background: "var(--sidebar-active-bg)" } : undefined}
          >
            {active ? (
              <span
                className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-brand"
                aria-hidden
              />
            ) : null}
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base ${active ? "text-brand" : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text-hover)]"}`}>
              {link.icon}
            </span>
            <span className="truncate">{link.label}</span>
            {link.premium ? <PremiumStarIcon className="ml-0.5 shrink-0" /> : null}
            {showBadge ? (
              <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({
  links,
  pathname,
  unread,
  subscriber,
  subscription,
  user,
  profileImageUrl,
  homeHref,
  onLogout,
  onNavigate,
}: {
  links: NavLink[];
  pathname: string;
  unread: number;
  subscriber: boolean;
  subscription: ReturnType<typeof getSubscriptionSnapshot>;
  user: ReturnType<typeof getUser>;
  profileImageUrl: string | null;
  homeHref: string;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const loggedIn = isAuthenticated();

  return (
    <div className="flex h-full flex-col bg-sidebar text-[var(--sidebar-text)]">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Logo href={homeHref} height={40} variant="icon" showWordmark onClick={onNavigate} />
          <PremiumStarButton />
        </div>
      </div>

      <SidebarNav links={links} pathname={pathname} unread={unread} onNavigate={onNavigate} />

      <div className="mt-auto border-t border-sidebar-border">
        <div className="space-y-0.5 px-3 py-2">
          {accountNavLinks.map((link) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={`group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  active
                    ? "text-[var(--sidebar-text-active)]"
                    : "text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)]"
                }`}
                style={active ? { background: "var(--sidebar-active-bg)" } : undefined}
              >
                {active ? (
                  <span
                    className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-brand"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base ${
                    active ? "text-brand" : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text-hover)]"
                  }`}
                >
                  {link.icon}
                </span>
                <span className="truncate">{link.label}</span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                    subscriber
                      ? "bg-brand/20 text-brand"
                      : "bg-[var(--sidebar-control-hover)] text-[var(--sidebar-text)]"
                  }`}
                >
                  {planBadgeLabel(subscription)}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-sidebar-border p-4">
        <OrganizationSwitcher onNavigate={onNavigate} />
        {loggedIn && user ? (
          <Link
            href="/profile"
            onClick={onNavigate}
            className="mb-3 flex items-center gap-3 rounded-lg bg-[var(--sidebar-profile-bg)] px-3 py-2.5 transition hover:bg-[var(--sidebar-profile-hover)]"
          >
            <ProfileAvatar
              name={user.fullName}
              imageUrl={profileImageUrl ?? user.profileImageUrl}
              size="sm"
            />
            <span className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--sidebar-text-active)]">{user.fullName}</p>
              <p className="truncate text-xs text-[var(--sidebar-text)]">{user.email}</p>
            </span>
          </Link>
        ) : null}

        <div className="flex items-center gap-2">
          <ThemeToggle variant="sidebar" className="flex-1" />
          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 flex-1 items-center justify-center rounded-lg border border-sidebar-border text-xs font-medium text-[var(--sidebar-text)] transition hover:bg-[var(--sidebar-control-hover)] hover:text-[var(--sidebar-control-hover-text)]"
          >
            Sign out
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { currentOrg } = useOrganization();
  const subscriber = subscription.subscribed;
  const homeHref = postAuthPath();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getUser();
  const { profileImageUrl } = useUserPreferences();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!subscriber) return;
    api
      .unreadCount()
      .then((res) => setUnread(res.count))
      .catch(() => setUnread(0));
  }, [pathname, subscriber]);

  if (pathname === "/subscribe" || pathname === "/select-account") {
    return <>{children}</>;
  }

  const links = (
    subscriber ? navLinksForSubscriber(currentOrg?.currentUserRole) : memberNavLinks
  ).filter((link) => link.href !== "/manage-plan") as NavLink[];

  if (subscriptionLoading && isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-muted">
        Loading...
      </div>
    );
  }

  function logout() {
    clearSession();
    clearSubscriptionState();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Sidebar — fixed left */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          links={links}
          pathname={pathname}
          unread={unread}
          subscriber={subscriber}
          subscription={subscription}
          user={user}
          profileImageUrl={profileImageUrl}
          homeHref={homeHref}
          onLogout={logout}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Logo href={homeHref} height={32} variant="icon" className="lg:hidden" />
          <div className="ml-auto">
            <PremiumStarButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
