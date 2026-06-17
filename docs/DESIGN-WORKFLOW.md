# Design workflow — Figma first, then code

## Process

```
Figma design  →  You approve  →  I implement in Next.js/Tailwind
```

| Step | Who | Output |
|------|-----|--------|
| 1. Design | You in Figma (using our spec) | Frames + components |
| 2. Review | You | Feedback or **approval** |
| 3. Build | Me | Code matching approved design |

**Rule:** No UI visual changes until you explicitly approve the design.

---

## Figma file

**ExpenseKit:** [Figma design file](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit?node-id=0-1)

| Doc | Purpose |
|-----|---------|
| [FIGMA-DESIGN-SPEC.md](./FIGMA-DESIGN-SPEC.md) | Colors, type, components, all 7 screens |
| [ROADMAP.md](./ROADMAP.md) | Full project phases through deploy & monetize |

### Suggested Figma pages

```
📁 ExpenseKit
├── 🎨 Design System
├── 📱 Mobile (375px)
└── 🖥 Desktop (1440px)
```

Screens: Landing, Login, Register, Dashboard, Expenses, Reports, Notifications.

---

## Approval

Reply with:

- **"Design approved — implement"**

Until then, work stays in Figma only (no UI code changes).

---

## What I can do

| Action | How |
|--------|-----|
| Design spec | `FIGMA-DESIGN-SPEC.md` (done) |
| Reference mockups | Ask in chat if you want visual references |
| Implement from Figma | After your approval |
| Edit Figma directly | Not available — you build in Figma |
