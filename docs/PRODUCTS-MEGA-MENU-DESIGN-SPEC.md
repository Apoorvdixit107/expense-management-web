# ExpenseKit Products mega menu — Design spec

**Status:** Approved — mega menu + expand landing features  
**Reference:** Ramp Products dropdown (structure only)  
**Live chrome:** Match landing / pricing / blog — light marketing + brand orange `#FF6C37`  
**Review:** `/` (landing) + Products ▾ in header

---

## Approach

Add a **Products** nav item with a Ramp-style mega menu so visitors can scan the full product surface without stuffing the landing feature grid.

| Topic | Choice (proposed) |
|-------|-------------------|
| Pattern | Desktop hover/focus mega panel; mobile accordion under hamburger or stacked list |
| Theme | Light panel on white header — **not** Ramp dark/olive clone |
| Nav change | Replace plain **Features** link with **Products ▾** (Features section on landing stays) |
| Click behavior | Each row links to a landing `#anchor` or short marketing deep-link; CTA row optional |
| Icons | Monoline 20×20, ink `#212121`, left of title |
| Scope v1 | Header mega menu only — landing `#features` can stay 3 cards or expand later |

---

## Screens to approve

| ID | Screen | States |
|----|--------|--------|
| `mega-desktop` | Header + open Products panel (1440) | Default open, hover row |
| `mega-mobile` | Products accordion (375) | Collapsed / expanded |

**Desktop:** sticky header; panel full width under nav (max-width 6xl centered), soft border `#EBEBEB`, shadow `elevated`.  
**Mobile:** Products expands inline; same groups stacked; no floating dark overlay.

### Visual rules

- Ink `#212121`, muted `#6B6B6B`, border `#EBEBEB`, surface white / `#FAFAFA`
- Section labels: 12px, uppercase, tracking wide, muted
- Item title: 14–15px semibold ink; description: 13px muted, one line
- Row hover: `#FAFAFA` background (no card chrome)
- No purple, no olive, no dark mega panel

---

## Information architecture (ExpenseKit-real, not Ramp clones)

Only ship what the product actually has. No corporate cards, AP, travel, or banking products we do not sell.

### Column 1 — SPEND CONTROL

| Title | Subcopy | Anchor / href |
|-------|---------|---------------|
| Expense management | Record, submit, and track every rupee | `/#features` or `/register` |
| Policies | Limits and receipt rules at submit | `/#feature-policies` |
| Approvals | Finance queue with audit trail | `/#feature-approvals` |

### Column 2 — GST & BOOKS

| Title | Subcopy | Anchor / href |
|-------|---------|---------------|
| GST-ready expenses | Splits and summaries for Indian SMBs | `/#feature-gst` |
| Reports & exports | CA-ready CSV and scheduled exports | `/#feature-reports` |
| Cash & bank ledger | Payment modes and reconciliation view | `/#feature-ledger` |

### Column 3 — TEAM & SCALE

| Title | Subcopy | Anchor / href |
|-------|---------|---------------|
| Budgets | Limits vs actuals by category | `/#feature-budgets` |
| Multi-entity | Shops, plants, and offices | `/#feature-entities` |
| Team roles | Submit vs approve | `/#feature-team` |

### Bottom row — PLATFORM (full width, 3–4 items)

| Title | Subcopy | Anchor / href |
|-------|---------|---------------|
| AI receipt scan | Photo or PDF → pre-filled spend | `/#feature-ai` |
| Alerts | Budget and policy notifications | `/#feature-alerts` |
| Assistant | Guided help inside the workspace | `/#feature-assistant` |
| Integrations (later) | Tally / Zoho handoff — Enterprise | Hide until ready, or link `/pricing` |

---

## Header chrome (after change)

```
[Logo]   Products ▾   Pricing   Blog   Sign in     [Contact sales]  [Start free trial]
              │
              └─ mega panel (3 columns + Platform strip)
```

---

## Landing page relationship (optional follow-up)

**v1 (this spec):** mega menu only. Landing features section unchanged (current 3 cards).  
**v2 (if you want):** expand `#features` to match the same groups with anchors so menu deep-links land on content.

---

## Figma (optional)

Add to [ExpenseKit on Figma](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit?node-id=0-1):

1. `Marketing / Products mega / Desktop 1440`
2. `Marketing / Products mega / Mobile 375`
3. Hover state on one row

Or approve from this spec + a `/design-preview` mockup after you say go.

---

## Approval

**Approved:** mega menu + expand landing features (user chose option 2).
