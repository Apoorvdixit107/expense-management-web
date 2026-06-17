"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GuestActivityFeed } from "@/components/GuestActivityFeed";
import { GuestContactForm } from "@/components/GuestContactForm";
import { TrialGate } from "@/components/TrialGate";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api";
import { getGuestContact } from "@/lib/guest";
import { isSubscriber } from "@/lib/navigation";
import { formatDateTime } from "@/lib/format";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const [subscriber, setSubscriber] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [hasContact, setHasContact] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  const loadApi = useCallback(() => {
    api
      .listNotifications()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load notifications"));
  }, []);

  useEffect(() => {
    const sub = isSubscriber();
    setSubscriber(sub);
    if (sub) {
      loadApi();
    } else {
      setHasContact(Boolean(getGuestContact()));
      setGuestReady(true);
    }
  }, [loadApi]);

  async function markRead(id: number) {
    await api.markNotificationRead(id);
    loadApi();
  }

  if (subscriber) {
    return (
      <div className="space-y-8">
        <PageHeader title="Notifications" subtitle="Email & SMS alerts for your account" />
        {error ? <p className="text-sm text-error">{error}</p> : null}
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

  if (!guestReady) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  return (
    <TrialGate>
      {hasContact ? (
        <GuestActivityFeed
          onEditContact={() => {
            setHasContact(false);
          }}
        />
      ) : (
        <GuestContactForm
          onSaved={() => {
            setHasContact(true);
          }}
        />
      )}
    </TrialGate>
  );
}
