# Design workflow — Visual screens first, then code

## Process

```
Design preview screens  →  You approve  →  I implement in Next.js
```

| Step | Who | Output |
|------|-----|--------|
| 1. Preview | Me | All screens at `/design-preview` |
| 2. Review | You | Feedback or **approval** |
| 3. Build | Me | Code matching approved screens + product flow |

**Rule:** No changes to live routes until you approve the preview screens.

---

## Where to review

**http://localhost:3000/design-preview**

### Current design (v3)

- **Theme:** Crimson orange + white
- **UX:** Guest lands on Expenses (no sign-up), 7-day trial, optional account, subscribe to continue
- **References:** [Money Lover](https://moneylover.me/), [Fast Budget](https://fastbudget.app/), [Spendee](https://www.spendee.com/)

### Screens (10)

**Guest (trial)**
1. Expenses (home — entry point)
2. Notifications — add email/mobile
3. Notifications — activity feed

**Auth & subscribe**
4. Subscribe (trial ended)
5. Register (optional during trial)
6. Login

**Subscriber**
7. Dashboard
8. Expenses (synced)
9. Reports
10. Notifications

Product rules: [PRODUCT-FLOW.md](./PRODUCT-FLOW.md)

---

## Approval

Reply with:

- **Feedback** — e.g. “brighter orange”, “simpler trial banner”
- **“Design approved — implement”** — I match production to the preview

---

## Figma (optional)

Mirror in [ExpenseKit on Figma](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit) if you want. **Browser preview is the source of truth.**
