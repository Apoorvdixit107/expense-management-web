# ExpenseKit Web — Security Notes

Production base for this audit: `feature/spend-management-phase-1`.

Client gates (AuthGuard, SubscriberGuard, FinanceRoleGuard, free trial) are **UX only**. The API must enforce authentication, authorization, subscription/trial, and object-level access on every sensitive endpoint.

## Fixed in this cycle (merged PRs)

| ID | Severity | Fix |
|----|----------|-----|
| SEC-01 | High | Open redirect via `next` — `safeInternalPath` |
| SEC-02 | Medium | Logout / 401 clears org + subscription; redirect to login |
| SEC-03 | High | Trial keyed per user + permanent ended flag (client) |
| SEC-04 | Medium | Invite token kept out of login URL (`sessionStorage`) |
| SEC-05 | Medium | PDF export handles 401 like main API client |
| SEC-06 | Medium | Mock Razorpay verify blocked in production builds |
| SEC-07 | Medium | Receipt magic-byte checks + sanitized filenames |
| SEC-08 | Medium | Expense edit rejects other-entity spends |

## Residual / backend follow-ups

| ID | Severity | Issue | Owner |
|----|----------|-------|--------|
| SEC-B1 | High | Bearer JWT in `localStorage` — any XSS = account takeover. Prefer httpOnly Secure cookies + CSRF, or short-lived access + refresh. | Backend + web |
| SEC-B2 | High | Premium/trial must be enforced on **every** premium API (scan-bill, assistant, reports, team, approvals). Client trial can still be manipulated. | Backend |
| SEC-B3 | High | No Next.js middleware session gate — `(app)` is client-only AuthGuard. | Web + Backend |
| SEC-B4 | Medium | Expense get/update/delete by id — enforce membership/org on API (client org check is defense in depth only). | Backend |
| SEC-B5 | Medium | Reject `mock` payment verify outside non-prod environments. | Backend |
| SEC-B6 | Low | Invite accept via query `token=` — prefer POST body + one-time use. | Backend |

## Cleared (searched)

- No `dangerouslySetInnerHTML` with user content
- No `eval` / `innerHTML` sinks
- No classic cookie CSRF (Bearer auth)
- API error toasts do not show raw 5xx / backend dumps
