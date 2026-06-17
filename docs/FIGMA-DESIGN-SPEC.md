# ExpenseKit — Figma Design Spec

Build these frames in your Figma file:  
**[ExpenseKit on Figma](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit?node-id=0-1)**

After all screens are done, reply **"Design approved — implement"** and we match the code to Figma.

---

## Figma file structure

Create these **pages** (top-level tabs in Figma):

| Page | Contents |
|------|----------|
| `🎨 Design System` | Colors, type, spacing, components |
| `📱 Mobile` | 375×812 frames (iPhone 13 mini) |
| `🖥 Desktop` | 1440×900 frames |
| `📋 Handoff` | Notes for dev (optional) |

---

## Design system

### Colors

| Token | Hex | Usage |
|-------|-----|--------|
| `brand/primary` | `#0D9488` | Primary buttons, active nav, links |
| `brand/primary-hover` | `#0F766E` | Button hover |
| `brand/primary-light` | `#CCFBF1` | Badges, highlights |
| `neutral/900` | `#0F172A` | Headings, landing bg |
| `neutral/700` | `#334155` | Body text |
| `neutral/500` | `#64748B` | Secondary text, labels |
| `neutral/200` | `#E2E8F0` | Borders |
| `neutral/50` | `#F8FAFC` | Page background (app) |
| `surface/card` | `#FFFFFF` | Cards, auth forms |
| `semantic/error` | `#DC2626` | Errors |
| `semantic/success` | `#16A34A` | Success states |
| `landing/bg` | `#020617` | Landing page background |
| `landing/accent` | `#5EEAD4` | Landing kicker text |

### Typography (Inter)

| Style | Size | Weight | Line height | Use |
|-------|------|--------|-------------|-----|
| `Display` | 48px / 60px desktop | 800 | 1.1 | Landing hero |
| `H1` | 28px | 700 | 1.2 | Page titles |
| `H2` | 20px | 700 | 1.3 | Section titles |
| `Body` | 16px | 400 | 1.5 | Paragraphs |
| `Body SM` | 14px | 400 | 1.5 | Descriptions |
| `Label` | 14px | 500 | 1.2 | Form labels |
| `Caption` | 12px | 500 | 1.2 | Hints, badges |
| `Kicker` | 12px | 600 | 1.2 | Uppercase section labels |

### Spacing scale

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80`

### Radius

| Token | Value |
|-------|-------|
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `full` | 9999px |

### Shadows

| Token | Value |
|-------|-------|
| `card` | `0 1px 3px rgba(15,23,42,0.08)` |
| `elevated` | `0 10px 30px rgba(15,23,42,0.10)` |

---

## Components (create as Figma components)

### Button / Primary
- Height 44px, padding 16px 20px
- Fill `brand/primary`, text white, radius `md`, font Label 600
- States: default, hover, disabled (50% opacity)

### Button / Secondary
- Border 1px `neutral/200`, bg white, text `neutral/900`

### Button / Google
- Use official Google branding guidelines
- Height 44px, white bg, border `neutral/200`, radius `md`
- "Sign in with Google" / "Sign up with Google"

### Input
- Height 44px, border `neutral/200`, radius `md`, padding 12px
- Label above (14px 500), error text below in `semantic/error`

### Card
- White bg, border `neutral/200`, radius `lg`, padding 20–24px, shadow `card`

### Stat card
- Label caption gray, value H1 teal or dark

### Nav item (sidebar)
- Height 44px, radius `md`, inactive gray, active `brand/primary` fill + white text

### Category badge
- Pill, `brand/primary-light` bg, `brand/primary-hover` text, 12px semibold

### Divider "or"
- Horizontal line + centered "OR" caption

---

## Screen specs

### 1. Landing `/` — Desktop 1440

**Layout**
- Dark bg `landing/bg`
- Header: logo left, "Sign in" ghost + "Get started" primary right, max-width 1200, padding 24px
- Hero (max-width 720):
  - Kicker: "EXPENSE MANAGEMENT" teal
  - Headline Display: "Know where your money goes. Every day."
  - Subtext Body, slate-300 equivalent
  - CTAs: "Start free" primary + "Sign in" secondary outline
- Features: 3 cards in row, glass effect (white 5% bg, border white 10%)
- Pricing: 2 cards — Free ₹0, Pro ₹149/mo

**Mobile 375:** Stack vertically, headline 36px, full-width CTAs

---

### 2. Register `/register` — centered card 400px

**Card**
- Title H1: "Create account"
- Subtitle: "Start tracking your expenses for free"
- **Google button** full width (top)
- Divider "or"
- Fields: Full name, Email, Password
- Primary CTA: "Create account" full width
- Footer link: "Already have an account? Sign in"

**States to design:** default, error (red message), loading button

---

### 3. Login `/login` — same card style

- Title: "Welcome back"
- Google button → divider → Email → Password → "Sign in"
- Footer: "New here? Create account"

---

### 4. Dashboard `/dashboard` — Desktop

**Shell**
- Top bar: ExpenseKit logo + user name + Sign out
- Left sidebar 220px: Dashboard (active), Expenses, Reports, Notifications (badge count)
- Main content max-width fluid

**Content**
- Page title H1 "Dashboard" + subtitle
- Row of 3 stat cards: Total spent (7d), Transactions, Top category
- Section "Category breakdown" — horizontal bar chart (teal bars)
- Section "Recent notifications" — list cards

**Mobile:** Sidebar becomes horizontal scroll chips below header

---

### 5. Expenses `/expenses`

- Title + subtitle
- **Add expense** card: Category dropdown, Amount, Date/time, Description, "Save expense"
- **List:** Each row = category badge + amount bold + date + description + delete (red text/button)

**Empty state:** Dashed border card, "No expenses yet. Add your first expense above."

---

### 6. Reports `/reports`

- Title + period toggle pills: "Last 7 days" | "Last 30 days"
- 2 stat cards
- Category breakdown bars
- Monthly trend grid (bar per month)

---

### 7. Notifications `/notifications`

- List items: unread = teal tint bg, read = white
- Title bold + message + timestamp
- "Mark read" button on unread items

---

## States checklist (design all of these)

| Screen | States |
|--------|--------|
| Auth | Default, error, loading |
| Dashboard | With data, empty (new user) |
| Expenses | List, empty, delete confirm (optional) |
| Reports | With data, empty |
| Notifications | Unread, all read, empty |

---

## Dev handoff notes

When implementing, dev will map:

| Figma | Code |
|-------|------|
| Colors | `globals.css` CSS variables + Tailwind theme |
| Components | `src/components/ui/*` |
| Screens | `src/app/**/page.tsx` |

Name layers clearly: `Button/Primary`, `Input/Default`, `Card/Expense`.

---

## Review checklist (before approval)

- [ ] Design system page complete
- [ ] All 7 screens — mobile + desktop
- [ ] Google button on Login + Register
- [ ] Empty states included
- [ ] Colors match tokens above (or document changes)
- [ ] Share Figma link with "can view" access

**Approve:** Reply `Design approved — implement`
