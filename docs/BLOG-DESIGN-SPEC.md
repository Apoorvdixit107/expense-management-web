# ExpenseKit Blog — Design & week plan

**Status:** Implemented (live `/blog`)  
**Review:** http://localhost:3000/blog  
**Approved:** Design approved — implement

---

## Decisions (locked for v1)

| Topic | Choice |
|-------|--------|
| Content system | **MDX in-repo** (`content/blog/*.mdx`) — no CMS yet |
| Routes | `/blog` (index), `/blog/[slug]` (post) — public, outside AppShell |
| Chrome | Same marketing header/footer as landing (+ Blog nav link) |
| CTA on posts | Primary: Start free trial → `/register` · Secondary: Pricing → `/pricing` |
| Launch posts | 3 articles (drafts below) |

---

## Screens to approve

| ID | Screen | States |
|----|--------|--------|
| `blog-index` | Blog list | Default (3 posts) |
| `blog-post` | Article detail | Default + end CTA |
| `blog-empty` | Empty index | No posts yet |

**Desktop:** ~1440 content width, max-width 6xl (index) / 3xl (post) — matches landing.  
**Mobile:** Same layout stacks; header collapses like landing (nav hidden, CTAs remain).

### Visual rules (match live landing)

- Background white / soft paper `#FAFAFA` on list band  
- Brand orange `#FF6C37` (live app token, not older teal/crimson docs)  
- Ink `#212121`, muted `#6B6B6B`, border `#EBEBEB`  
- **No card grid for posts** — list with divider + tag + title + excerpt (cleaner, readable)  
- Post body: calm typography, H2s, author row, CTA band at end  
- Do **not** put Blog inside authenticated AppShell  

### Figma (optional)

If you prefer Figma over `/design-preview`, add frames to  
[ExpenseKit on Figma](https://www.figma.com/design/GAtpyWWdxskVkPc7u7ol0R/ExpenseKit?node-id=0-1):

1. `Blog / Index / Desktop 1440`  
2. `Blog / Post / Desktop 1440`  
3. `Blog / Empty / Desktop 1440`  
4. Same three at `375` mobile (can follow after desktop approve)

Use colors/type above. Paste copy from the mockups / drafts.

---

## Launch posts (you review copy)

### 1. What is spend management?
- **Slug:** `what-is-spend-management`
- **Tag:** Guides  
- **Angle:** Tracking vs control; why Indian SMBs need policy + approvals + GST  
- **CTA:** Trial  

### 2. GST on company expenses (India checklist)
- **Slug:** `gst-company-expenses-india-checklist`
- **Tag:** GST & tax  
- **Angle:** Practical checklist (not legal advice); what to capture; inclusive vs exclusive  
- **CTA:** Trial · disclaimer: not tax advice  

### 3. Simple expense policy for startups
- **Slug:** `simple-expense-policy-startups`
- **Tag:** Policies  
- **Angle:** Limits, receipts, one-level approval — enforceable this week  
- **CTA:** Trial  

Full draft bodies live in `content/blog/drafts/` for your edit pass.

---

## After approval — implementation checklist (me)

1. `(marketing)` layout shared with landing nav (Blog link)  
2. MDX pipeline + `@tailwindcss/typography`  
3. `/blog` + `/blog/[slug]` + metadata / OG  
4. Publish 3 posts from approved drafts  
5. Footer + landing nav links; sitemap entry  
6. Empty state if zero published posts  

---

## This week — who does what

See **Your checklist** at the bottom of the agent reply / section below.

### Your checklist

- [ ] Open `/design-preview` and review Blog Index, Post, Empty  
- [ ] Reply with feedback **or** `Design approved — implement blog`  
- [ ] Skim the 3 drafts in `content/blog/drafts/` — edit facts/tone  
- [ ] Confirm author display name (default: **ExpenseKit Team**)  
- [ ] Confirm CTA stays **Start free trial** (or change)  
- [ ] Optional: paste frames into Figma if you want a Figma source of truth  

### My checklist (after your approval)

- [ ] Implement live `/blog` matching approved design  
- [ ] Wire MDX + SEO meta  
- [ ] Publish approved posts  
- [ ] Link from landing nav + footer  
