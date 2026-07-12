# ExpenseKit Pricing — Design spec

**Status:** Implemented (live `/pricing`)  
**Review:** http://localhost:3000/pricing · mockups at `/design-preview`  
**Branch:** `feat/pricing-page`

---

## Decisions (locked for v1)

| Topic | Choice |
|-------|--------|
| Theme | Light marketing (white / `#FAFAFA`) + brand orange `#FF6C37` — Ramp **structure**, not dark/olive clone |
| Route | `/pricing` (public); landing `#pricing` is a short teaser → `/pricing` |
| Chrome | Same `MarketingHeader` / `MarketingFooter` as landing & blog |
| Tiers | Free · Starter ₹999/mo · Growth ₹2,499/mo (highlighted) · Enterprise Custom |
| Audience map | Free = home/shop · Starter = shopkeepers · Growth = business owners · Enterprise = industrialists |
| Checkout | Marketing CTAs → `/register` or Contact sales; live Razorpay Pro/Beast stays on `/manage-plan` |
| Currency | INR only (`en-IN` formatting) |

---

## Screens

| ID | Screen | States |
|----|--------|--------|
| `pricing-desktop` | Full pricing page | Default |
| `pricing-mobile` | Same stacked | Cards stack; feature columns stack |

**Desktop:** max-width 6xl, 4 plan cards in one row (xl) / 2×2 (lg).  
**Mobile:** single column; Growth border still visible.

### Layout (Ramp-inspired)

1. Sticky marketing header (Pricing active)
2. Hero: eyebrow + headline + one supporting sentence
3. Plan cards: badge · name · price · note · description · CTA · feature groups with checkmarks
4. Trust strip under cards
5. Footer

### Visual rules

- Match live landing: ink `#212121`, muted `#6B6B6B`, border `#EBEBEB`
- Growth card: `border-2 border-brand` + brand CTA
- No dark theme; no olive accents
- Cards are interactive containers (CTA) — allowed per marketing patterns

---

## Copy source

[`src/lib/pricing.ts`](../src/lib/pricing.ts)

---

## Approval

Shipped with user request: start implementation + PR + merge.
