import { PRICING_HERO, PRICING_PLANS, PRICING_TRUST } from "@/lib/pricing";

/** Match live landing marketing colors. */
const m = {
  brand: "#FF6C37",
  ink: "#212121",
  muted: "#6B6B6B",
  faint: "#9B9B9B",
  border: "#EBEBEB",
  paper: "#FAFAFA",
  white: "#FFFFFF",
  chip: "#F5F5F5",
} as const;

function MockHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="flex items-center justify-between border-b px-4 py-3"
      style={{ borderColor: m.border, background: m.white }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white"
          style={{ background: m.brand }}
        >
          E
        </span>
        <span className="text-sm font-bold" style={{ color: m.ink }}>
          ExpenseKit
        </span>
      </div>
      {!compact ? (
        <div className="hidden items-center gap-4 text-xs font-medium sm:flex" style={{ color: m.muted }}>
          <span>Features</span>
          <span className="font-semibold" style={{ color: m.ink }}>
            Pricing
          </span>
          <span>Blog</span>
        </div>
      ) : null}
      <span
        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
        style={{ background: m.brand }}
      >
        Start free trial
      </span>
    </div>
  );
}

function Check() {
  return (
    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: m.faint }} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCardMock({
  planId,
  condensed = false,
}: {
  planId: (typeof PRICING_PLANS)[number]["id"];
  condensed?: boolean;
}) {
  const plan = PRICING_PLANS.find((p) => p.id === planId)!;
  const groups = condensed ? plan.featureGroups.slice(0, 1) : plan.featureGroups;

  return (
    <div
      className="flex flex-col rounded-2xl border p-4"
      style={{
        borderColor: plan.highlighted ? m.brand : m.border,
        borderWidth: plan.highlighted ? 2 : 1,
        background: m.white,
      }}
    >
      <span
        className="inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
        style={{
          background: plan.highlighted ? m.brand : m.chip,
          color: plan.highlighted ? m.white : m.muted,
        }}
      >
        {plan.badge}
      </span>
      <p className="mt-2 text-lg font-extrabold" style={{ color: m.ink }}>
        {plan.name}
      </p>
      <p className="text-[11px]" style={{ color: m.faint }}>
        {plan.audience}
      </p>
      <p className="mt-2 text-xl font-extrabold" style={{ color: m.ink }}>
        {plan.priceLabel}
        {plan.priceSuffix ? (
          <span className="text-xs font-medium" style={{ color: m.muted }}>
            {plan.priceSuffix}
          </span>
        ) : null}
      </p>
      <p className="mt-2 text-[11px] leading-snug" style={{ color: m.muted }}>
        {plan.description}
      </p>
      <span
        className="mt-3 inline-flex justify-center rounded-lg px-3 py-2 text-[11px] font-semibold"
        style={{
          background: plan.ctaVariant === "brand" ? m.brand : m.white,
          color: plan.ctaVariant === "brand" ? m.white : m.ink,
          border: plan.ctaVariant === "brand" ? undefined : `1px solid #D1D1D1`,
        }}
      >
        {plan.ctaLabel}
      </span>
      <div className="mt-4 border-t pt-3" style={{ borderColor: m.border }}>
        <p className="text-[11px] font-semibold" style={{ color: m.ink }}>
          {plan.featureIntro}
        </p>
        {groups.map((group) => (
          <div key={group.title} className="mt-2">
            <p className="text-[11px] font-bold" style={{ color: m.ink }}>
              {group.title}
            </p>
            <ul className="mt-1 space-y-1">
              {(condensed ? group.items.slice(0, 3) : group.items).map((item) => (
                <li key={item} className="flex gap-1.5 text-[10px] leading-snug" style={{ color: m.muted }}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingDesktopMockup() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: m.border }}>
      <MockHeader />
      <div className="px-6 pb-6 pt-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: m.brand }}>
          {PRICING_HERO.eyebrow}
        </p>
        <h2 className="mx-auto mt-2 max-w-lg text-2xl font-extrabold tracking-tight" style={{ color: m.ink }}>
          {PRICING_HERO.title}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed" style={{ color: m.muted }}>
          {PRICING_HERO.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3 px-4 pb-6">
        {PRICING_PLANS.map((plan) => (
          <PlanCardMock key={plan.id} planId={plan.id} condensed />
        ))}
      </div>
      <div className="border-t px-6 py-6 text-center" style={{ borderColor: m.border, background: m.paper }}>
        <p className="text-sm font-bold" style={{ color: m.ink }}>
          {PRICING_TRUST.headline}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-[10px]" style={{ color: m.muted }}>
          {PRICING_TRUST.points.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingMobileMockup() {
  return (
    <div
      className="mx-auto max-w-[375px] overflow-hidden rounded-xl border bg-white"
      style={{ borderColor: m.border }}
    >
      <MockHeader compact />
      <div className="px-4 pb-4 pt-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: m.brand }}>
          {PRICING_HERO.eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-extrabold tracking-tight" style={{ color: m.ink }}>
          {PRICING_HERO.title}
        </h2>
        <p className="mt-2 text-[11px] leading-relaxed" style={{ color: m.muted }}>
          {PRICING_HERO.subtitle}
        </p>
      </div>
      <div className="space-y-3 px-4 pb-6">
        {PRICING_PLANS.map((plan) => (
          <PlanCardMock key={plan.id} planId={plan.id} condensed />
        ))}
      </div>
      <div className="border-t px-4 py-5 text-center" style={{ borderColor: m.border, background: m.paper }}>
        <p className="text-xs font-bold" style={{ color: m.ink }}>
          {PRICING_TRUST.headline}
        </p>
      </div>
    </div>
  );
}
