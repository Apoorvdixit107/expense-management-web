"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import {
  getCurrentOrgId,
  getRememberOrgChoice,
  setCurrentOrgId,
  setRememberOrgChoice,
} from "@/lib/org";
import type { Organization } from "@/lib/types";

type OrganizationContextValue = {
  organizations: Organization[];
  currentOrg: Organization | null;
  currentOrgId: number | null;
  loading: boolean;
  refreshOrgs: () => Promise<void>;
  switchOrg: (id: number, remember?: boolean) => void;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

const SKIP_ORG_ROUTES = ["/select-account"];

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgId, setCurrentOrgIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshOrgs = useCallback(async () => {
    const orgs = await api.listOrganizations();
    setOrganizations(orgs);
    return;
  }, []);

  const switchOrg = useCallback((id: number, remember = false) => {
    setCurrentOrgId(id);
    setCurrentOrgIdState(id);
    if (remember) {
      setRememberOrgChoice(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const orgs = await api.listOrganizations();
        if (cancelled) return;
        setOrganizations(orgs);

        const savedId = getCurrentOrgId();
        const remembered = getRememberOrgChoice();
        const savedValid = savedId && orgs.some((o) => o.id === savedId);

        if (orgs.length === 1) {
          switchOrg(orgs[0].id, remembered);
        } else if (savedValid) {
          setCurrentOrgIdState(savedId);
        } else if (!SKIP_ORG_ROUTES.includes(pathname)) {
          router.replace("/select-account");
        }
      } catch (err) {
        if (!cancelled) {
          setOrganizations([]);
          toast.error(
            err instanceof Error ? err.message : "Could not load organizations. Check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [pathname, router, switchOrg]);

  useEffect(() => {
    if (loading || SKIP_ORG_ROUTES.includes(pathname)) return;
    if (organizations.length > 1 && !currentOrgId) {
      router.replace("/select-account");
    }
  }, [loading, organizations, currentOrgId, pathname, router]);

  const currentOrg = useMemo(
    () => organizations.find((o) => o.id === currentOrgId) ?? null,
    [organizations, currentOrgId]
  );

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrg,
        currentOrgId,
        loading,
        refreshOrgs,
        switchOrg,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return ctx;
}
