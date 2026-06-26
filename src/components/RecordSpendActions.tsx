"use client";

import { useOrganization } from "@/components/OrganizationProvider";
import { Button } from "@/components/ui/Button";

type RecordSpendActionsProps = {
  /** Show secondary income button on the Spend page. */
  showIncome?: boolean;
};

export function RecordSpendActions({ showIncome = false }: RecordSpendActionsProps) {
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
      <Button href="/expenses/new?type=OUT" variant="primary">
        Record spend
      </Button>
      {showIncome ? (
        <Button href="/expenses/new?type=IN" variant="secondary">
          Record income
        </Button>
      ) : null}
    </div>
  );
}
