"use client";

import { useCallback, useState } from "react";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { buildRazorpayPrefill, showBillingError } from "@/lib/billingErrors";
import { useSubscription } from "@/components/SubscriptionProvider";
import type { CheckoutSession, PlanCode, ShippingDetails } from "@/lib/types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
    };
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
    async (
      planCode: PlanCode,
      shippingDetails: ShippingDetails,
      sendInvoiceEmail: boolean,
      options?: {
        confirmMockPayment?: (checkout: CheckoutSession) => Promise<boolean>;
      }
    ) => {
      setLoadingPlan(planCode);

      try {
        const checkout = await api.createCheckout({ planCode, shippingDetails, sendInvoiceEmail });
        await openCheckout(checkout, shippingDetails, refresh, options?.confirmMockPayment);
        toast.success(
          sendInvoiceEmail
            ? "Payment successful. Invoice will be emailed to you."
            : "Payment successful. Download your invoice from Manage plan."
        );
      } catch (err) {
        showBillingError(err);
      } finally {
        setLoadingPlan(null);
      }
    },
    [refresh]
  );

  return { payForPlan, loadingPlan };
}

async function openCheckout(
  checkout: CheckoutSession,
  shipping: ShippingDetails,
  onSuccess: () => Promise<void>,
  confirmMockPayment?: (checkout: CheckoutSession) => Promise<boolean>
) {
  if (checkout.mock) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Payment could not be started. Please try again or contact support.");
    }
    const confirmed = confirmMockPayment
      ? await confirmMockPayment(checkout)
      : false;
    if (!confirmed) throw new Error("Payment cancelled");

    await api.verifyPayment({
      razorpayOrderId: checkout.orderId,
      razorpayPaymentId: `pay_mock_${Date.now()}`,
      razorpaySignature: "mock_signature",
    });
    await onSuccess();
    return;
  }

  if (!checkout.keyId?.trim() || !checkout.orderId?.trim()) {
    throw new Error("Payment could not be started. Razorpay is not configured correctly.");
  }

  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable");
  }

  const prefill = buildRazorpayPrefill(shipping);

  return new Promise<void>((resolve, reject) => {
    const options: Record<string, unknown> = {
      key: checkout.keyId,
      currency: checkout.currency,
      name: "ExpenseKit",
      description: `${checkout.planName} monthly plan`,
      order_id: checkout.orderId,
      prefill,
      theme: { color: "#FF6C37" },
      retry: { enabled: true, max_count: 3 },
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
    razorpay.on("payment.failed", (response) => {
      const description = response.error?.description;
      reject(new Error(description || "Payment failed. Please try again."));
    });
    razorpay.open();
  });
}
