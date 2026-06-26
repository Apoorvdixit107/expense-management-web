"use client";

import Link from "next/link";
import { useOrganization } from "@/components/OrganizationProvider";
import { Card } from "@/components/ui/Card";
import { isFinanceRole } from "@/lib/navigation";

type FinanceRoleGuardProps = {
  children: React.ReactNode;
};

export function FinanceRoleGuard({ children }: FinanceRoleGuardProps) {
  const { currentOrg, loading } = useOrganization();

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted">Loading…</p>;
  }

  if (!isFinanceRole(currentOrg?.currentUserRole)) {
    return (
      <Card padding="lg" className="mt-8 text-center">
        <p className="font-semibold text-ink">Finance access required</p>
        <p className="mt-2 text-sm text-muted">
          Only owners and finance roles can manage approvals, policies, and team members.
        </p>
        <Link href="/expenses" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          Back to Spend
        </Link>
      </Card>
    );
  }

  return <>{children}</>;
}
