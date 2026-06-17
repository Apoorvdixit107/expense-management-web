"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useOrganization } from "@/components/OrganizationProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ORGANIZATION_TYPE_LABELS } from "@/lib/types";

const TYPE_STYLES: Record<string, string> = {
  COMPANY: "bg-violet-100 text-violet-700",
  HOME: "bg-brand-light text-brand",
  SHOP: "bg-emerald-100 text-emerald-700",
  OTHER: "bg-neutral-100 text-neutral-700",
};

export default function SelectAccountPage() {
  const router = useRouter();
  const { organizations, switchOrg } = useOrganization();
  const [remember, setRemember] = useState(false);

  function choose(id: number) {
    switchOrg(id, remember);
    router.push("/expenses");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center py-8">
      <div className="mb-8 text-center">
        <Logo href="/expenses" height={44} className="mx-auto justify-center" />
        <h1 className="mt-6 text-2xl font-bold text-ink">Choose your account</h1>
        <p className="mt-2 text-sm text-muted">
          Pick where you want to track expenses — company, home, shop, or anything else.
        </p>
      </div>

      <Card className="space-y-3 p-2">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Your organizations</p>
        {organizations.map((org) => (
          <button
            key={org.id}
            type="button"
            onClick={() => choose(org.id)}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface px-4 py-4 text-left transition hover:border-brand/40 hover:bg-brand-light/30"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${TYPE_STYLES[org.type]}`}
            >
              {org.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{org.name}</span>
              <span className="mt-0.5 inline-block rounded-full bg-paper px-2 py-0.5 text-xs font-medium text-muted">
                {ORGANIZATION_TYPE_LABELS[org.type]}
              </span>
            </span>
            <span className="text-muted" aria-hidden>
              →
            </span>
          </button>
        ))}
      </Card>

      <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        Remember my choice
      </label>

      <Button variant="secondary" className="mt-4" onClick={() => router.push("/organizations")}>
        + Add organization
      </Button>
    </div>
  );
}
