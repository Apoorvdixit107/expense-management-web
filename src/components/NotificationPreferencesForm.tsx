"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import type { NotificationPreferences } from "@/lib/types";

export function NotificationPreferencesForm() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    api
      .getNotificationPreferences()
      .then(setPrefs)
      .catch((err) => showApiError(err, "Failed to load preferences"));
  }, []);

  if (!prefs) {
    return <p className="text-sm text-muted">Loading notification preferences...</p>;
  }

  async function save() {
    if (!prefs) return;
    setSaving(true);
    try {
      const updated = await api.updateNotificationPreferences(prefs);
      setPrefs(updated);
      toast.success("Notification preferences saved.");
    } catch (err) {
      showApiError(err, "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    if (!prefs) return;
    setTesting(true);
    try {
      await api.updateNotificationPreferences(prefs);
      await api.sendTestNotification();
      toast.success("Test notification sent.");
    } catch (err) {
      showApiError(err, "Failed to send test notification");
    } finally {
      setTesting(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-ink">Email & SMS preferences</h2>
      <p className="mt-1 text-sm text-muted">
        Get expense alerts instantly and a daily summary at 8 PM with a link to your reports.
      </p>

      <div className="mt-6 space-y-4">
        <Input
          label="Email *"
          type="email"
          required
          value={prefs.email}
          onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
        />
        <Input
          label="Phone (for SMS)"
          value={prefs.phone ?? ""}
          onChange={(e) => setPrefs({ ...prefs, phone: e.target.value || null })}
          placeholder="+91 98765 43210"
        />

        <Toggle
          label="Email notifications"
          description="Expense alerts and daily summary by email"
          checked={prefs.emailEnabled}
          onChange={(emailEnabled) => setPrefs({ ...prefs, emailEnabled })}
        />
        <Toggle
          label="SMS notifications"
          description="Daily summary and alerts on your phone"
          checked={prefs.smsEnabled}
          onChange={(smsEnabled) => setPrefs({ ...prefs, smsEnabled })}
        />
        <Toggle
          label="Daily expense summary"
          description="Sent at 8 PM with today’s total and report link"
          checked={prefs.dailySummaryEnabled}
          onChange={(dailySummaryEnabled) => setPrefs({ ...prefs, dailySummaryEnabled })}
        />
        <Toggle
          label="Expense alerts"
          description="Notify when you add an expense"
          checked={prefs.expenseAlertsEnabled}
          onChange={(expenseAlertsEnabled) => setPrefs({ ...prefs, expenseAlertsEnabled })}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save preferences"}
        </Button>
        <Button variant="secondary" onClick={() => void sendTest()} disabled={testing || saving}>
          {testing ? "Sending..." : "Send test notification"}
        </Button>
      </div>
    </Card>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-paper p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-brand"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </span>
    </label>
  );
}
