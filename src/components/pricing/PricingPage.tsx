import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import {
  PRICING_HERO,
  PRICING_PLANS,
  PRICING_TRUST,
  type PricingPlan,
} from "@/lib/pricing";

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-[#9b9b9b]"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
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

function PlanCta({ plan }: { plan: PricingPlan }) {
  const base =
    "mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition";
  if (plan.ctaVariant === "brand") {
    return (
      <Link href={plan.ctaHref} className={`${base} bg-brand text-white hover:bg-brand-hover`}>
        {plan.ctaLabel}
      </Link>
    );
  }
  return (
    <Link
      href={plan.ctaHref}
      className={`${base} border border-[#d1d1d1] bg-white text-[#212121] hover:bg-[#fafafa]`}
    >
      {plan.ctaLabel}
    </Link>
  );
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-6 sm:p-8 ${
        plan.highlighted ? "border-2 border-brand shadow-sm" : "border-[#ebebeb]"
      }`}
    >
      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          plan.highlighted ? "bg-brand text-white" : "bg-[#f5f5f5] text-[#6b6b6b]"
        }`}
      >
        {plan.badge}
      </span>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#212121]">{plan.name}</h2>
      <p className="mt-1 text-sm text-[#9b9b9b]">{plan.audience}</p>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#212121]">
        {plan.priceLabel}
        {plan.priceSuffix ? (
          <span className="text-base font-medium text-[#6b6b6b]">{plan.priceSuffix}</span>
        ) : null}
      </p>
      {plan.priceNote ? <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">{plan.priceNote}</p> : null}
      <p className="mt-4 text-sm leading-relaxed text-[#6b6b6b]">{plan.description}</p>
      <PlanCta plan={plan} />

      <div className="mt-8 border-t border-[#ebebeb] pt-6">
        <p className="text-sm font-semibold text-[#212121]">{plan.featureIntro}</p>
        <div className="mt-4 space-y-5">
          {plan.featureGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-[#212121]">{group.title}</h3>
              <ul className="mt-2 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-snug text-[#6b6b6b]">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <MarketingHeader active="pricing" />

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-10 pt-14 text-center lg:pt-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            {PRICING_HERO.eyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            {PRICING_HERO.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#6b6b6b]">
            {PRICING_HERO.subtitle}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PRICING_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <section className="border-t border-[#ebebeb] bg-[#fafafa] py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#212121] sm:text-3xl">
              {PRICING_TRUST.headline}
            </h2>
            <ul className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8">
              {PRICING_TRUST.points.map((point) => (
                <li key={point} className="text-sm font-medium text-[#6b6b6b]">
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-flex rounded-lg bg-brand px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brand-hover"
              >
                Get started — 14 days free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
