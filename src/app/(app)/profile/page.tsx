"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useUserPreferences } from "@/components/UserPreferencesProvider";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { updateStoredUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { profileLabels } from "@/lib/i18n";
import { processProfileImage } from "@/lib/profile-image";
import {
  CURRENCY_OPTIONS,
  LANGUAGE_OPTIONS,
  languageToLocale,
} from "@/lib/preferences";
import type { AccountCurrency, AppLanguage, UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const { updateLocalPreferences, refreshPreferences } = useUserPreferences();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [preferredCurrency, setPreferredCurrency] = useState<AccountCurrency>("INR");
  const [preferredLanguage, setPreferredLanguage] = useState<AppLanguage>("EN_IN");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const labels = profileLabels(languageToLocale(preferredLanguage));
  const isRtl = preferredLanguage === "AR_AE";

  useEffect(() => {
    api
      .getProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName);
        setPhone(data.phone ?? "");
        setProfileImageUrl(data.profileImageUrl);
        setPreferredCurrency(data.preferredCurrency);
        setPreferredLanguage(data.preferredLanguage);
        updateLocalPreferences({
          profileImageUrl: data.profileImageUrl,
          preferredCurrency: data.preferredCurrency,
          preferredLanguage: data.preferredLanguage,
        });
      })
      .catch((err) => showApiError(err, "Failed to load profile"));
  }, [updateLocalPreferences]);

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await processProfileImage(file);
      setProfileImageUrl(dataUrl);
      toast.success("Photo ready — save changes to apply.");
    } catch (err) {
      showApiError(err, "Failed to process image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!fullName.trim()) {
      toast.warning(labels.fullName);
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        profileImageUrl,
        preferredCurrency,
        preferredLanguage,
      });
      setProfile(updated);
      updateLocalPreferences({
        profileImageUrl: updated.profileImageUrl,
        preferredCurrency: updated.preferredCurrency,
        preferredLanguage: updated.preferredLanguage,
      });
      updateStoredUser({
        fullName: updated.fullName,
        phone: updated.phone,
        profileImageUrl: updated.profileImageUrl,
      });
      await refreshPreferences();
      toast.success("Profile updated.");
    } catch (err) {
      showApiError(err, "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return <div className="py-20 text-center text-muted">Loading profile...</div>;
  }

  const signInLabel = profile.authProvider === "GOOGLE" ? "Google" : "Email & password";

  return (
    <div className="space-y-8" dir={isRtl ? "rtl" : "ltr"}>
      <PageHeader title={labels.title} subtitle={labels.subtitle} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <ProfileAvatar name={fullName || profile.fullName} imageUrl={profileImageUrl} size="lg" />
            <p className="mt-4 text-lg font-bold text-ink">{fullName || profile.fullName}</p>
            <p className="mt-1 text-sm text-muted">{profile.email}</p>
            {phone ? <p className="mt-1 text-sm text-muted">{phone}</p> : null}
            <p className="mt-2 text-sm font-medium text-brand">
              {CURRENCY_OPTIONS.find((c) => c.value === preferredCurrency)?.label}
            </p>
            <span className="mt-4 inline-block rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">
              {labels.signedInVia} {signInLabel}
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-ink">{labels.personalInfo}</h2>
          <p className="mt-1 text-sm text-muted">{labels.emailNote}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-paper p-4">
              <p className="text-sm font-medium text-ink">{labels.profilePhoto}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <ProfileAvatar name={fullName || profile.fullName} imageUrl={profileImageUrl} size="md" />
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? "..." : labels.uploadPhoto}
                  </Button>
                  {profileImageUrl ? (
                    <Button type="button" variant="ghost" onClick={() => setProfileImageUrl(null)}>
                      {labels.removePhoto}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <Input label="Email" value={profile.email} disabled readOnly />
            <Input
              label={labels.fullName}
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label={labels.phone}
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="rounded-xl border border-border bg-paper p-4">
              <h3 className="text-sm font-bold text-ink">{labels.preferences}</h3>
              <p className="mt-1 text-xs text-muted">{labels.preferencesNote}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-ink">{labels.currency}</span>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value as AccountCurrency)}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {CURRENCY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-ink">{labels.language}</span>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as AppLanguage)}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {profile.updatedAt ? (
              <p className="text-xs text-muted">
                {labels.lastUpdated} {formatDateTime(profile.updatedAt, preferredLanguage)}
              </p>
            ) : null}

            <Button type="submit" disabled={saving}>
              {saving ? labels.saving : labels.save}
            </Button>

            <p className="text-xs text-muted">
              <CookieSettingsLink className="text-brand hover:text-brand-hover" /> ·{" "}
              <a href="/cookies" className="text-brand hover:text-brand-hover">
                Cookie policy
              </a>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
