"use client";

import { openCookieSettings } from "@/lib/cookies";

type CookieSettingsLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export function CookieSettingsLink({
  className = "font-semibold text-brand hover:text-brand-hover",
  children = "Cookie settings",
}: CookieSettingsLinkProps) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}
