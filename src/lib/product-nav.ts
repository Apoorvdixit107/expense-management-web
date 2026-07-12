/** Shared Products mega menu + landing feature anchors. */

export type ProductIconId =
  | "expense"
  | "policies"
  | "approvals"
  | "gst"
  | "reports"
  | "ledger"
  | "budgets"
  | "entities"
  | "team"
  | "ai"
  | "alerts"
  | "assistant";

export type ProductNavItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ProductIconId;
};

export type ProductNavGroup = {
  id: string;
  label: string;
  items: ProductNavItem[];
};

export const PRODUCT_NAV_COLUMNS: ProductNavGroup[] = [
  {
    id: "spend-control",
    label: "Spend control",
    items: [
      {
        id: "feature-expenses",
        title: "Expense management",
        description: "Record, submit, and track every rupee",
        href: "/#feature-expenses",
        icon: "expense",
      },
      {
        id: "feature-policies",
        title: "Policies",
        description: "Limits and receipt rules at submit",
        href: "/#feature-policies",
        icon: "policies",
      },
      {
        id: "feature-approvals",
        title: "Approvals",
        description: "Finance queue with audit trail",
        href: "/#feature-approvals",
        icon: "approvals",
      },
    ],
  },
  {
    id: "gst-books",
    label: "GST & books",
    items: [
      {
        id: "feature-gst",
        title: "GST-ready expenses",
        description: "Splits and summaries for Indian SMBs",
        href: "/#feature-gst",
        icon: "gst",
      },
      {
        id: "feature-reports",
        title: "Reports & exports",
        description: "CA-ready CSV and scheduled exports",
        href: "/#feature-reports",
        icon: "reports",
      },
      {
        id: "feature-ledger",
        title: "Cash & bank ledger",
        description: "Payment modes and reconciliation view",
        href: "/#feature-ledger",
        icon: "ledger",
      },
    ],
  },
  {
    id: "team-scale",
    label: "Team & scale",
    items: [
      {
        id: "feature-budgets",
        title: "Budgets",
        description: "Limits vs actuals by category",
        href: "/#feature-budgets",
        icon: "budgets",
      },
      {
        id: "feature-entities",
        title: "Multi-entity",
        description: "Shops, plants, and offices",
        href: "/#feature-entities",
        icon: "entities",
      },
      {
        id: "feature-team",
        title: "Team roles",
        description: "Submit vs approve",
        href: "/#feature-team",
        icon: "team",
      },
    ],
  },
];

export const PRODUCT_NAV_PLATFORM: ProductNavGroup = {
  id: "platform",
  label: "Platform",
  items: [
    {
      id: "feature-ai",
      title: "AI receipt scan",
      description: "Photo or PDF → pre-filled spend",
      href: "/#feature-ai",
      icon: "ai",
    },
    {
      id: "feature-alerts",
      title: "Alerts",
      description: "Budget and policy notifications",
      href: "/#feature-alerts",
      icon: "alerts",
    },
    {
      id: "feature-assistant",
      title: "Assistant",
      description: "Guided help inside the workspace",
      href: "/#feature-assistant",
      icon: "assistant",
    },
  ],
};

/** Landing feature copy — longer body than mega menu subcopy. */
export type LandingFeature = ProductNavItem & {
  body: string;
};

export const LANDING_FEATURE_GROUPS: {
  id: string;
  label: string;
  items: LandingFeature[];
}[] = [
  {
    id: "spend-control",
    label: "Spend control",
    items: [
      {
        ...PRODUCT_NAV_COLUMNS[0].items[0],
        body: "Log spend manually or from receipts. Drafts stay editable until you submit — then finance decides what posts.",
      },
      {
        ...PRODUCT_NAV_COLUMNS[0].items[1],
        body: "Set limits and receipt rules once — every submission is checked before it hits your books.",
      },
      {
        ...PRODUCT_NAV_COLUMNS[0].items[2],
        body: "Single-level approval queue with audit trail. Nothing posts until finance says yes.",
      },
    ],
  },
  {
    id: "gst-books",
    label: "GST & books",
    items: [
      {
        ...PRODUCT_NAV_COLUMNS[1].items[0],
        body: "GST splits, summaries, and exports built for Indian SMBs and your CA.",
      },
      {
        ...PRODUCT_NAV_COLUMNS[1].items[1],
        body: "Custom reports for finance and CSV exports your accountant will actually use.",
      },
      {
        ...PRODUCT_NAV_COLUMNS[1].items[2],
        body: "Track cash, online, and bank payments so ledger filters stay reconciliation-friendly.",
      },
    ],
  },
  {
    id: "team-scale",
    label: "Team & scale",
    items: [
      {
        ...PRODUCT_NAV_COLUMNS[2].items[0],
        body: "Category budgets vs actuals in real time — see overspend before month-end surprises.",
      },
      {
        ...PRODUCT_NAV_COLUMNS[2].items[1],
        body: "Separate books for shops, plants, and offices with entity-level visibility controls.",
      },
      {
        ...PRODUCT_NAV_COLUMNS[2].items[2],
        body: "Role-based submit vs approve so operators log spend and finance stays in control.",
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    items: [
      {
        ...PRODUCT_NAV_PLATFORM.items[0],
        body: "Upload a photo or PDF — AI pre-fills amount, date, and merchant. You verify before saving.",
      },
      {
        ...PRODUCT_NAV_PLATFORM.items[1],
        body: "Get notified when spend approaches a budget or breaks a policy rule.",
      },
      {
        ...PRODUCT_NAV_PLATFORM.items[2],
        body: "In-app guidance for recording spend, approvals, GST, and reports — without leaving the workspace.",
      },
    ],
  },
];
