"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .listNotifications()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load notifications"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id: number) {
    await api.markNotificationRead(id);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500">Alerts from your expense activity</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={`rounded-xl border p-4 ${item.read ? "border-slate-200 bg-white" : "border-teal-200 bg-teal-50"}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(item.createdAt)}</p>
                </div>
                {!item.read ? (
                  <Button variant="secondary" onClick={() => markRead(item.id)}>
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
