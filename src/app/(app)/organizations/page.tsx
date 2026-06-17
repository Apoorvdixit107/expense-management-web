"use client";

import { useEffect, useState } from "react";
import { useOrganization } from "@/components/OrganizationProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import {
  ORGANIZATION_TYPE_LABELS,
  ORGANIZATION_TYPE_OPTIONS,
  organizationTypeLabel,
  type Organization,
  type OrganizationType,
} from "@/lib/types";

type TypeChoice = OrganizationType | "CUSTOM";

export default function OrganizationsPage() {
  const { organizations, refreshOrgs, switchOrg } = useOrganization();
  const [name, setName] = useState("");
  const [typeChoice, setTypeChoice] = useState<TypeChoice>("HOME");
  const [customTypeLabel, setCustomTypeLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refreshOrgs().catch(() => undefined);
  }, [refreshOrgs]);

  function buildPayload() {
    const isCustom = typeChoice === "CUSTOM";
    return {
      name: name.trim(),
      type: (isCustom ? "CUSTOM" : typeChoice) as OrganizationType,
      customTypeLabel: isCustom ? customTypeLabel.trim() : undefined,
    };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (typeChoice === "CUSTOM" && !customTypeLabel.trim()) {
      toast.error("Enter a custom type name.");
      return;
    }
    setLoading(true);
    try {
      await api.createOrganization(buildPayload());
      setName("");
      setTypeChoice("HOME");
      setCustomTypeLabel("");
      await refreshOrgs();
      toast.success("Organization created with default expense categories.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !name.trim()) return;
    if (typeChoice === "CUSTOM" && !customTypeLabel.trim()) {
      toast.error("Enter a custom type name.");
      return;
    }
    setLoading(true);
    try {
      await api.updateOrganization(editing.id, buildPayload());
      setEditing(null);
      setName("");
      setTypeChoice("HOME");
      setCustomTypeLabel("");
      await refreshOrgs();
      toast.success("Organization updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeleteOrganization() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteOrganization(deleteTarget.id);
      await refreshOrgs();
      toast.success("Organization deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  function startEdit(org: Organization) {
    setEditing(org);
    setName(org.name);
    if (org.type === "CUSTOM") {
      setTypeChoice("CUSTOM");
      setCustomTypeLabel(org.customTypeLabel ?? "");
    } else {
      setTypeChoice(org.type);
      setCustomTypeLabel("");
    }
  }

  function resetForm() {
    setEditing(null);
    setName("");
    setTypeChoice("HOME");
    setCustomTypeLabel("");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Organizations"
        subtitle="Manage company, home, shop, or any custom place where you track expenses."
      />

      <Card>
        <h2 className="text-lg font-bold text-ink">{editing ? "Edit organization" : "Add organization"}</h2>
        <form onSubmit={editing ? handleUpdate : handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Type</span>
            <select
              value={typeChoice}
              onChange={(e) => setTypeChoice(e.target.value as TypeChoice)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {ORGANIZATION_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {ORGANIZATION_TYPE_LABELS[opt]}
                </option>
              ))}
              <option value="CUSTOM">Custom type…</option>
            </select>
          </label>
          {typeChoice === "CUSTOM" ? (
            <Input
              label="Custom type name"
              value={customTypeLabel}
              onChange={(e) => setCustomTypeLabel(e.target.value)}
              placeholder="e.g. Farm, Freelance, Project Alpha"
              className="sm:col-span-2"
              required
            />
          ) : null}
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editing ? "Save changes" : "Create organization"}
            </Button>
            {editing ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {organizations.map((org) => (
          <Card key={org.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">{org.name}</p>
              <p className="text-sm text-muted">
                {organizationTypeLabel(org)} · default categories included
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => switchOrg(org.id)}>
                Switch to this
              </Button>
              <Button variant="secondary" onClick={() => startEdit(org)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => setDeleteTarget(org)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={deleteTarget != null}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteOrganization}
        title="Delete organization"
        itemName={deleteTarget?.name}
        message={
          deleteTarget
            ? `You will lose all expenses, categories, and bank data for "${deleteTarget.name}" and will not be able to retrieve it. Do you still want to delete?`
            : undefined
        }
        loading={deleting}
      />
    </div>
  );
}
