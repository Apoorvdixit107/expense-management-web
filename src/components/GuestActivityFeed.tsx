"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/format";
import { getGuestContact, listGuestActivity, markGuestActivityRead, type GuestActivity } from "@/lib/guest";

type GuestActivityFeedProps = {
  onEditContact: () => void;
};

export function GuestActivityFeed({ onEditContact }: GuestActivityFeedProps) {
  const [items, setItems] = useState<GuestActivity[]>(() => listGuestActivity());
  const contact = getGuestContact();

  function refresh() {
    setItems(listGuestActivity());
  }

  function handleMarkRead(id: string) {
    markGuestActivityRead(id);
    refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-ink">Your activity</h1>
          <p className="mt-1 text-sm text-muted">
            Alerts for {contact?.email}
            {contact?.mobile ? ` · ${contact.mobile}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onEditContact}
          className="text-sm font-semibold text-brand hover:text-brand-hover"
        >
          Edit contact
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No activity yet. Add an expense to see updates here.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              padding="sm"
              className={!item.read ? "border-brand/30 bg-brand-light/50" : ""}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{item.message}</p>
                  <p className="mt-3 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
                </div>
                {!item.read ? (
                  <Button variant="secondary" className="shrink-0" onClick={() => handleMarkRead(item.id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
