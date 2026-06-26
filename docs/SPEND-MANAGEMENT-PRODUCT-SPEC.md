# ExpenseKit — Spend Management Product Spec (India)

**Version:** 1.0  
**Date:** June 2025  
**Positioning:** India's spend management platform for growing businesses  
**Reference:** [Ramp](https://ramp.com/) (workflow & UX patterns, not feature parity)

---

## 1. Vision

ExpenseKit is pivoting from **expense tracking** (personal ledger) to **spend management** (company control).

| Expense tracking (old) | Spend management (new) |
|------------------------|-------------------------|
| Record what you spent | **Control** what can be spent |
| Charts after the fact | **Policy + approval** before books |
| Solo / guest-first | **Company + team** first |
| “Where did my money go?” | “Is this spend allowed, approved, and GST-ready?” |

**North star:** Every rupee of company spend is **submitted → checked against policy → approved → categorized → visible in reports & GST** — without a CA chasing receipts at month-end.

**Ambition:** Build India's first spend management software that reshapes how SMBs run finance — simpler than Tally for daily ops, smarter than spreadsheets, India-native (GST, INR, Razorpay).

---

## 2. Positioning vs Ramp

[Ramp](https://ramp.com/) is an all-in-one **corporate card + AP + travel + procurement** platform for US enterprises.

ExpenseKit does **not** copy Ramp feature-for-feature. We adopt Ramp's **product philosophy**:

- Policy at the point of spend  
- Finance visibility in real time  
- AI reduces manual coding  
- One system replaces scattered tools  

**Our India wedge:**

| Ramp (US) | ExpenseKit (India) |
|-----------|-------------------|
| Corporate Visa cards | Spend via **cash, UPI, bank, card** (card program later) |
| NetSuite / QuickBooks | **Tally, Zoho Books, CSV for CA** |
| US tax | **GST, ITC, GSTR-ready summaries** |
| Enterprise sales | **SMB & mid-market** (shops, clinics, agencies, startups) |
| USD pricing | **INR, Razorpay, affordable Pro** |

**Scope for v1–v2:** **Spending only** — no reimbursement module, no travel booking, no procurement intake. Employees and owners **record and control outbound spend**; income can stay for P&L but is not the hero flow.

---

## 3. Ideal customer profile (ICP)

**Primary:** Owner or finance lead at an Indian SMB  

| Attribute | Detail |
|-----------|--------|
| Size | 1–50 employees |
| Entities | Shop, clinic, agency, D2C brand, services firm |
| Pain | WhatsApp receipts, Excel, missed GST, no approval trail |
| Users | Owner, accountant/bookkeeper, staff who spend |
| Tech | Comfortable with UPI & WhatsApp; may use Tally/Zoho |
| Goal | Close books faster, fewer policy violations, audit-ready spend |

**Secondary (Phase 3+):** Multi-branch businesses, CAs managing multiple clients.

**Not ICP (for now):** Enterprise with dedicated ERP team, US-only ops, personal finance users.

---

## 4. Product language & navigation

Use **accounting & spend** terms everywhere. Retire consumer words (“expenses app”, “money lover” style).

### 4.1 App navigation (subscriber)

| Old tab | New tab | Purpose |
|---------|---------|---------|
| Dashboard | **Overview** | Spend summary, pending approvals, policy alerts |
| Expenses | **Spend** | Record, list, filter company spend |
| Upload Bill | **Capture receipt** | AI scan → spend draft (inside Spend flow) |
| Budgets | **Budgets & limits** | Category/period caps vs actual |
| Profit | **Insights** | Profit, margin, trends |
| Tax / GST | **Tax & compliance** | GST summary, rates, export |
| Reports | **Reports & export** | Ledger-style reports, PDF/CSV |
| Cash & Bank | **Ledger** | Cash + bank balance movements |
| Organizations | **Entities** | Companies / branches |
| Notifications | **Alerts** | Policy, approval, summary alerts |
| — (new) | **Approvals** | Pending / approved / rejected queue |
| — (new) | **Policies** | Spend rules (admin) |
| — (new) | **Team** | Users & roles |
| Assistant | **Ask finance** | AI help on spend & policies |
| Manage plan | **Plan & billing** | Subscription |
| Profile | **Account** | Profile & preferences |

**Guest / trial (Phase 1):** Deprecated — replace with **14-day company trial** (sign up with company name + email, no card optional).

### 4.2 Taglines by surface

**Landing — hero**  
> **Control company spend before it hits your books.**  
> India's spend management platform — policies, approvals, and GST-ready reports for growing businesses.

**Landing — sub-hero**  
> Replace receipt chaos with one system your accountant will actually use.

**Landing — social proof strip**  
> Built for Indian SMBs · GST-native · Close books with confidence

**Overview page**  
> Your spend command center

**Spend page**  
> Record and review every outbound payment

**Approvals page**  
> Nothing posts until finance says yes

**Policies page**  
> Set rules once — enforce on every spend

**Budgets & limits page**  
> Stay within plan — see variance in real time

**Tax & compliance page**  
> GST and ITC, ready for filing season

**Insights page**  
> Income, spend, and margin — one view

**Reports & export page**  
> Audit-ready reports for your CA

**Ledger page**  
> Cash and bank — reconciled movements

**Sign up**  
> Start your company workspace — 14 days free

**Subscribe**  
> Unlock full spend control for your team

**Empty state (Spend)**  
> No spend recorded yet. Add your first entry or capture a receipt.

**Empty state (Approvals)**  
> All clear — no spend waiting for approval.

---

## 5. Design direction (Ramp-type look)

Design in **Figma first** ([workflow](./DESIGN-WORKFLOW.md)). Do not ship visual pivots in code until approved.

### 5.1 Visual principles (Ramp-inspired, ExpenseKit brand)

| Principle | Implementation |
|-----------|----------------|
| **Finance-grade clarity** | Dense data in tables; KPI cards above fold; no playful illustrations on app screens |
| **Calm hierarchy** | White / soft gray surfaces; dark sidebar optional; **brand orange `#FF6C37`** for primary actions & alerts only |
| **Scannable numbers** | INR formatted; right-align amounts; red for overspend, green for under budget |
| **Handy for ICP** | Large tap targets on mobile; max 2 clicks to **add spend**; sticky “Record spend” on mobile |
| **Trust** | Subtle borders, no clutter; show GSTIN, entity name, period in headers |

### 5.2 Layout patterns (from Ramp)

- **Left sidebar:** Overview, Spend, Approvals, Budgets, Tax, Reports, Ledger, Settings group  
- **Top bar:** Entity switcher, period filter, primary CTA (“Record spend”)  
- **Overview:** 4 KPI cards → 2 charts → pending approvals table  
- **Spend list:** Filter chips (date, category, status, payment mode) + table (not cards-only)  
- **Forms:** Single column, receipt upload prominent, live GST split preview  

### 5.3 Figma deliverables (Phase 1)

| Page | Frames (1440 + 375) |
|------|---------------------|
| Marketing | Landing, Pricing, Sign up, Login |
| App shell | Sidebar + top bar component |
| Overview | KPI + charts + pending table |
| Spend | List, Record spend, Edit, Receipt capture |
| Approvals | Inbox, Detail drawer |
| Policies | List, Create rule |
| Budgets & limits | List, Create, Performance |
| Tax & compliance | Summary, Export |
| Team | Invite, Roles |
| Alerts | Inbox |

Reply **“Design approved — implement”** after Figma review.

---

## 6. What exists today (reuse map)

| Built | Reuse in spend management |
|-------|---------------------------|
| Organizations | → **Entities** |
| Expenses IN/OUT | → **Spend transactions** (OUT-first UX) |
| Categories | → **Spend categories** (chart of accounts lite) |
| Budgets API + UI | → **Budgets & limits** |
| GST / Tax API + UI | → **Tax & compliance** |
| Profitability API + UI | → **Insights** |
| Reports | → **Reports & export** |
| Cash & Bank | → **Ledger** |
| Bill upload / AI | → **Capture receipt** |
| Notifications email | → **Alerts** |
| Razorpay billing | → **Plan & billing** |
| Redis report cache | Keep; fix/monitor |

| Gap (must build) | Phase |
|------------------|-------|
| Roles & permissions | 1 |
| Spend policies | 1 |
| Approval workflow | 1 |
| Audit trail | 1 |
| Company onboarding (GSTIN) | 1 |
| Policy breach UI | 1 |
| Multi-step approvals | 2 |
| CA export packs | 2 |
| Tally/Zoho export | 3 |

---

## 7. Development phases

Each phase ends with a **test gate**. Do not start the next phase until gate passes.

---

### Phase 1 — Core spend management (MVP)

**Goal:** A Indian SMB can run daily **spend control** in one app: record spend, enforce basic rules, approve, see overview, GST snapshot.

**Duration estimate:** 6–8 weeks  
**Exit gate:** 5 pilot companies complete 2 week daily use without blocker bugs.

#### 1.1 Features to build

**Company & access**
- [ ] Company signup (name, GSTIN optional, industry, FY start month)
- [ ] Entity model (rename org UX → Entities)
- [ ] Roles: **Owner**, **Finance**, **Member** (Member = submit only; Finance = approve + reports; Owner = all)
- [ ] Invite team by email
- [ ] Remove guest-first trial → **14-day company trial** on signup

**Spend (core)**
- [ ] **Record spend** form: amount (tax-inclusive), category, payment mode, date, vendor/description, receipt optional
- [ ] GST category on spend (reuse GST module)
- [ ] Spend list with filters: date, category, status, entity
- [ ] Spend statuses: `DRAFT` → `PENDING_APPROVAL` → `APPROVED` → `POSTED` (rejected path)
- [ ] Edit / void spend (audit log entry)
- [ ] **Capture receipt** → AI prefill → user confirms → submit

**Policies (basic)**
- [ ] Policy rules: max amount per transaction, allowed categories, receipt required above ₹X
- [ ] Evaluate on submit → flag or block with message
- [ ] Policies page (Finance/Owner only)

**Approvals**
- [ ] Single-level approval (Finance or Owner)
- [ ] Approvals inbox: approve / reject with comment
- [ ] Email alert on submit & decision

**Overview**
- [ ] KPIs: total spend (period), pending approvals count, policy flags, budget utilization %
- [ ] Chart: spend by category (period)
- [ ] Table: pending approvals (top 5)

**Ledger (lite)**
- [ ] Keep cash & bank view; label as **Ledger**
- [ ] Only **approved/posted** spend affects balance display (configurable in Phase 2)

**Tax & compliance (lite)**
- [ ] GST summary for period (reuse Tax page)
- [ ] CSV export

**Alerts**
- [ ] In-app + email for approval, policy breach, daily spend summary (optional)

**Marketing site**
- [ ] New landing copy (taglines §4.2)
- [ ] Ramp-style layout: hero, 3 pillars, pricing, CTA
- [ ] Rename product references: “Spend management” not “Expense tracker”

#### 1.2 Backend services (new / extend)

| Service | Work |
|---------|------|
| auth-service | Roles, invites, company profile (GSTIN) |
| expense-service | Spend status, policy evaluation, approvals, audit log |
| notification-service | Approval & policy templates |
| report-service | Overview aggregates (reuse reports) |

#### 1.3 Phase 1 — test plan (deep)

| Area | Tests |
|------|-------|
| Roles | Member cannot approve; Finance cannot delete entity |
| Policy | Block ₹50k spend when limit ₹10k; receipt required rule |
| Approval | Submit → email → approve → appears in reports |
| GST | 18% inclusive split correct on 10 samples |
| Regression | Login, entity switch, spend CRUD, mobile layout |
| Pilot | 5 companies, 3 users each, 14-day script |

**Gate criteria:** 0 P0 bugs, &lt;3 P1 open, pilot NPS ≥ 7.

---

### Phase 2 — Control & intelligence

**Goal:** Finance teams run month-end with less manual work; stronger control and exports.

**Duration estimate:** 6–8 weeks  
**Exit gate:** 3 pilots export month-end pack and confirm usable for CA.

#### 2.1 Features

- [ ] **Multi-level approval** (Manager → Finance)
- [ ] **Budgets & limits** tied to policies (hard/soft cap)
- [ ] Budget alerts (80%, 100%, over)
- [ ] **Insights** page: profit trend, org comparison (reuse profitability)
- [ ] **Ask finance** AI: “Why is marketing over budget?” (scoped to entity data)
- [ ] Improved receipt AI: vendor, GSTIN on invoice, duplicate detection
- [ ] **Reports & export:** PDF pack, category ledger, date-wise OUT
- [ ] **Audit trail** UI (filter by user, entity, date)
- [ ] Spend **bulk import** CSV
- [ ] Department / cost center (optional tag on spend)

#### 2.2 Test gate

- Month-end export validated by 1 CA partner  
- Policy + budget combined scenarios (10 cases)  
- Load test: 10k spend rows per entity  

---

### Phase 3 — Books & compliance (India moat)

**Goal:** Become the system CAs recommend for daily spend → books bridge.

**Duration estimate:** 6 weeks  
**Exit gate:** Successful export/import test with Tally or Zoho Books for 2 pilot companies.

#### 3.1 Features

- [ ] **Tally XML / CSV** export (vouchers)
- [ ] **Zoho Books** integration (OAuth, sync approved spend)
- [ ] **GSTR-1 / 3B helper views** (summary, not filing)
- [ ] Multi-entity consolidated report
- [ ] **Ledger** reconciliation markers (matched / unmatched)
- [ ] Fiscal year close checklist
- [ ] Role: **Accountant (external)** read-only + export

#### 3.2 Test gate

- CA sign-off on export format  
- GST reconciliation spot-check vs manual Excel  

---

### Phase 4 — Spend at source

**Goal:** Move closer to Ramp — control before money leaves.

**Duration estimate:** 8+ weeks (partner-dependent)  
**Exit gate:** Pilot with 1 payment partner live.

#### 4.1 Features

- [ ] **Virtual UPI / card controls** (RazorpayX or bank partner)
- [ ] Per-vendor spend limits
- [ ] Vendor directory (GSTIN, payment terms)
- [ ] **Vendor bills (AP lite):** upload bill → match to spend → approve pay
- [ ] Scheduled payments (Phase 4b)

---

### Phase 5 — Scale & platform

**Goal:** Wider market, enterprise-ready.

- [ ] SSO (Google Workspace)
- [ ] API for integrators
- [ ] Multi-currency (export businesses)
- [ ] Advanced analytics / benchmarks
- [ ] Mobile app (PWA polish or native)
- [ ] SOC2 / security trust center

---

## 8. Phase timeline (summary)

```
Phase 1  Core spend management     ████████░░░░░░░░  Weeks 1–8   → PILOT
Phase 2  Control & intelligence    ░░░░████████░░░░  Weeks 9–16  → CA preview
Phase 3  Books & compliance       ░░░░░░░░████████  Weeks 17–22 → India moat
Phase 4  Spend at source          ░░░░░░░░░░░░████  Weeks 23+   → Partner
Phase 5  Scale                    Future
```

---

## 9. Pricing (aligned with spend management)

| Plan | Price | Includes |
|------|-------|----------|
| **Trial** | ₹0 / 14 days | 1 entity, 3 users, core spend + approvals |
| **Starter** | ₹999/mo | 1 entity, 5 users, policies, GST export |
| **Growth** | ₹2,499/mo | 3 entities, 15 users, budgets, insights, CA export |
| **Custom** | Contact | Multi-entity, accountant seats, integrations |

*(Adjust after pilot feedback.)*

---

## 10. Success metrics

| Phase | Metric |
|-------|--------|
| 1 | Weekly active entities, spend entries per entity, approval turnaround time |
| 2 | Budget breach rate, export downloads, AI receipt acceptance rate |
| 3 | CA referrals, Tally/Zoho connected accounts |
| 4 | % spend via controlled instruments |
| 5 | MRR, churn, NPS |

---

## 11. Immediate next steps

1. **Review this doc** — confirm Phase 1 scope (especially: no reimbursement, spend-only).  
2. **Figma** — build Phase 1 frames per §5.3 using taglines §4.2.  
3. **Reply** `Design approved — implement` to start Phase 1 code.  
4. **Backend** — create `SPEND-MANAGEMENT-PHASE1.md` in backend repo mirroring API tasks (optional follow-up).  
5. **Pilot list** — name 5 ICP companies for Phase 1 gate.

---

## 12. One-line pitch (use everywhere)

> **ExpenseKit — India's spend management platform. Control every rupee before it hits your books.**

---

*References: [Ramp](https://ramp.com/) · [Ramp Expense Management](https://ramp.com/expense-management) · [Ramp Intelligence](https://ramp.com/intelligence)*
