import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Pricing | ExpenseKit",
  description:
    "INR plans for Indian home users, shopkeepers, business owners, and industrialists. Start free — scale with spend control, GST exports, and approvals.",
};

export default function PricingRoute() {
  return <PricingPage />;
}
