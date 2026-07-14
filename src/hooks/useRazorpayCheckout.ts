"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { buildRazorpayPrefill, showBillingError } from "@/lib/billingErrors";
import { CONTACT_EMAIL } from "@/lib/contact";
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

const CHECKOUT_TIMEOUT_MS = 25_000;
const VERIFY_TIMEOUT_MS = 45_000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      }
    );
  });
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
  const cancelPaymentRef = useRef<(() => void) | null>(null);

  const cancelPayment = useCallback(() => {
    cancelPaymentRef.current?.();
    cancelPaymentRef.current = null;
    setLoadingPlan(null);
  }, []);

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
      let settled = false;

      const cancelWaiters: Array<() => void> = [];
      cancelPaymentRef.current = () => {
        if (settled) return;
        settled = true;
        for (const cancel of cancelWaiters) cancel();
      };

      try {
        const checkout = await withTimeout(
          api.createCheckout({ planCode, shippingDetails, sendInvoiceEmail }),
          CHECKOUT_TIMEOUT_MS,
          "Payment is taking too long to start. Check your connection and try again."
        );

        await openCheckout(checkout, shippingDetails, refresh, options?.confirmMockPayment, {
          onAwaitingPayment: () => {
            toast.info("Complete payment in the Razorpay window to finish.");
          },
          registerCancel: (cancel) => {
            cancelWaiters.push(cancel);
          },
        });

        if (settled) return;

        toast.success(
          sendInvoiceEmail
            ? `Payment successful. Invoice will be emailed from ${CONTACT_EMAIL}.`
            : "Payment successful. Download your invoice from Manage plan."
        );
      } catch (err) {
        if (!settled) showBillingError(err);
      } finally {
        settled = true;
        cancelPaymentRef.current = null;
        setLoadingPlan(null);
      }
    },
    [refresh]
  );

  return { payForPlan, loadingPlan, cancelPayment };
}

async function openCheckout(
  checkout: CheckoutSession,
  shipping: ShippingDetails,
  onSuccess: () => Promise<void>,
  confirmMockPayment?: (checkout: CheckoutSession) => Promise<boolean>,
  hooks?: {
    onAwaitingPayment?: () => void;
    registerCancel?: (cancel: () => void) => void;
  }
) {
  if (checkout.mock) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Live Razorpay keys are not configured on the server. Contact ${CONTACT_EMAIL} or enable mock only for local testing.`
      );
    }
    const confirmed = confirmMockPayment ? await confirmMockPayment(checkout) : false;
    if (!confirmed) throw new Error("Payment cancelled");

    await withTimeout(
      api.verifyPayment({
        razorpayOrderId: checkout.orderId,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: "mock_signature",
      }),
      VERIFY_TIMEOUT_MS,
      "Payment verification timed out. If money was deducted, contact support."
    );
    await onSuccess();
    return;
  }

  if (!checkout.keyId?.trim() || !checkout.orderId?.trim()) {
    throw new Error("Payment could not be started. Razorpay is not configured correctly.");
  }

  await withTimeout(
    loadRazorpayScript(),
    15_000,
    "Payment service failed to load. Check your connection and try again."
  );
  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable");
  }

  const prefill = buildRazorpayPrefill(shipping);

  return new Promise<void>((resolve, reject) => {
    let done = false;
    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      fn();
    };

    hooks?.registerCancel?.(() => {
      finish(() => reject(new Error("Payment cancelled")));
    });

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
          await withTimeout(
            api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
            VERIFY_TIMEOUT_MS,
            `Payment verification timed out. If money was deducted, contact ${CONTACT_EMAIL}.`
          );
          await onSuccess();
          finish(() => resolve());
        } catch (err) {
          finish(() => reject(err));
        }
      },
      modal: {
        ondismiss: () => finish(() => reject(new Error("Payment cancelled"))),
      },
    };

    const razorpay = new window.Razorpay!(options);
    razorpay.on("payment.failed", (response) => {
      const description = response.error?.description;
      finish(() => reject(new Error(description || "Payment failed. Please try again.")));
    });
    razorpay.open();
    hooks?.onAwaitingPayment?.();
  });
}
