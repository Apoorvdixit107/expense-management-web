"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { saveGuestContact } from "@/lib/guest";

type GuestContactFormProps = {
  onSaved: () => void;
};

export function GuestContactForm({ onSaved }: GuestContactFormProps) {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }
    saveGuestContact({ email: email.trim(), mobile: mobile.trim() || undefined });
    toast.success("Contact details saved.");
    onSaved();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="text-[28px] font-bold text-ink">Enable notifications</h1>
        <p className="mt-2 text-sm text-muted">
          Add your email and mobile to receive activity alerts — expense added, trial reminders, and weekly
          summaries. No account required yet.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mobile number"
            name="mobile"
            type="tel"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <p className="text-xs text-muted">Mobile is optional — used for SMS alerts.</p>
          <Button type="submit" className="w-full">
            Save & view activity
          </Button>
        </form>
      </Card>

      <p className="text-center text-xs text-muted">
        <Link href="/expenses" className="font-medium text-brand hover:text-brand-hover">
          Back to expenses
        </Link>
      </p>
    </div>
  );
}
