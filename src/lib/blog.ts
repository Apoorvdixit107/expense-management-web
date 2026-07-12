import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parsePostFile(filePath: string): BlogPost | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const filename = path.basename(filePath);

  const slug =
    typeof data.slug === "string" ? data.slug : filename.replace(/\.mdx?$/, "");

  if (data.draft === true) return null;

  const body = content.replace(/^#\s+.+\n+/, "").trim();

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    author: String(data.author ?? "ExpenseKit Team"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: false,
    readingMinutes: readingMinutes(body),
    content: body,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((name) => parsePostFile(path.join(BLOG_DIR, name)))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return posts.map(({ content: _content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const match = fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((name) => parsePostFile(path.join(BLOG_DIR, name)))
    .find((post) => post?.slug === slug);

  return match ?? null;
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export function formatPostDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
