# Contact email (`contact@expenseit.co.in`) — UI Implementation Guide

**Audience:** Frontend / UI team  
**Backend:** `billing-service`, `notification-service` (via API gateway)  
**Public contact address:** `contact@expenseit.co.in`  
**Related web PR:** https://github.com/Apoorvdixit107/expense-management-web/pull/13  
**Backend branch:** `feature/contact-email-identity`

---

## 1. Overview

Outbound mail **From / Reply-To** is set only on the backend. The web app:

1. **Displays** `contact@expenseit.co.in` wherever users see company contact (footer, support, checkout “Billed by”).
2. **Collects** the user’s recipient email (notification prefs, invoice shipping) — it never sets SMTP `From`.
3. **Reads** company identity from `GET /api/billing/company` for checkout/invoice UI.

Once backend env is live with GoDaddy/Microsoft 365 SMTP, no further frontend change is required for mail identity — only when new product email types are added.

---

## 2. What frontend already owns

| Item | Where | Notes |
|------|--------|--------|
| Constant | `src/lib/contact.ts` → `CONTACT_EMAIL` | Should be `contact@expenseit.co.in` |
| Env override | `NEXT_PUBLIC_CONTACT_EMAIL` | Optional; see `.env.local.example` |
| Public display | Footer, help, marketing, empty support links | Prefer constant over hard-coded strings |

**UI rule:** If API `email` is missing/empty, fall back to `CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_EMAIL`.

---

## 3. Backend checklist (filled for frontend)

### 3.1 Mail From config

| Field | Value |
|-------|--------|
| From address | `contact@expenseit.co.in` |
| From display name | `ExpenseKit` |
| Reply-To | `contact@expenseit.co.in` |
| Provider | GoDaddy mailbox → Microsoft 365 SMTP (`smtp.office365.com:587`) or classic GoDaddy (`smtpout.secureserver.net`) |
| Auth | Env vars only (`MAIL_USERNAME` / `MAIL_PASSWORD`) |

**Env key names (notification + billing):**

```env
NOTIFICATION_EMAIL_FROM=contact@expenseit.co.in
BILLING_EMAIL_FROM=contact@expenseit.co.in
MAIL_FROM_NAME=ExpenseKit
MAIL_REPLY_TO=contact@expenseit.co.in
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=contact@expenseit.co.in
MAIL_PASSWORD=
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
EMAIL_BRAND_SUPPORT_EMAIL=contact@expenseit.co.in
BILLING_COMPANY_EMAIL=contact@expenseit.co.in
```

Frontend does **not** set these.

### 3.2 Domain / mailbox

| Check | Owner |
|-------|--------|
| Mailbox `contact@expenseit.co.in` exists & monitored | Ops / product |
| SPF/DKIM for `expenseit.co.in` | GoDaddy DNS + mail provider |
| Staging test not spam (Gmail / Outlook) | Verify after env update |

### 3.3 Which emails already use this From

| Trigger | Live? | Frontend touchpoint |
|---------|-------|---------------------|
| Team invite | **No outbound email yet** — API returns invite link only | `POST /api/organizations/{id}/team/invites` → show `acceptUrl` / copy link |
| Invoice PDF (user opts in) | **Yes** | Checkout `sendInvoiceEmail` + billing details |
| Notification alerts (expense, daily summary, etc.) | **Yes** | `/api/notifications/*` prefs |
| Test notification | **Yes** | `POST /api/notifications/test` |
| Password reset / auth emails | **None** — JWT + Google OAuth only | N/A |
| Payment / subscription | Invoice email only | Checkout / manage plan |

### 3.4 Billing company API

`GET /api/billing/company` — **public** (no JWT).

**Expected sample:**

```json
{
  "companyName": "ExpenseIt",
  "location": "Bangalore",
  "email": "contact@expenseit.co.in"
}
```

| Field | UI use |
|-------|--------|
| `companyName` | “Billed by” / seller name on checkout & invoices |
| `location` | Address / city line under seller |
| `email` | Mailto / contact line; fallback to `CONTACT_EMAIL` if empty |

### 3.5 How to send a test email (verify From header)

1. Sign in (JWT).
2. Save prefs with email enabled: `PUT /api/notifications/preferences`.
3. Call `POST /api/notifications/test`.
4. In Gmail: open message → **Show original** → confirm:
   - `From: ExpenseKit <contact@expenseit.co.in>`
   - `Reply-To: contact@expenseit.co.in`

**UI:** Settings → Notifications → “Send test email” button should call `POST /api/notifications/test` and toast success/error. Recipient is the email stored in preferences, not the From address.

---

## 4. Frontend screens & API wiring

### 4.1 Checkout / billing (“Billed by”)

1. On checkout (or billing details) load: `GET /api/billing/company`.
2. Render seller block from response; if `email` blank → `CONTACT_EMAIL`.
3. Buyer email is separate (shipping / `sendInvoiceByEmail`) — never confuse with company email.

```ts
type BillingCompany = {
  companyName: string;
  location: string;
  email: string;
};
```

### 4.2 Notification preferences

| Action | Endpoint | Auth |
|--------|----------|------|
| Load | `GET /api/notifications/preferences` | JWT |
| Save | `PUT /api/notifications/preferences` | JWT |
| Test | `POST /api/notifications/test` | JWT |

Body fields (save): `email`, `phone?`, `emailEnabled`, `smsEnabled`, `dailySummaryEnabled`, `expenseAlertsEnabled`.

**Copy suggestions:**

- Helper text: “Alerts are sent from ExpenseKit (`contact@expenseit.co.in`).”
- Test button: “Send test email” → on success: “Check your inbox (and spam).”

### 4.3 Team invites

- Creating an invite does **not** send email from backend yet.
- UI should: create invite → show/copy `acceptUrl` (and optionally “we’ll email this later” only if product wants that copy — do not promise email until backend ships invite mail).

### 4.4 Invoices / manage plan

- Opt-in: checkout `sendInvoiceEmail: true` or billing details `sendInvoiceByEmail`.
- No frontend control over From header; only collect buyer email.

### 4.5 Global contact / support surfaces

| Surface | Source of truth |
|---------|-----------------|
| Footer “Contact” | `CONTACT_EMAIL` |
| Support mailto | `CONTACT_EMAIL` |
| Checkout billed-by email | API first, then `CONTACT_EMAIL` |

Use one constant/`NEXT_PUBLIC_CONTACT_EMAIL` — avoid hard-coding in multiple components.

---

## 5. Acceptance criteria (frontend)

- [x] Public contact string everywhere is `contact@expenseit.co.in` (or env override).
- [x] Checkout “Billed by” uses `GET /api/billing/company` and shows `email` (or fallback).
- [x] Notification settings can save email + call test endpoint.
- [x] Invite flow does not claim “email sent” unless/until backend sends invite mail.
- [x] No UI attempts to configure SMTP or From (not possible / not needed).

---

## 6. Out of scope for web

- SMTP credentials, templates, SPF/DKIM
- Setting `From` / `Reply-To` headers
- Auth password-reset emails (not implemented on backend)

---

## 7. Quick API reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/billing/company` | Public | Seller name, location, contact email |
| GET | `/api/notifications/preferences` | JWT | Load alert prefs |
| PUT | `/api/notifications/preferences` | JWT | Save alert prefs |
| POST | `/api/notifications/test` | JWT | Trigger test From-header email |
| POST | `/api/organizations/{id}/team/invites` | JWT | Create invite (link only today) |
