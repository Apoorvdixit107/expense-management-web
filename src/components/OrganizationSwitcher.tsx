"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrganization } from "@/components/OrganizationProvider";
import { ORGANIZATION_TYPE_LABELS } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  COMPANY: "bg-violet-500/20 text-violet-200",
  HOME: "bg-brand/20 text-brand",
  SHOP: "bg-emerald-500/20 text-emerald-200",
  OTHER: "bg-white/10 text-[var(--sidebar-text)]",
};

export function OrganizationSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const { organizations, currentOrg, switchOrg } = useOrganization();
  const [open, setOpen] = useState(false);

  if (!currentOrg) return null;

  return (
    <div className="relative mb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-white/5 px-3 py-2.5 text-left transition hover:bg-white/10"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${TYPE_COLORS[currentOrg.type] ?? TYPE_COLORS.OTHER}`}
        >
          {currentOrg.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">{currentOrg.name}</span>
          <span className="block truncate text-xs text-[var(--sidebar-text)]">
            {ORGANIZATION_TYPE_LABELS[currentOrg.type]}
          </span>
        </span>
        <span className="text-[var(--sidebar-text)]" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close organization menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-56 overflow-y-auto rounded-xl border border-sidebar-border bg-sidebar shadow-xl">
            {organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => {
                  switchOrg(org.id);
                  setOpen(false);
                  onNavigate?.();
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-white/10 ${
                  org.id === currentOrg.id ? "bg-white/10 text-white" : "text-[var(--sidebar-text)]"
                }`}
              >
                <span className="truncate font-medium">{org.name}</span>
                <span className="ml-auto text-xs opacity-70">{ORGANIZATION_TYPE_LABELS[org.type]}</span>
              </button>
            ))}
            <Link
              href="/select-account"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block border-t border-sidebar-border px-3 py-2.5 text-xs font-medium text-brand hover:bg-white/5"
            >
              Switch account
            </Link>
            <Link
              href="/organizations"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-3 py-2 text-xs text-[var(--sidebar-text)] hover:bg-white/5"
            >
              Manage organizations
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
