import Link from "next/link";
import type { Metadata } from "next";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { formatPostDate, getAllPosts, getAllTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | ExpenseKit",
  description:
    "Practical guides on spend management, expense policies, and GST for Indian SMBs.",
};

type BlogIndexProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();
  const tags = getAllTags();
  const posts = tag ? allPosts.filter((post) => post.tags.includes(tag)) : allPosts;

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <MarketingHeader active="blog" />

      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand sm:text-sm sm:tracking-widest">
            ExpenseKit Blog
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Spend control, explained.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#6b6b6b]">
            Practical guides on policies, approvals, and GST for Indian SMBs — written to help you
            close books with confidence.
          </p>
        </section>

        <section className="border-t border-[#ebebeb] bg-[#fafafa] py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {allPosts.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <TagChip href="/blog" label="All" active={!tag} />
                  {tags.map((t) => (
                    <TagChip
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      label={t}
                      active={tag === t}
                    />
                  ))}
                </div>

                {posts.length === 0 ? (
                  <p className="mt-10 text-[#6b6b6b]">No posts in this tag yet.</p>
                ) : (
                  <ul className="mt-10 divide-y divide-[#ebebeb]">
                    {posts.map((post) => (
                      <li key={post.slug} className="py-8 first:pt-0">
                        <Link href={`/blog/${post.slug}`} className="group block">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#9b9b9b]">
                            {post.tags[0] ? (
                              <span className="rounded-md bg-brand-light px-2 py-0.5 text-brand">
                                {post.tags[0]}
                              </span>
                            ) : null}
                            <span>{formatPostDate(post.publishedAt)}</span>
                            <span>·</span>
                            <span>{post.readingMinutes} min read</span>
                          </div>
                          <h2 className="mt-3 text-xl font-bold tracking-tight transition group-hover:text-brand sm:text-2xl">
                            {post.title}
                          </h2>
                          <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#6b6b6b]">
                            {post.description}
                          </p>
                          <p className="mt-4 text-sm font-semibold text-brand">Read article →</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Posts coming soon</h2>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#6b6b6b]">
                  We&apos;re writing guides on spend policies, GST, and closing books with
                  confidence. Check back shortly — or start your trial today.
                </p>
                <Link
                  href="/register"
                  className="mt-8 inline-flex rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  Start free trial
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function TagChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand text-white"
          : "border border-[#ebebeb] bg-white text-[#6b6b6b] hover:text-[#212121]"
      }`}
    >
      {label}
    </Link>
  );
}
