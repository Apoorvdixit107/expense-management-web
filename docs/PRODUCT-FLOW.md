# ExpenseKit — Product flow & business rules

## Design references

Visual style inspired by:

- [Money Lover](https://moneylover.me/) — simple tracking, instant start
- [Fast Budget](https://fastbudget.app/) — finances at a glance, clear pricing
- [Spendee](https://www.spendee.com/) — clean dashboard preview, category charts

**Theme:** Crimson orange (`#E85D04`) + white

---

## Core UX principle

**Users land on Expenses and start using the product immediately — no sign-up wall.**

```
/  →  /expenses (guest)  →  7-day trial  →  subscribe  →  full app
         ↓
    /notifications (guest: add email/mobile first)
```

---

## User states

| State | Access | Data storage |
|-------|--------|--------------|
| **Guest (trial)** | Expenses + Notifications only | Local device (browser) |
| **Guest + contact** | Notifications with email/SMS alerts | Local + contact info saved |
| **Account (no sub)** | Same as guest, progress can sync if account created | Server (limited) |
| **Subscriber** | Dashboard, Expenses, Reports, Notifications | Server (full) |

---

## Free trial (7 days)

- Starts automatically on first visit (no account required)
- User can add expenses immediately
- Trial banner shows days remaining
- User **may create an account during trial** (optional) to save progress
- After 7 days → redirect to **Subscribe** screen
- Guest can still sign in if they created an account during trial

---

## Subscription

- **Subscribe** required to continue after trial
- Only **subscribed users** get full data management on server
- Subscriber unlocks: Dashboard, Reports, cloud sync, full notification history

### Pricing (preview)

| Plan | Price | Includes |
|------|-------|----------|
| Trial | ₹0 / 7 days | Expenses + basic notifications |
| Pro | ₹149/mo | Unlimited expenses, reports, sync, alerts |

---

## Data retention policy

| Scenario | Rule |
|----------|------|
| Guest (no account) | Data in browser only; cleared if user clears storage |
| Account created, **not subscribed** | Data deleted **3 months after account creation date** |
| **Subscribed** | Data retained while subscription is active |
| Subscription lapses | Grace period → then same 3-month deletion rule from account creation |

---

## Notifications flow

### Guest (not signed up)

1. User opens **Notifications** tab
2. If email/mobile **not set** → show **contact setup** screen
3. After contact saved → show **activity feed** (user actions: expense added, trial reminders, summaries)
4. Alerts sent to provided email/mobile

### Subscriber (signed up + subscribed)

- Full notification history in app
- Email + SMS from account profile
- Mark as read, persistent storage

---

## Routes (planned)

| Route | Who | Screen |
|-------|-----|--------|
| `/` | Guest | Redirect → `/expenses` |
| `/expenses` | Guest + Subscriber | Add/view expenses |
| `/notifications` | Guest + Subscriber | Setup or activity / full inbox |
| `/subscribe` | Trial ended | Pricing & payment |
| `/register` | Anyone | Optional during trial |
| `/login` | Returning | Sign in |
| `/dashboard` | Subscriber | Overview |
| `/reports` | Subscriber | Analytics |

---

## Approval

Review all screens at **http://localhost:3000/design-preview**

Reply **"Design approved — implement"** to build this flow in production code.
