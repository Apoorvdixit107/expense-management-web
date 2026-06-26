"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOrganization } from "@/components/OrganizationProvider";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { showApiError } from "@/lib/apiErrors";
import { OrgRequiredState } from "@/components/OrgRequiredState";
import { FinanceRoleGuard } from "@/components/FinanceRoleGuard";
import type { OrganizationInvite, OrganizationMember, OrgMemberRole } from "@/lib/types";

export default function TeamPage() {
  const { currentOrgId } = useOrganization();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<OrgMemberRole, "OWNER">>("MEMBER");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function load() {
    if (!currentOrgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([api.listTeamMembers(currentOrgId), api.listTeamInvites(currentOrgId)])
      .then(([m, i]) => {
        setMembers(m);
        setInvites(i);
      })
      .catch((err) => showApiError(err, "Failed to load team"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [currentOrgId]);

  async function handleInvite(event: FormEvent) {
    event.preventDefault();
    if (!currentOrgId) return;
    setSaving(true);
    try {
      await api.inviteTeamMember(currentOrgId, { email, role });
      toast.success("Invite sent");
      setEmail("");
      load();
    } catch (err) {
      showApiError(err, "Could not send invite");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SubscriberGuard>
      <FinanceRoleGuard>
      <OrgRequiredState>
      <PageHeader title="Team" subtitle="Invite colleagues and assign roles" />

      <Card className="mt-8" padding="lg">
        <h2 className="text-lg font-semibold text-ink">Invite by email</h2>
        <form onSubmit={handleInvite} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-sm font-medium text-ink">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Exclude<OrgMemberRole, "OWNER">)}
              className="h-11 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              <option value="MEMBER">Member — submit spend</option>
              <option value="FINANCE">Finance — approve & reports</option>
            </select>
          </div>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Sending…" : "Send invite"}
          </Button>
        </form>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-ink">Members</h2>
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>User #{member.userId}</span>
                  <span className="font-medium text-brand">{member.role}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padding="lg">
          <h2 className="text-lg font-semibold text-ink">Pending invites</h2>
          {invites.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No pending invites.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {invites.map((invite) => (
                <li
                  key={invite.id}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <p className="font-medium text-ink">{invite.email}</p>
                  <p className="text-muted">
                    {invite.role} · expires{" "}
                    {invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      </OrgRequiredState>
      </FinanceRoleGuard>
    </SubscriberGuard>
  );
}
