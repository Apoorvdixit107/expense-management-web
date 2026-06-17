"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { BillingCompany, ShippingDetails } from "@/lib/types";

type Props = {
  onSubmit: (details: ShippingDetails, sendInvoiceEmail: boolean) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  planLabel: string;
};

export function ShippingDetailsForm({ onSubmit, onCancel, loading, planLabel }: Props) {
  const user = getUser();
  const [billingCompany, setBillingCompany] = useState<BillingCompany | null>(null);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [sendInvoiceEmail, setSendInvoiceEmail] = useState(true);

  useEffect(() => {
    api.getBillingCompany().then(setBillingCompany).catch(() => setBillingCompany(null));
    api
      .getBillingDetails()
      .then((data) => {
        if (data.email) setEmail(data.email);
        if (data.name) setName(data.name);
        if (data.phone) setPhone(data.phone);
        if (data.gst) setGst(data.gst);
        if (data.pan) setPan(data.pan);
        if (data.address) setAddress(data.address);
        if (data.pincode) setPincode(data.pincode);
        setSendInvoiceEmail(data.sendInvoiceByEmail);
      })
      .catch(() => undefined);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    const details: ShippingDetails = {
      email: email.trim(),
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      gst: gst.trim() || undefined,
      pan: pan.trim() || undefined,
      address: address.trim() || undefined,
      pincode: pincode.trim() || undefined,
    };

    setSaving(true);
    try {
      await api.updateBillingDetails({ shippingDetails: details, sendInvoiceByEmail: sendInvoiceEmail });
      await onSubmit(details, sendInvoiceEmail);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save billing details");
    } finally {
      setSaving(false);
    }
  }

  const busy = loading || saving;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Checkout — {planLabel}</p>

      {billingCompany ? (
        <div className="mt-6 rounded-xl border border-border bg-paper p-4 text-sm">
          <p className="font-semibold text-ink">Billed by</p>
          <p className="mt-1 text-muted">{billingCompany.companyName}</p>
          <p className="text-muted">{billingCompany.location}</p>
          <p className="text-muted">{billingCompany.email}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input label="Email *" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="GST" value={gst} onChange={(e) => setGst(e.target.value)} />
          <Input label="PAN" value={pan} onChange={(e) => setPan(e.target.value)} />
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink">Address</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-[80px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            rows={3}
          />
        </label>
        <Input label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand/30 bg-brand-light/40 p-4">
          <input
            type="checkbox"
            checked={sendInvoiceEmail}
            onChange={(e) => setSendInvoiceEmail(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">Send invoice to my email</span>
            <span className="mt-0.5 block text-xs text-muted">
              You can always download the PDF from Manage plan. Email is only sent if this is checked.
            </span>
          </span>
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Processing..." : "Continue to payment"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
