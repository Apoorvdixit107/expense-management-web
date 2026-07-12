/** Public marketing pricing — INR tiers for Indian segments. Live Razorpay checkout remains on /manage-plan. */

export type PricingPlanId = "free" | "starter" | "growth" | "enterprise";

export type PricingFeatureGroup = {
  title: string;
  items: string[];
};

export type PricingPlan = {
  id: PricingPlanId;
  badge: string;
  name: string;
  audience: string;
  priceLabel: string;
  priceSuffix?: string;
  priceNote?: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "primary" | "secondary" | "brand";
  highlighted?: boolean;
  featureIntro: string;
  featureGroups: PricingFeatureGroup[];
};

export const PRICING_HERO = {
  eyebrow: "Pricing for every Indian business",
  title: "Start free. Scale with control.",
  subtitle:
    "Whether you run a shop, a growing company, or multiple factories — ExpenseKit keeps every rupee policy-checked, GST-ready, and approval-clean.",
} as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    badge: "Home & shop",
    name: "Free",
    audience: "Home users & shopkeepers",
    priceLabel: "₹0",
    priceSuffix: "/mo",
    priceNote: "14-day company trial included when you create a workspace.",
    description: "Best for personal tracking and single-shop expense logs.",
    ctaLabel: "Get started free",
    ctaHref: "/register",
    ctaVariant: "secondary",
    featureIntro: "Key features:",
    featureGroups: [
      {
        title: "Everyday spend",
        items: [
          "Unlimited personal expense entries",
          "Receipt photo capture",
          "Categories in INR",
          "Simple monthly overview",
        ],
      },
      {
        title: "Shop basics",
        items: [
          "One workspace for your shop or home",
          "Export CSV for your books",
          "Mobile-friendly logging",
        ],
      },
    ],
  },
  {
    id: "starter",
    badge: "Small business",
    name: "Starter",
    audience: "Shopkeepers & small owners",
    priceLabel: "₹999",
    priceSuffix: "/mo",
    priceNote: "1 entity · up to 5 users. Save with annual billing.",
    description: "Policies, approvals, and GST export for a single shop or office.",
    ctaLabel: "Start free trial",
    ctaHref: "/register",
    ctaVariant: "secondary",
    featureIntro: "All Free features, and:",
    featureGroups: [
      {
        title: "Spend control",
        items: [
          "Spend policies (limits & receipt rules)",
          "Single-level approval queue",
          "Audit trail on every submission",
        ],
      },
      {
        title: "GST & books",
        items: [
          "GST splits on expenses",
          "GST summary export for your CA",
          "Vendor tracking basics",
        ],
      },
      {
        title: "Team",
        items: ["Up to 5 users", "Role-based submit vs approve"],
      },
    ],
  },
  {
    id: "growth",
    badge: "Business owners",
    name: "Growth",
    audience: "Growing companies & industrialists",
    priceLabel: "₹2,499",
    priceSuffix: "/mo",
    priceNote: "Up to 3 entities · 15 users. Save 20% with annual billing.",
    description: "Budgets, multi-entity visibility, and CA-ready insights for teams that scale.",
    ctaLabel: "Start free trial",
    ctaHref: "/register",
    ctaVariant: "brand",
    highlighted: true,
    featureIntro: "All Starter features, and:",
    featureGroups: [
      {
        title: "Budgets & reporting",
        items: [
          "Budgets vs actuals in real time",
          "Custom reports for finance",
          "Scheduled exports for your CA",
        ],
      },
      {
        title: "Multi-entity",
        items: [
          "Up to 3 entities (shops, plants, offices)",
          "Entity-level visibility controls",
          "Shared policy templates",
        ],
      },
      {
        title: "Automation",
        items: [
          "AI-assisted expense review hints",
          "Faster approval recommendations",
          "Priority email support",
        ],
      },
    ],
  },
  {
    id: "enterprise",
    badge: "Industrialists",
    name: "Enterprise",
    audience: "Large industrialists & groups",
    priceLabel: "Custom",
    priceNote: "Annual billing. Scoped to your org.",
    description: "Multi-factory control, custom workflows, and white-glove onboarding.",
    ctaLabel: "Contact sales",
    ctaHref: "/login",
    ctaVariant: "secondary",
    featureIntro: "All Growth features, and:",
    featureGroups: [
      {
        title: "Enterprise services",
        items: [
          "Custom implementation & training",
          "Advanced org, role, and entity setup",
          "Custom policy & workflow configuration",
        ],
      },
      {
        title: "Scale & compliance",
        items: [
          "Unlimited entities (as scoped)",
          "Advanced audit logs",
          "Dedicated success manager",
        ],
      },
      {
        title: "Integrations",
        items: [
          "Tally / Zoho Books handoff support",
          "API & ERP extension scoping",
          "Priority 24/7 support",
        ],
      },
    ],
  },
];

export const PRICING_TRUST = {
  headline: "Built for Indian finance teams — from kirana shops to industrial groups.",
  points: [
    "GST-native · INR · Razorpay billing",
    "Policies before spend hits the books",
    "Exports your CA will actually use",
  ],
} as const;
