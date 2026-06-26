"use client";

import Link from "next/link";
import { useOrganization } from "@/components/OrganizationProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type OrgRequiredStateProps = {
  children: React.ReactNode;
  message?: string;
};

export function OrgRequiredState({ children, message }: OrgRequiredStateProps) {
  const { currentOrgId, loading, organizations } = useOrganization();

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted">Loading workspace…</p>;
  }

  if (!currentOrgId) {
    return (
      <Card padding="lg" className="mt-8 text-center">
        <p className="text-muted">
          {message ??
            (organizations.length === 0
              ? "Create an entity to start recording spend."
              : "Select an entity to continue.")}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          {organizations.length === 0 ? (
            <Button href="/organizations" variant="primary">
              Create entity
            </Button>
          ) : (
            <Button href="/select-account" variant="primary">
              Choose entity
            </Button>
          )}
          <Link href="/organizations" className="inline-flex h-11 items-center text-sm font-semibold text-brand hover:underline">
            Manage entities
          </Link>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
