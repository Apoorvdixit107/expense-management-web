"use client";

import { useCallback, useState } from "react";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { useSubscription } from "@/components/SubscriptionProvider";
import type { CheckoutSession, PlanCode } from "@/lib/types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export function useRazorpayCheckout() {
  const { refresh } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<PlanCode | null>(null);

  const payForPlan = useCallback(
    async (planCode: PlanCode) => {
      setLoadingPlan(planCode);

      try {
        const checkout = await api.createCheckout(planCode);
        await openCheckout(checkout, refresh);
        toast.success("Payment successful. Your plan is now active.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        if (message !== "Payment cancelled") {
          toast.error(message);
        } else {
          toast.info("Payment cancelled.");
        }
      } finally {
        setLoadingPlan(null);
      }
    },
    [refresh]
  );

  return { payForPlan, loadingPlan };
}

async function openCheckout(checkout: CheckoutSession, onSuccess: () => Promise<void>) {
  if (checkout.mock) {
    const confirmed = window.confirm(
      `Mock payment mode: confirm ${checkout.planName} plan for ₹${(checkout.amountPaise / 100).toFixed(0)}/month?`
    );
    if (!confirmed) return;

    await api.verifyPayment({
      razorpayOrderId: checkout.orderId,
      razorpayPaymentId: `pay_mock_${Date.now()}`,
      razorpaySignature: "mock_signature",
    });
    await onSuccess();
    return;
  }

  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable");
  }

  return new Promise<void>((resolve, reject) => {
    const options = {
      key: checkout.keyId,
      amount: checkout.amountPaise,
      currency: checkout.currency,
      name: "ExpenseKit",
      description: `${checkout.planName} — monthly plan`,
      order_id: checkout.orderId,
      theme: { color: "#E85D04" },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          await api.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          await onSuccess();
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    };

    const razorpay = new window.Razorpay!(options);
    razorpay.open();
  });
}
