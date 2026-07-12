# Agent work commands

Copy-paste phrases to switch the agent into the right git / ship workflow. The agent only commits, opens PRs, or merges when you ask (or use a ship pipeline below).

---

## Branch

| You say | Agent does |
|---------|------------|
| `new branch for X from current` | Create `feat/x` (or your name) from current HEAD |
| `branch feat/foo from main` | Checkout `main`, pull if needed, create `feat/foo` |
| `switch to branch X` / `checkout X` | Switch to that branch |
| `stay on this branch` | Do not create a new branch |

---

## Commit

| You say | Agent does |
|---------|------------|
| `commit` / `commit these changes` | Stage relevant files + commit (message from diff) |
| `commit with message: …` | Commit with your message |
| `don’t commit yet` | Code only, no git commit |

---

## PR

| You say | Agent does |
|---------|------------|
| `PR` / `create a PR` | Push + `gh pr create` (summary + test plan) |
| `PR against main` | Open PR targeting `main` |
| `draft PR` | Create as draft |
| `update the PR description` | Edit existing PR body |

---

## Merge / ship

| You say | Agent does |
|---------|------------|
| `merge` / `merge the PR` | `gh pr merge` (current/open PR) |
| `ship it` | Commit (if needed) → push → PR → merge |
| `merge when green` | Wait for checks, then merge |
| `don’t merge` | Stop after PR |

---

## Full pipelines

**Default ship (most common)**

```text
new branch for X from current → implement → commit → PR → merge
```

**Design → code → ship**

```text
new branch for X from current → implement per plan → commit → PR → merge
```

**Code only, no ship yet**

```text
new branch for X from current → implement → commit (no PR)
```

**Ship what’s already done**

```text
commit → push → PR → merge
```

**Resume / switch work**

```text
switch to feat/branch-name and continue from the plan
```

```text
abort this branch work; go back to main
```

---

## Modifiers

| Phrase | Meaning |
|--------|---------|
| `from current` | Branch off HEAD (not necessarily `main`) |
| `from main` | Start clean from `main` |
| `don’t push` | Local only |
| `squash merge` / `merge commit` / `rebase merge` | Merge strategy |
| `follow the plan at …` | Use an attached/linked plan as source of truth |

---

## Examples

**Pricing page (plan-driven)**

```text
new branch feat/pricing-page from current → follow pricing_page_india plan → commit → PR → merge
```

**Small fix on current branch**

```text
fix the bug → commit → PR against main → merge when green
```

**Explore only**

```text
stay on this branch → don’t commit yet → explain options
```

---

## Related

- Design gate (preview → approve → build): [DESIGN-WORKFLOW.md](./DESIGN-WORKFLOW.md)
