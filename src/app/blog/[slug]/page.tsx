import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found | ExpenseKit" };

  return {
    title: `${post.title} | ExpenseKit Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <MarketingHeader active="blog" />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <Link href="/blog" className="text-sm font-medium text-brand hover:text-brand-hover">
          ← All posts
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium text-[#9b9b9b]">
          {post.tags[0] ? (
            <span className="rounded-md bg-brand-light px-2 py-0.5 text-brand">{post.tags[0]}</span>
          ) : null}
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#6b6b6b]">{post.description}</p>

        <div className="mt-8 flex items-center gap-3 border-y border-[#ebebeb] py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            EK
          </div>
          <div>
            <p className="text-sm font-semibold">{post.author}</p>
            <p className="text-xs text-[#9b9b9b]">Product &amp; finance education</p>
          </div>
        </div>

        <article className="mt-10">
          <BlogMarkdown content={post.content} />
        </article>

        <aside className="mt-14 rounded-2xl border border-[#ebebeb] bg-[#fafafa] p-5 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand sm:text-sm sm:tracking-widest">
            Try ExpenseKit
          </p>
          <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
            Put policy before the spend hits your books
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6b6b6b]">
            14-day company trial. Policies, approvals, and GST-ready reports for Indian SMBs.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover sm:w-auto"
            >
              Start free trial
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#d1d1d1] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#fafafa] sm:w-auto"
            >
              View pricing
            </Link>
          </div>
        </aside>
      </main>

      <MarketingFooter />
    </div>
  );
}
