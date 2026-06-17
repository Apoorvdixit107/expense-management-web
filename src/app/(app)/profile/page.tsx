"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { updateStoredUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName);
        setPhone(data.phone ?? "");
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load profile"));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!fullName.trim()) {
      toast.warning("Full name is required");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      setProfile(updated);
      updateStoredUser({ fullName: updated.fullName, phone: updated.phone });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return <div className="py-20 text-center text-muted">Loading profile...</div>;
  }

  const signInLabel = profile.authProvider === "GOOGLE" ? "Google" : "Email & password";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        subtitle="View and update your personal information"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-2xl font-bold text-brand">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <p className="mt-4 text-lg font-bold text-ink">{profile.fullName}</p>
            <p className="mt-1 text-sm text-muted">{profile.email}</p>
            {profile.phone ? <p className="mt-1 text-sm text-muted">{profile.phone}</p> : null}
            <span className="mt-4 inline-block rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">
              Signed in via {signInLabel}
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-ink">Personal information</h2>
          <p className="mt-1 text-sm text-muted">
            Email is tied to your login and cannot be changed here.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email" value={profile.email} disabled readOnly />
            <Input
              label="Full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {profile.updatedAt ? (
              <p className="text-xs text-muted">Last updated {formatDateTime(profile.updatedAt)}</p>
            ) : null}

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
