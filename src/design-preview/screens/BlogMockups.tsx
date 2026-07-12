import type { ReactNode } from "react";

/** Match live landing marketing colors (not app design-preview crimson tokens). */
const m = {
  brand: "#FF6C37",
  brandHover: "#E85A2E",
  ink: "#212121",
  muted: "#6B6B6B",
  faint: "#9B9B9B",
  border: "#EBEBEB",
  paper: "#FAFAFA",
  white: "#FFFFFF",
} as const;

function MockBtn({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <span
        className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium"
        style={{ borderColor: "#D1D1D1", color: m.ink }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className="inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white"
      style={{ background: m.brand }}
    >
      {children}
    </span>
  );
}

function MockLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ background: m.brand }}
      >
        E
      </span>
      <span className="text-lg font-bold" style={{ color: m.ink }}>
        ExpenseKit
      </span>
    </div>
  );
}

const posts = [
  {
    title: "What is spend management? (And why expense tracking isn’t enough)",
    excerpt:
      "Expense tracking looks backward. Spend management puts policy, approvals, and GST in front of every rupee — before it hits your books.",
    date: "12 Jul 2026",
    tag: "Guides",
    read: "6 min",
  },
  {
    title: "GST on company expenses in India: a practical checklist for SMBs",
    excerpt:
      "What to capture on every receipt, how inclusive vs exclusive tax works, and what your CA will thank you for at month-end.",
    date: "12 Jul 2026",
    tag: "GST & tax",
    read: "8 min",
  },
  {
    title: "A simple expense policy your startup can enforce this week",
    excerpt:
      "Limits, receipt rules, and one-level approvals — without a 20-page handbook nobody reads.",
    date: "12 Jul 2026",
    tag: "Policies",
    read: "5 min",
  },
];

function MarketingHeader({ active = "Blog" }: { active?: string }) {
  const links = ["Features", "Pricing", "Blog"];
  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm" style={{ borderColor: m.border }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <MockLogo />
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" style={{ color: m.muted }}>
          {links.map((label) => (
            <span
              key={label}
              className={label === active ? "font-semibold" : undefined}
              style={{ color: label === active ? m.ink : undefined }}
            >
              {label}
            </span>
          ))}
          <span>Sign in</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex">
            <MockBtn variant="secondary">Contact sales</MockBtn>
          </span>
          <MockBtn>Start free trial</MockBtn>
        </div>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t py-10" style={{ borderColor: m.border }}>
      <div
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm sm:flex-row"
        style={{ color: m.faint }}
      >
        <p>© 2026 ExpenseKit</p>
        <div className="flex gap-6">
          <span>Sign in</span>
          <span>Register</span>
          <span>Blog</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>
  );
}

export function BlogIndexMockup() {
  return (
    <div className="bg-white" style={{ color: m.ink }}>
      <MarketingHeader />

      <main>
        <section className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: m.brand }}>
            ExpenseKit Blog
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Spend control, explained.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: m.muted }}>
            Practical guides on policies, approvals, and GST for Indian SMBs — written to help you close
            books with confidence.
          </p>
        </section>

        <section className="border-t py-12" style={{ borderColor: m.border, background: m.paper }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap gap-2">
              {["All", "Guides", "GST & tax", "Policies"].map((tag, i) => (
                <span
                  key={tag}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={
                    i === 0
                      ? { background: m.brand, color: m.white }
                      : { background: m.white, color: m.muted, border: `1px solid ${m.border}` }
                  }
                >
                  {tag}
                </span>
              ))}
            </div>

            <ul className="mt-10 space-y-0 divide-y" style={{ borderColor: m.border }}>
              {posts.map((post) => (
                <li key={post.title} className="py-8 first:pt-0">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium" style={{ color: m.faint }}>
                    <span
                      className="rounded-md px-2 py-0.5"
                      style={{ background: "#FFF0EB", color: m.brand }}
                    >
                      {post.tag}
                    </span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.read} read</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{post.title}</h2>
                  <p className="mt-2 max-w-3xl text-base leading-relaxed" style={{ color: m.muted }}>
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-sm font-semibold" style={{ color: m.brand }}>
                    Read article →
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

export function BlogPostMockup() {
  return (
    <div className="bg-white" style={{ color: m.ink }}>
      <MarketingHeader />

      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <p className="text-sm font-medium" style={{ color: m.brand }}>
          ← All posts
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium" style={{ color: m.faint }}>
          <span className="rounded-md px-2 py-0.5" style={{ background: "#FFF0EB", color: m.brand }}>
            Guides
          </span>
          <span>12 Jul 2026</span>
          <span>·</span>
          <span>6 min read</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          What is spend management? (And why expense tracking isn’t enough)
        </h1>
        <p className="mt-4 text-lg leading-relaxed" style={{ color: m.muted }}>
          Expense tracking looks backward. Spend management puts policy, approvals, and GST in front of
          every rupee — before it hits your books.
        </p>

        <div className="mt-8 flex items-center gap-3 border-y py-4" style={{ borderColor: m.border }}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: m.brand }}
          >
            EK
          </div>
          <div>
            <p className="text-sm font-semibold">ExpenseKit Team</p>
            <p className="text-xs" style={{ color: m.faint }}>
              Product & finance education
            </p>
          </div>
        </div>

        <article className="mt-10 space-y-5 text-base leading-relaxed" style={{ color: m.muted }}>
          <p>
            Most growing companies start with a spreadsheet or a personal expense app. That works until
            you have more than a handful of people spending company money — and a CA asking for GST-ready
            exports every month.
          </p>
          <h2 className="pt-2 text-xl font-bold" style={{ color: m.ink }}>
            Tracking vs controlling
          </h2>
          <p>
            Tracking answers “what did we spend?” Control answers “should this spend have happened?” Policy
            limits, receipt rules, and approvals turn chaos into a process finance can trust.
          </p>
          <h2 className="pt-2 text-xl font-bold" style={{ color: m.ink }}>
            What good look like for Indian SMBs
          </h2>
          <p>
            One workspace for submissions, one approval queue, GST split on the way in — not a scramble at
            quarter-end. That’s spend management.
          </p>
        </article>

        <aside
          className="mt-14 rounded-2xl border p-8 text-center"
          style={{ borderColor: m.border, background: m.paper }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: m.brand }}>
            Try ExpenseKit
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight">
            Put policy before the spend hits your books
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: m.muted }}>
            14-day company trial. Policies, approvals, and GST-ready reports for Indian SMBs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <MockBtn>Start free trial</MockBtn>
            <MockBtn variant="secondary">View pricing</MockBtn>
          </div>
        </aside>
      </main>

      <MarketingFooter />
    </div>
  );
}

export function BlogEmptyMockup() {
  return (
    <div className="bg-white" style={{ color: m.ink }}>
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: m.brand }}>
          ExpenseKit Blog
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Posts coming soon</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed" style={{ color: m.muted }}>
          We’re writing guides on spend policies, GST, and closing books with confidence. Check back
          shortly — or start your trial today.
        </p>
        <div className="mt-8 flex justify-center">
          <MockBtn>Start free trial</MockBtn>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
