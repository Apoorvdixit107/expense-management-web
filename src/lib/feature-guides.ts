export type FeatureGuideId =
  | "getting-started"
  | "spend-statuses"
  | "record-spend"
  | "capture-receipt"
  | "approvals"
  | "policies"
  | "budgets"
  | "insights"
  | "tax"
  | "reports"
  | "ledger"
  | "connect-bank"
  | "team"
  | "entities"
  | "alerts"
  | "assistant";

export type FeatureGuideSection = {
  label?: string;
  badgeClass?: string;
  summary?: string;
  detail: string;
};

export type FeatureGuideContent = {
  id: FeatureGuideId;
  title: string;
  subtitle: string;
  buttonLabel: string;
  sections: FeatureGuideSection[];
  stepsTitle?: string;
  steps?: readonly string[];
  tip?: string;
};

export const FEATURE_GUIDES: Record<FeatureGuideId, FeatureGuideContent> = {
  "getting-started": {
    id: "getting-started",
    title: "How ExpenseKit works",
    subtitle: "A quick tour so you know where to record spend, get approvals, and read your numbers.",
    buttonLabel: "How it works",
    sections: [
      {
        label: "1. Pick your entity",
        summary: "Company, home, shop — separate books",
        detail:
          "Each organization has its own balance and reports. Switch entities from the header anytime.",
      },
      {
        label: "2. Record spend",
        summary: "Manual entry or AI receipt scan",
        detail:
          "Add outbound payments from Spend → Record spend, or upload a receipt for AI to pre-fill the form.",
      },
      {
        label: "3. Submit & approve",
        summary: "Draft → Pending → Posted",
        detail:
          "Save as draft while you gather details. Submit when ready — finance approves before it hits your balance.",
      },
      {
        label: "4. Track & export",
        summary: "Overview, budgets, reports",
        detail:
          "Use Overview for live totals, Budgets for limits, and Reports to export data your accountant needs.",
      },
    ],
    tip: "Start by recording one spend, then check Overview to see how it flows through your books.",
  },
  "spend-statuses": {
    id: "spend-statuses",
    title: "How spend statuses work",
    subtitle: "A quick guide so drafts, posted, and rejected never feel confusing.",
    buttonLabel: "How statuses work",
    sections: [
      {
        label: "Draft",
        badgeClass: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
        summary: "Saved, not finalized",
        detail: "You can edit freely. Nothing is added to reports or your balance until you submit.",
      },
      {
        label: "Pending",
        badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
        summary: "Waiting for approval",
        detail:
          "Your team lead or finance needs to approve this before it counts. You cannot edit while pending.",
      },
      {
        label: "Posted",
        badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
        summary: "Final — counts in reports",
        detail:
          "Locked to keep your books accurate. To fix a wrong category, use Change category (not Delete).",
      },
      {
        label: "Rejected",
        badgeClass: "bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-100",
        summary: "Not in reports",
        detail: "Removed from totals or sent back for fixes. Edit, then Submit to post again.",
      },
    ],
    stepsTitle: "Need to fix a category on a Posted spend?",
    steps: [
      "Find the spend under Posted and click Change category.",
      "Update the category (or other details) and save.",
      "Click Submit — it goes back to Posted and updates your totals.",
    ],
    tip: 'When recording new spend, turn on Save as draft if you might need to edit before it is finalized.',
  },
  "record-spend": {
    id: "record-spend",
    title: "How to record spend",
    subtitle: "Everything you need to log an outbound payment correctly.",
    buttonLabel: "How to record",
    sections: [
      {
        label: "Amount & date",
        detail: "Enter the exact amount paid and the date money left your account — not the invoice date unless they match.",
      },
      {
        label: "Category",
        detail: "Pick the category that best matches the purchase. This drives your reports and budget tracking.",
      },
      {
        label: "Payment mode",
        detail: "Cash, online, or bank — helps reconcile your ledger and filter Cash & Bank transactions.",
      },
      {
        label: "Save as draft",
        detail: "Turn this on if you are missing a receipt or approval. Submit when the spend is complete.",
      },
    ],
    tip: "Attach a receipt or use Capture receipt to let AI fill in amount, date, and merchant for you.",
  },
  "capture-receipt": {
    id: "capture-receipt",
    title: "How to capture receipts",
    subtitle: "Upload a photo or PDF — AI reads printed and handwritten bills.",
    buttonLabel: "How capture works",
    sections: [
      {
        label: "1. Upload",
        detail: "Choose a clear photo or PDF. Good lighting and a flat surface improve accuracy.",
      },
      {
        label: "2. Scan with AI",
        detail: "ExpenseKit extracts amount, date, merchant, and suggests a category. Always verify before saving.",
      },
      {
        label: "3. Review & submit",
        detail: "Edit any field, add notes, then save. The spend follows the same draft → approve → posted flow.",
      },
    ],
    stepsTitle: "Tips for better scans",
    steps: [
      "Crop out backgrounds — focus on the bill total and date.",
      "Handwritten notes? AI still works — double-check numbers.",
      "Scan another receipt anytime without losing your place.",
    ],
    tip: "Premium feature — Pro or Beast plan required for AI receipt scan.",
  },
  approvals: {
    id: "approvals",
    title: "How approvals work",
    subtitle: "Finance reviews spend before it posts to your books.",
    buttonLabel: "How approvals work",
    sections: [
      {
        label: "Pending queue",
        detail: "Submitted spends wait here until a finance user approves or rejects them.",
      },
      {
        label: "Approve",
        detail: "Approving moves the spend to Posted — it counts in balance and reports immediately.",
      },
      {
        label: "Reject",
        detail: "Add an optional reason. The submitter edits the spend and submits again.",
      },
      {
        label: "Policy flags",
        detail: "Spends that break a policy (e.g. over limit, missing receipt) show a warning before you decide.",
      },
    ],
    tip: "Nothing posts until finance says yes — that keeps your books clean and auditable.",
  },
  policies: {
    id: "policies",
    title: "How spend policies work",
    subtitle: "Set rules once — every submission is checked automatically.",
    buttonLabel: "How policies work",
    sections: [
      {
        label: "Max amount",
        detail: "Flag or block spends above a threshold so large purchases get a second look.",
      },
      {
        label: "Receipt required",
        detail: "Require a receipt above a certain amount — helps at tax time and during audits.",
      },
      {
        label: "On submit",
        detail: "When a spend breaks a rule, the submitter sees the policy message and finance sees it on approval.",
      },
    ],
    tip: "Start with one simple rule (e.g. receipt above ₹500) and add more as your team grows.",
  },
  budgets: {
    id: "budgets",
    title: "How budgets work",
    subtitle: "Set spending limits by category and period.",
    buttonLabel: "How budgets work",
    sections: [
      {
        label: "Monthly / quarterly / yearly",
        detail: "Create budgets per category for the period you care about — e.g. monthly office supplies.",
      },
      {
        label: "Performance",
        detail: "See spent vs limit at a glance. Posted spends count toward the budget.",
      },
      {
        label: "Alerts",
        detail: "Get notified when you approach or exceed a limit (configure under Alerts).",
      },
    ],
    tip: "Budgets are planning tools — they do not block spend, but they surface overspending early.",
  },
  insights: {
    id: "insights",
    title: "How insights work",
    subtitle: "Income vs spend and profit trends for your entity.",
    buttonLabel: "How insights work",
    sections: [
      {
        label: "Profit",
        detail: "Income minus posted expenses for the selected period.",
      },
      {
        label: "Profit margin",
        detail: "Profit as a percentage of income — useful for comparing months or entities.",
      },
      {
        label: "Top categories",
        detail: "See which expense categories drain profit the most.",
      },
      {
        label: "Cross-entity compare",
        detail: "If you run multiple organizations, compare profitability side by side.",
      },
    ],
    tip: "Change the period filter to spot seasonal patterns or one-off spikes.",
  },
  tax: {
    id: "tax",
    title: "How tax & GST works",
    subtitle: "Track GST on spends and prepare compliance data.",
    buttonLabel: "How tax works",
    sections: [
      {
        label: "GST on spends",
        detail: "Record tax components on outbound payments where applicable.",
      },
      {
        label: "Rates & categories",
        detail: "Match spends to the right GST treatment for your entity type.",
      },
      {
        label: "Reports",
        detail: "Export tax-related data from Reports for filing or your CA.",
      },
    ],
    tip: "Keep receipts for all GST-claimable spends — Capture receipt makes this easier.",
  },
  reports: {
    id: "reports",
    title: "How reports work",
    subtitle: "Exportable financial views for you and your accountant.",
    buttonLabel: "How reports work",
    sections: [
      {
        label: "Report types",
        detail: "Balance, profit & loss, category breakdown — pick the view you need.",
      },
      {
        label: "Date range",
        detail: "Filter by day, month, or custom range. Only Posted spends appear in totals.",
      },
      {
        label: "Export",
        detail: "Download CSV or PDF to share with finance, auditors, or tax filing.",
      },
    ],
    tip: "Opening vs closing balance shows cash position — great for month-end reconciliation.",
  },
  ledger: {
    id: "ledger",
    title: "How the ledger works",
    subtitle: "Cash, online, and bank transactions in one place.",
    buttonLabel: "How ledger works",
    sections: [
      {
        label: "Payment types",
        detail: "Filter by cash, online, or bank to reconcile how money actually moved.",
      },
      {
        label: "Posted only",
        detail: "The ledger reflects finalized spends that affect your real cash position.",
      },
      {
        label: "Connect Bank",
        detail: "Link accounts under Connect Bank to track balances alongside manual entries.",
      },
    ],
    tip: "Use the same payment mode when recording spend — it keeps ledger filters accurate.",
  },
  "connect-bank": {
    id: "connect-bank",
    title: "How bank connection works",
    subtitle: "Link accounts to track balances alongside your spend.",
    buttonLabel: "How connection works",
    sections: [
      {
        label: "Manual vs connected",
        detail: "Add account details manually, or connect via net banking where supported.",
      },
      {
        label: "Nicknames",
        detail: "Label accounts (e.g. HDFC Ops) so your team knows which book they belong to.",
      },
      {
        label: "Reconciliation",
        detail: "Compare bank balance with ExpenseKit ledger — manual spends still need to be recorded.",
      },
    ],
    tip: "Bank connection shows balances — you still record each spend for full category and approval tracking.",
  },
  team: {
    id: "team",
    title: "How team access works",
    subtitle: "Invite colleagues with the right role for your entity.",
    buttonLabel: "How team works",
    sections: [
      {
        label: "Member",
        detail: "Can record spend and view their entity — cannot approve or change policies.",
      },
      {
        label: "Finance",
        detail: "Approves spend, manages policies, budgets, and team — full spend control.",
      },
      {
        label: "Invites",
        detail:
          "Create an invite link and share it. They join your entity when they open the link and sign in.",
      },
    ],
    tip: "Give finance role only to people who should approve spends and see all transactions.",
  },
  entities: {
    id: "entities",
    title: "How entities work",
    subtitle: "Separate books for company, home, shop, or anything else.",
    buttonLabel: "How entities work",
    sections: [
      {
        label: "Create",
        detail: "Add a new entity with a name and type. Each gets its own balance and reports.",
      },
      {
        label: "Switch",
        detail: "Use the header switcher or Choose account to work in a different entity.",
      },
      {
        label: "Delete",
        detail: "Removing an entity is permanent — export reports first if you need the history.",
      },
    ],
    tip: "Most users start with one entity (e.g. Home) and add Company or Shop when needed.",
  },
  alerts: {
    id: "alerts",
    title: "How alerts work",
    subtitle: "Email and SMS notifications so nothing slips through.",
    buttonLabel: "How alerts work",
    sections: [
      {
        label: "Preferences",
        detail: "Choose which events trigger email or SMS — approvals, budget limits, trial reminders.",
      },
      {
        label: "In-app inbox",
        detail: "Recent notifications appear here. Mark as read when you have acted on them.",
      },
      {
        label: "Contact info",
        detail: "Keep email and mobile updated in Account so alerts reach you.",
      },
    ],
    tip: "Turn on approval alerts if you are finance — respond faster and keep books current.",
  },
  assistant: {
    id: "assistant",
    title: "How Ask finance works",
    subtitle: "AI answers questions using your real balance and recent transactions.",
    buttonLabel: "How AI works",
    sections: [
      {
        label: "What it knows",
        detail: "Reads your organization balance, recent spends, and budget context to personalize answers.",
      },
      {
        label: "What it cannot do",
        detail: "It does not move money, approve spend, or create transactions — ask it, then act in the app.",
      },
      {
        label: "Example questions",
        detail: '"How much did we spend on travel this month?" or "Are we over budget on office supplies?"',
      },
    ],
    tip: "Premium feature — best results when spends are posted and categories are consistent.",
  },
};

export function getFeatureGuide(id: FeatureGuideId): FeatureGuideContent {
  return FEATURE_GUIDES[id];
}
