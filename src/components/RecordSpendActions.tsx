"use client";

import { useOrganization } from "@/components/OrganizationProvider";
import { Button } from "@/components/ui/Button";

export function RecordSpendActions() {
  const { currentOrgId, organizations, loading } = useOrganization();

  if (loading) {
    return null;
  }

  if (!currentOrgId) {
    const href = organizations.length === 0 ? "/organizations" : "/select-account";
    return (
      <Button href={href} variant="primary">
        Set up entity to record spend
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button href="/expenses/new" variant="primary">
        Record spend
      </Button>
    </div>
  );
}
