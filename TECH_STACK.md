# ExpenseKit — Tech Stack (Frontend)

This repository is the **ExpenseKit web UI**. Full system architecture (backend microservices, Kafka, MySQL, deployment, feature map) lives in the backend repository:

**`ExpenseManagementSystem/TECH_STACK.md`** (same GitHub org: `Apoorvdixit107/ExpenseManagementSystem`)

---

## This repo at a glance

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | App Router, pages, build |
| **React 19** | Components |
| **TypeScript** | Types in `src/lib/types.ts` |
| **Tailwind CSS 4** | Styling |
| **Recharts** | Dashboard charts |

---

## Key paths

| Path | Purpose |
|------|---------|
| `src/app/(app)/` | Logged-in app pages |
| `src/app/(auth)/` | Login, register |
| `src/lib/api.ts` | All API calls to gateway |
| `src/lib/auth.ts` | JWT session in `localStorage` |
| `src/components/AppShell.tsx` | Sidebar navigation |

---

## Environment

Copy `.env.local.example` → `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

Production: `NEXT_PUBLIC_API_URL` points to your API gateway (tunnel or server URL).

---

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (Netlify)
```

Backend must be running — see `ExpenseManagementSystem/TECH_STACK.md` for Docker setup.

**Feature roadmap & costing:** `ExpenseManagementSystem/FEATURE_ROADMAP_AND_COSTING.md`
