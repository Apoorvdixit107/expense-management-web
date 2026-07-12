"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NotificationPreferencesForm } from "@/components/NotificationPreferencesForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureGuideTrigger } from "@/components/FeatureGuide";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  const loadApi = useCallback(() => {
    api
      .listNotifications()
      .then(setItems)
      .catch((err) => showApiError(err, "Failed to load notifications"));
  }, []);

  useEffect(() => {
    loadApi();
  }, [loadApi]);

  async function markRead(id: number) {
    await api.markNotificationRead(id);
    loadApi();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Alerts"
        subtitle="Email & SMS alerts for your account"
        action={<FeatureGuideTrigger guideId="alerts" />}
      />
      <NotificationPreferencesForm />
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border px-5 py-5 ${
                item.read ? "border-border bg-surface" : "border-brand/30 bg-brand-light/50"
              }`}
              style={item.read ? { boxShadow: "var(--shadow-card)" } : undefined}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{item.message}</p>
                  <p className="mt-3 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
                </div>
                {!item.read ? (
                  <Button variant="secondary" className="shrink-0" onClick={() => markRead(item.id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
