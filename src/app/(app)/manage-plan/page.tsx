"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BillingDetailsCard } from "@/components/BillingDetailsCard";
import { ShippingDetailsForm } from "@/components/ShippingDetailsForm";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { useSubscription } from "@/components/SubscriptionProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import type { Invoice, Plan, PlanCode, ShippingDetails } from "@/lib/types";

const features = [
  "Unlimited expenses",
  "Cloud sync across devices",
  "Dashboard & full reports",
  "Email & SMS notifications",
  "Priority support",
];

export default function ManagePlanPage() {
  const router = useRouter();
  const { subscription, loading, refresh } = useSubscription();
  const { payForPlan, loadingPlan } = useRazorpayCheckout();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [checkoutPlan, setCheckoutPlan] = useState<{ code: PlanCode; name: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login?next=/manage-plan");
      return;
    }
    api
      .listPlans()
      .then(setPlans)
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load plans";
        if (message.includes("404") || message.includes("Not Found")) {
          toast.error(
            "Billing API is unavailable. Restart backend with: bash scripts/start-tunnel.sh --build"
          );
        } else {
          toast.error(message);
        }
      });
    api
      .listInvoices()
      .then(setInvoices)
      .catch(() => setInvoices([]));
  }, [router]);

  if (!isAuthenticated()) {
    return <div className="py-20 text-center text-muted">Redirecting to sign in...</div>;
  }

  if (checkoutPlan) {
    return (
      <div className="space-y-8">
        <PageHeader title="Manage plan" subtitle="Enter details before payment" />
        <ShippingDetailsForm
          planLabel={checkoutPlan.name}
          loading={loadingPlan === checkoutPlan.code}
          onCancel={() => setCheckoutPlan(null)}
          onSubmit={async (details: ShippingDetails, sendInvoiceEmail: boolean) => {
            await payForPlan(checkoutPlan.code, details, sendInvoiceEmail);
            setCheckoutPlan(null);
            await refresh();
            const updated = await api.listInvoices();
            setInvoices(updated);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage plan"
        subtitle="Buy or renew your monthly subscription — Pro or Beast"
      />

      {loading ? <p className="text-sm text-muted">Loading subscription...</p> : null}

      {subscription.subscribed ? (
        <Card className="border-brand/30 bg-brand-light/30">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Current plan</p>
          <p className="mt-2 text-2xl font-bold text-ink">{subscription.planName}</p>
          <p className="mt-2 text-sm text-muted">
            Active until {subscription.currentPeriodEnd ? formatDateTime(subscription.currentPeriodEnd) : "—"}
          </p>
          {subscription.canRenew ? (
            <p className="mt-2 text-sm text-muted">Renew early to extend your billing period.</p>
          ) : null}
        </Card>
      ) : (
        <Card>
          <p className="font-semibold text-ink">No active plan</p>
          <p className="mt-1 text-sm text-muted">
            Choose Pro or Beast below to unlock the full app. Both plans include the same features for now.
          </p>
        </Card>
      )}

      <BillingDetailsCard />

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = subscription.planCode === plan.code && subscription.subscribed;
          const price = (plan.amountPaise / 100).toLocaleString("en-IN");

          return (
            <Card
              key={plan.code}
              className={`relative flex flex-col ${plan.code === "BEAST" ? "border-2 border-brand" : ""}`}
            >
              {plan.code === "BEAST" ? (
                <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              ) : null}
              <p className="font-semibold text-brand">{plan.name}</p>
              <p className="mt-2 text-3xl font-extrabold text-ink">
                ₹{price}
                <span className="text-base font-medium text-muted">/month</span>
              </p>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-muted">
                {features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  className="w-full"
                  variant={isCurrent ? "secondary" : "primary"}
                  disabled={loadingPlan === plan.code}
                  onClick={() => setCheckoutPlan({ code: plan.code as PlanCode, name: plan.name })}
                >
                  {loadingPlan === plan.code
                    ? "Processing..."
                    : isCurrent
                      ? "Renew plan"
                      : subscription.subscribed
                        ? `Switch to ${plan.name}`
                        : `Buy ${plan.name}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {invoices.length > 0 ? (
        <Card>
          <h2 className="text-lg font-bold text-ink">Invoices</h2>
          <p className="mt-1 text-sm text-muted">Download PDF invoices for your purchases.</p>
          <div className="mt-4 divide-y divide-border">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold text-ink">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-muted">
                    {invoice.planName} · ₹{(invoice.amountPaise / 100).toLocaleString("en-IN")} ·{" "}
                    {formatDateTime(invoice.issuedAt)}
                  </p>
                  <p className="text-xs text-muted">
                    {invoice.emailed ? "Emailed to" : "Not emailed · available for download ·"}{" "}
                    {invoice.customerEmail}
                  </p>
                </div>
                <Button variant="secondary" onClick={() => api.downloadInvoice(invoice.id)}>
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <p className="text-center text-sm text-muted">
        Payments secured by Razorpay. Need help?{" "}
        <Link href="/expenses" className="font-semibold text-brand hover:text-brand-hover">
          Back to expenses
        </Link>
      </p>
    </div>
  );
}
