"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { BillingDetails, ShippingDetails } from "@/lib/types";

type Props = {
  onSaved?: () => void;
};

export function BillingDetailsCard({ onSaved }: Props) {
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [sendInvoiceByEmail, setSendInvoiceByEmail] = useState(true);

  useEffect(() => {
    api
      .getBillingDetails()
      .then((data: BillingDetails) => {
        setSaved(data.saved);
        if (data.email) setEmail(data.email);
        if (data.name) setName(data.name);
        if (data.phone) setPhone(data.phone);
        if (data.gst) setGst(data.gst);
        if (data.pan) setPan(data.pan);
        if (data.address) setAddress(data.address);
        if (data.pincode) setPincode(data.pincode);
        setSendInvoiceByEmail(data.sendInvoiceByEmail);
      })
      .catch(() => setSaved(false))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateBillingDetails({
        shippingDetails: buildDetails(),
        sendInvoiceByEmail,
      });
      setSaved(updated.saved);
      toast.success("Billing details saved.");
      onSaved?.();
    } catch (err) {
      showApiError(err, "Failed to save billing details");
    } finally {
      setSaving(false);
    }
  }

  function buildDetails(): ShippingDetails {
    return {
      email: email.trim(),
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      gst: gst.trim() || undefined,
      pan: pan.trim() || undefined,
      address: address.trim() || undefined,
      pincode: pincode.trim() || undefined,
    };
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading billing details...</p>;
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-ink">Your billing details</h2>
      <p className="mt-1 text-sm text-muted">
        {saved
          ? "Saved to your account — used at checkout and on invoices."
          : "Add your details once — they’ll be pre-filled when you buy a plan."}
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <Input label="Email *" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
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

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-paper p-4">
          <input
            type="checkbox"
            checked={sendInvoiceByEmail}
            onChange={(e) => setSendInvoiceByEmail(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">Email invoice after purchase</span>
            <span className="mt-0.5 block text-xs text-muted">
              When checked, a PDF invoice is sent to your email when you buy or renew a plan.
            </span>
          </span>
        </label>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save billing details"}
        </Button>
      </form>
    </Card>
  );
}
