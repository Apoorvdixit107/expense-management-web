# ExpenseKit Web

Next.js frontend for the [Expense Management System](https://github.com/Apoorvdixit107/ExpenseManagementSystem) backend.

## Prerequisites

- Node.js 20+
- Backend running with API Gateway on port **8080**

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
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | API Gateway base URL |

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

## Deploy

Deploy to Vercel (free) and point `NEXT_PUBLIC_API_URL` at your API Gateway.  
See [FREE-DEPLOYMENT.md](https://github.com/Apoorvdixit107/ExpenseManagementSystem/blob/main/docs/FREE-DEPLOYMENT.md) for a **₹0 prototype** setup (Vercel + Oracle Cloud Free).
