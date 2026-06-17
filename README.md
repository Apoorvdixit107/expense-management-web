# ExpenseKit Web

Next.js frontend for the [Expense Management System](https://github.com/Apoorvdixit107/ExpenseManagementSystem) backend.

## Prerequisites

- Node.js 20+
- Backend running with API Gateway on port **8081**

```bash
cd ../ExpenseManagementSystem
docker compose up --build
```

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8081` | API Gateway base URL |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing + pricing |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | 7-day summary + notifications |
| `/expenses` | Add / list / delete expenses |
| `/reports` | Category and monthly reports |
| `/notifications` | Activity alerts |

## Deploy (Netlify)

**Site name:** `expensekit` → `https://expensekit.netlify.app`

CI/CD runs via GitHub Actions on every push to `main` (see `.github/workflows/netlify-deploy.yml`).

### One-time setup

1. Create a Netlify site from this repo and set the project name to **expensekit**.
2. In Netlify: **Site settings → Build & deploy → Continuous deployment → Stop builds** (GitHub Actions handles deploys).
3. Add GitHub **repository secrets**:
   - `NETLIFY_AUTH_TOKEN` — [Netlify personal access token](https://app.netlify.com/user/applications)
   - `NETLIFY_SITE_ID` — Site settings → General → Site ID
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google OAuth client ID
4. Add GitHub **repository variables**:
   - `NEXT_PUBLIC_API_URL` — your API Gateway URL (e.g. `https://api.yourdomain.com`)
   - `NEXT_PUBLIC_SITE_URL` (optional) — `https://expensekit.netlify.app` or custom domain

5. In Google Cloud Console, add authorized JavaScript origins:
   - `https://expensekit.netlify.app`
   - your custom domain if used

### Backend

Point `NEXT_PUBLIC_API_URL` at your API Gateway.  
See [FREE-DEPLOYMENT.md](https://github.com/Apoorvdixit107/ExpenseManagementSystem/blob/main/docs/FREE-DEPLOYMENT.md) for a **₹0 prototype** setup.
