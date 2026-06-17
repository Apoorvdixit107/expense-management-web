# ExpenseKit — Project Roadmap

Where you are now and what comes next.

---

## Current status (June 2025)

| Area | Status |
|------|--------|
| Backend microservices | ✅ Running locally (Docker) |
| API Gateway | ✅ Port 8080 |
| Frontend MVP | ✅ All core screens |
| Google sign-in | ✅ Working locally |
| Figma design | 🔲 In progress — [Figma file](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit) |
| UI polish (Figma → code) | ⏳ Waiting for design approval |
| Live deploy (free tier) | 🔲 Not started |
| Payments (Razorpay) | ⏳ Later |

---

## Phase 1 — Design (now) · ₹0

**Goal:** Professional UI in Figma before coding visuals.

1. Open [ExpenseKit Figma](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit)
2. Follow **[FIGMA-DESIGN-SPEC.md](./FIGMA-DESIGN-SPEC.md)** — design system + 7 screens
3. Share link / screenshots for review
4. Reply **"Design approved — implement"**

**You:** Build frames in Figma (or ask me for screen mockups).  
**Me:** Implement approved design in Next.js + Tailwind.

---

## Phase 2 — Implement design · ₹0

**Goal:** Match Figma pixel-close in code.

- Design tokens → `globals.css` + Tailwind
- Rebuild components (Button, Input, Card, Shell)
- All 7 screens mobile + desktop
- Keep Google login + API wiring unchanged

---

## Phase 3 — Push & document · ₹0

**Goal:** Clean repos on GitHub.

- Commit Google auth (backend + frontend)
- Update READMEs with Google OAuth setup
- Tag release `v0.2.0-prototype`

---

## Phase 4 — Free live deploy · ₹0

**Goal:** Share URL with beta users.

| Piece | Where |
|-------|--------|
| Frontend | [Vercel](https://vercel.com) — import `expense-management-web` |
| Backend | [Oracle Cloud Free VM](https://www.oracle.com/cloud/free/) |
| Guide | `ExpenseManagementSystem/docs/FREE-DEPLOYMENT.md` |

Env vars for production:
- `NEXT_PUBLIC_API_URL` → VM IP or HTTPS tunnel
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → same client + add Vercel URL to Google origins

---

## Phase 5 — Beta & feedback · ₹0

- Share with 10–20 users
- Fix bugs, improve empty states
- Add Privacy Policy + Terms (required before payments)

---

## Phase 6 — Monetize · when ready

- Razorpay subscriptions (Free vs Pro)
- Plan limits in backend
- PDF export (Pro feature)

See `ExpenseManagementSystem/docs/MVP-SPEC.md` for screen-level detail.

---

## What to do this week

| Day | Task |
|-----|------|
| 1–2 | Build Figma design system + auth screens |
| 3–4 | Dashboard, Expenses, Reports in Figma |
| 5 | Review → approve → I implement |
| 6–7 | Deploy free tier (optional) |

---

## Repos

- Backend: https://github.com/Apoorvdixit107/ExpenseManagementSystem
- Frontend: https://github.com/Apoorvdixit107/expense-management-web
